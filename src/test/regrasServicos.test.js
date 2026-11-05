const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarNome,
  validarDescricao,
  validarPrecoBase,
  validarDuracaoHoras,
  validarGarantiaDias,
  validarAtivo,
  validarServico
} = require("../regrasServicos");

// ---------- Serviço real do Atlas ----------

describe("serviço no Atlas", () => {
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
      .collection("servicos")
      .findOne({ codigo: "S002" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o serviço S002", () => {
    assert.ok(documento, "Serviço não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const servico = validarServico(documento);

    assert.equal(servico.nome, "Upgrade de SSD");
    assert.equal(servico.descricao, "Troca do disco por SSD e clonagem do sistema");
    assert.equal(servico.preco_base, 120);
    assert.equal(servico.duracao_horas, 2);
    assert.equal(servico.garantia_dias, 90);
    assert.equal(servico.ativo, true);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de serviço", () => {
  test("codigo: aceita S001 e recusa outros formatos", () => {
    assert.equal(validarCodigo("S001"), "S001");
    assert.throws(() => validarCodigo("SV001"), /codigo/);
  });

  test("nome e descricao: obrigatórios", () => {
    assert.throws(() => validarNome("ab"), /nome/);
    assert.throws(() => validarDescricao(""), /descricao/);
  });

  test("preco_base: maior que zero", () => {
    assert.throws(() => validarPrecoBase(0), /preco_base/);
  });

  test("duracao_horas: maior que zero e até 24", () => {
    assert.equal(validarDuracaoHoras(1.5), 1.5);
    assert.throws(() => validarDuracaoHoras(0), /duracao_horas/);
    assert.throws(() => validarDuracaoHoras(30), /duracao_horas/);
  });

  test("garantia_dias: inteiro maior ou igual a zero", () => {
    assert.throws(() => validarGarantiaDias(-1), /garantia_dias/);
    assert.throws(() => validarGarantiaDias(10.5), /garantia_dias/);
  });

  test("ativo: só aceita boolean", () => {
    assert.throws(() => validarAtivo(0), /ativo/);
  });
});
