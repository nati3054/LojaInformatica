const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarCodigoCliente,
  validarTipo,
  validarCodigoReferencia,
  validarNota,
  validarComentario,
  validarData,
  validarAvaliacao
} = require("../regrasAvaliacoes");

// ---------- Avaliação real do Atlas ----------

describe("avaliação no Atlas", () => {
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
      .collection("avaliacoes")
      .findOne({ codigo: "AV003" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra a avaliação AV003", () => {
    assert.ok(documento, "Avaliação não encontrada no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const avaliacao = validarAvaliacao(documento);

    assert.equal(avaliacao.codigo_cliente, "C001");
    assert.equal(avaliacao.tipo, "ordem_servico");
    assert.equal(avaliacao.codigo_referencia, "OS001");
    assert.equal(avaliacao.nota, 5);
    assert.equal(avaliacao.comentario, "Atendimento tecnico resolveu rapido.");
    assert.ok(avaliacao.data instanceof Date);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de avaliação", () => {
  test("codigo e codigo_cliente: formatos AV001 e C001", () => {
    assert.equal(validarCodigo("AV001"), "AV001");
    assert.throws(() => validarCodigo("A001"), /codigo/);
    assert.throws(() => validarCodigoCliente("AV001"), /codigo_cliente/);
  });

  test("tipo: só pedido ou ordem_servico", () => {
    assert.throws(() => validarTipo("produto"), /tipo/);
  });

  test("codigo_referencia: precisa combinar com o tipo", () => {
    assert.equal(validarCodigoReferencia("PE001", "pedido"), "PE001");
    assert.throws(() => validarCodigoReferencia("OS001", "pedido"), /PE001/);
    assert.throws(() => validarCodigoReferencia("PE001", "ordem_servico"), /OS001/);
  });

  test("nota: inteiro de 1 a 5", () => {
    assert.throws(() => validarNota(0), /nota/);
    assert.throws(() => validarNota(6), /nota/);
    assert.throws(() => validarNota(4.5), /nota/);
  });

  test("comentario: texto de até 500 caracteres", () => {
    assert.equal(validarComentario("  Ótimo  "), "Ótimo");
    assert.throws(() => validarComentario("x".repeat(501)), /comentario/);
    assert.throws(() => validarComentario(null), /comentario/);
  });

  test("data: não pode ser futura", () => {
    assert.throws(() => validarData(new Date("2999-01-01")), /futura/);
  });
});
