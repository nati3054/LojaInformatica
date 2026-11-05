const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarCodigoProduto,
  validarTipo,
  validarQuantidade,
  validarData,
  validarResponsavel,
  validarMotivo,
  validarMovimentacao
} = require("../regrasMovimentacoesEstoque");

// ---------- Movimentação real do Atlas ----------

describe("movimentação de estoque no Atlas", () => {
  let client;
  let entrada;
  let ajuste;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const movimentacoes = client.db("LojaInformatica").collection("movimentacoes_estoque");
    entrada = await movimentacoes.findOne({ codigo: "MOV001" });
    ajuste = await movimentacoes.findOne({ codigo: "MOV007" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra as movimentações MOV001 e MOV007", () => {
    assert.ok(entrada, "Movimentação MOV001 não encontrada no Atlas");
    assert.ok(ajuste, "Movimentação MOV007 não encontrada no Atlas");
  });

  test("entrada passa nas regras e devolve os campos limpos", () => {
    const mov = validarMovimentacao(entrada);

    assert.equal(mov.codigo_produto, "P001");
    assert.equal(mov.tipo, "entrada");
    assert.equal(mov.quantidade, 20);
    assert.equal(mov.responsavel, "Patricia Nogueira");
    assert.ok(mov.data instanceof Date);
  });

  test("ajuste com quantidade negativa também é válido", () => {
    const mov = validarMovimentacao(ajuste);

    assert.equal(mov.tipo, "ajuste");
    assert.equal(mov.quantidade, -1);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de movimentação de estoque", () => {
  test("codigo e codigo_produto: formatos MOV001 e P001", () => {
    assert.equal(validarCodigo("MOV001"), "MOV001");
    assert.throws(() => validarCodigo("M001"), /codigo/);
    assert.throws(() => validarCodigoProduto("PROD1"), /codigo_produto/);
  });

  test("tipo: só entrada, saida ou ajuste", () => {
    assert.throws(() => validarTipo("devolucao"), /tipo/);
  });

  test("quantidade: depende do tipo", () => {
    assert.equal(validarQuantidade(5, "saida"), 5);
    assert.throws(() => validarQuantidade(-5, "entrada"), /quantidade/);
    assert.throws(() => validarQuantidade(0, "ajuste"), /quantidade/);
    assert.throws(() => validarQuantidade(1.5, "entrada"), /quantidade/);
  });

  test("data: não pode ser futura", () => {
    assert.throws(() => validarData(new Date("2999-01-01")), /futura/);
  });

  test("responsavel e motivo: obrigatórios", () => {
    assert.throws(() => validarResponsavel("Jo"), /responsavel/);
    assert.throws(() => validarMotivo(""), /motivo/);
  });
});
