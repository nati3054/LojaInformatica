const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const test = require("node:test");
const { describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");
const {
  calcularPedido,
  validarCodigo,
  validarCodigoCliente,
  validarData,
  validarCanal,
  validarItens,
  validarTotal,
  validarStatus,
  validarPedido
} = require("../regrasPedidos");

test("calcula pedido usando produto real do Atlas", async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI não foi encontrada no arquivo .env");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db("LojaInformatica");

    const produto = await db.collection("produtos").findOne({
      nome: "Notebook Dell Inspiron 15"
    });

    assert.ok(produto, "Produto não encontrado no Atlas");
    assert.ok(produto.estoque >= 100, "Produto sem estoque disponível");

    const pedido = calcularPedido(
      [{ produtoId: produto._id, quantidade: 1 }],
      [produto]
    );

    assert.equal(pedido.total, produto.preco);
  } finally {
    await client.close();
  }
});

// ---------- Pedido real do Atlas ----------

describe("pedido no Atlas", () => {
  let client;
  let documento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    documento = await client
      .db("LojaInformatica")
      .collection("pedidos")
      .findOne({ codigo: "PE002" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o pedido PE002", () => {
    assert.ok(documento, "Pedido não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const pedido = validarPedido(documento);

    assert.equal(pedido.codigo_cliente, "C002");
    assert.equal(pedido.canal, "site");
    assert.equal(pedido.itens.length, 2);
    assert.equal(pedido.itens[0].codigo_produto, "P006");
    assert.equal(pedido.itens[0].quantidade, 2);
    assert.equal(pedido.total, 509.7);
    assert.equal(pedido.status, "enviado");
    assert.ok(pedido.data instanceof Date);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de pedido", () => {
  test("codigo e codigo_cliente: formatos PE001 e C001", () => {
    assert.equal(validarCodigo("PE001"), "PE001");
    assert.throws(() => validarCodigo("P001"), /codigo/);
    assert.throws(() => validarCodigoCliente("PE001"), /codigo_cliente/);
  });

  test("data: não pode ser futura", () => {
    assert.throws(() => validarData(new Date("2999-01-01")), /futura/);
  });

  test("canal: só loja_fisica, site ou telefone", () => {
    assert.throws(() => validarCanal("whatsapp"), /canal/);
  });

  test("itens: pelo menos um, sem repetir produto, quantidade positiva", () => {
    assert.throws(() => validarItens([]), /itens/);
    assert.throws(
      () => validarItens([
        { codigo_produto: "P001", quantidade: 1, preco_unitario: 10 },
        { codigo_produto: "P001", quantidade: 1, preco_unitario: 10 }
      ]),
      /repita/
    );
    assert.throws(
      () => validarItens([{ codigo_produto: "P001", quantidade: 0, preco_unitario: 10 }]),
      /quantidade/
    );
  });

  test("total: precisa bater com a soma dos itens", () => {
    const itens = [
      { codigo_produto: "P006", quantidade: 2, preco_unitario: 79.9 },
      { codigo_produto: "P007", quantidade: 1, preco_unitario: 349.9 }
    ];
    assert.equal(validarTotal(509.7, itens), 509.7);
    assert.throws(() => validarTotal(500, itens), /não confere/);
  });

  test("status: só status conhecidos", () => {
    assert.throws(() => validarStatus("aprovado"), /status/);
  });
});