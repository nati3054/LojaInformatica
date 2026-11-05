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
  validarCodigoServico,
  validarCodigoColaborador,
  validarEquipamento,
  validarDefeitoRelatado,
  validarStatus,
  validarValorTotal,
  validarDataAbertura,
  validarDataConclusao,
  validarOrdemServico
} = require("../regrasOrdensServico");

// ---------- Ordem de serviço real do Atlas ----------

describe("ordem de serviço no Atlas", () => {
  let client;
  let concluida;
  let emAndamento;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const ordens = client.db("LojaInformatica").collection("ordens_servico");
    concluida = await ordens.findOne({ codigo: "OS001" });
    emAndamento = await ordens.findOne({ codigo: "OS003" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra as ordens OS001 e OS003", () => {
    assert.ok(concluida, "Ordem OS001 não encontrada no Atlas");
    assert.ok(emAndamento, "Ordem OS003 não encontrada no Atlas");
  });

  test("OS concluída passa nas regras e devolve os campos limpos", () => {
    const os = validarOrdemServico(concluida);

    assert.equal(os.codigo_cliente, "C001");
    assert.equal(os.codigo_servico, "S001");
    assert.equal(os.codigo_colaborador, "COL003");
    assert.equal(os.equipamento, "Notebook Dell Inspiron 15");
    assert.equal(os.status, "concluida");
    assert.equal(os.valor_total, 180);
    assert.equal(os.data_abertura.toISOString().slice(0, 10), "2026-09-08");
    assert.equal(os.data_conclusao.toISOString().slice(0, 10), "2026-09-10");
  });

  test("OS em andamento fica com data_conclusao null", () => {
    const os = validarOrdemServico(emAndamento);

    assert.equal(os.status, "em_andamento");
    assert.equal(os.data_conclusao, null);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de ordem de serviço", () => {
  test("codigos: OS001, C001, S001 e COL001", () => {
    assert.equal(validarCodigo("OS001"), "OS001");
    assert.throws(() => validarCodigo("O001"), /codigo/);
    assert.throws(() => validarCodigoCliente("COL001"), /codigo_cliente/);
    assert.throws(() => validarCodigoServico("OS001"), /codigo_servico/);
    assert.throws(() => validarCodigoColaborador("C001"), /codigo_colaborador/);
  });

  test("equipamento e defeito_relatado: obrigatórios", () => {
    assert.throws(() => validarEquipamento(" "), /equipamento/);
    assert.throws(() => validarDefeitoRelatado("ruim"), /defeito_relatado/);
  });

  test("status: só status conhecidos", () => {
    assert.throws(() => validarStatus("finalizada"), /status/);
  });

  test("valor_total: não pode ser negativo", () => {
    assert.equal(validarValorTotal(0), 0);
    assert.throws(() => validarValorTotal(-1), /valor_total/);
  });

  test("data_abertura: não pode ser futura", () => {
    assert.throws(() => validarDataAbertura(new Date("2999-01-01")), /futura/);
  });

  test("data_conclusao: obrigatória só quando concluída e depois da abertura", () => {
    const abertura = new Date("2026-09-10");
    assert.throws(() => validarDataConclusao(null, "concluida", abertura), /obrigatória/);
    assert.throws(() => validarDataConclusao(new Date("2026-09-01"), "concluida", abertura), /antes/);
    assert.throws(() => validarDataConclusao(new Date("2026-09-12"), "aberta", abertura), /null/);
    assert.equal(validarDataConclusao(null, "aberta", abertura), null);
  });
});
