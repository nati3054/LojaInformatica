const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarCodigoPedido,
  validarForma,
  validarValor,
  validarParcelas,
  validarStatus,
  validarData,
  validarTransacaoId,
  validarPagamento
} = require("../regrasPagamentos");

// ---------- Pagamento real do Atlas ----------

describe("pagamento no Atlas", () => {
  let client;
  let aprovado;
  let pendente;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const pagamentos = client.db("LojaInformatica").collection("pagamentos");
    aprovado = await pagamentos.findOne({ codigo: "PG002" });
    pendente = await pagamentos.findOne({ codigo: "PG004" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra os pagamentos PG002 e PG004", () => {
    assert.ok(aprovado, "Pagamento PG002 não encontrado no Atlas");
    assert.ok(pendente, "Pagamento PG004 não encontrado no Atlas");
  });

  test("pagamento aprovado passa nas regras e devolve os campos limpos", () => {
    const pagamento = validarPagamento(aprovado);

    assert.equal(pagamento.codigo_pedido, "PE002");
    assert.equal(pagamento.forma, "cartao_credito");
    assert.equal(pagamento.valor, 509.7);
    assert.equal(pagamento.parcelas, 3);
    assert.equal(pagamento.status, "aprovado");
    assert.equal(pagamento.transacao_id, "TX-90002");
    assert.ok(pagamento.data instanceof Date);
  });

  test("pagamento pendente pode ficar sem transacao_id", () => {
    const pagamento = validarPagamento(pendente);

    assert.equal(pagamento.status, "pendente");
    assert.equal(pagamento.transacao_id, null);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de pagamento", () => {
  test("codigo e codigo_pedido: formatos PG001 e PE001", () => {
    assert.equal(validarCodigo("PG001"), "PG001");
    assert.throws(() => validarCodigo("P001"), /codigo/);
    assert.throws(() => validarCodigoPedido("PG001"), /codigo_pedido/);
  });

  test("forma: só formas conhecidas", () => {
    assert.throws(() => validarForma("dinheiro"), /forma/);
  });

  test("valor: maior que zero", () => {
    assert.throws(() => validarValor(0), /valor/);
  });

  test("parcelas: de 1 a 12 e só no cartão de crédito", () => {
    assert.equal(validarParcelas(10, "cartao_credito"), 10);
    assert.throws(() => validarParcelas(13, "cartao_credito"), /parcelas/);
    assert.throws(() => validarParcelas(2, "pix"), /crédito/);
    assert.throws(() => validarParcelas(0, "pix"), /parcelas/);
  });

  test("status: só status conhecidos", () => {
    assert.throws(() => validarStatus("pago"), /status/);
  });

  test("data: não pode ser futura", () => {
    assert.throws(() => validarData(new Date("2999-01-01")), /futura/);
  });

  test("transacao_id: obrigatório quando aprovado", () => {
    assert.throws(() => validarTransacaoId(null, "aprovado"), /transacao_id/);
    assert.throws(() => validarTransacaoId("90001", "aprovado"), /transacao_id/);
    assert.equal(validarTransacaoId(null, "pendente"), null);
  });
});
