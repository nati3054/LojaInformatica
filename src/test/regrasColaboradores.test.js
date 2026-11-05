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
  validarCargo,
  validarSetor,
  validarSalario,
  validarDataAdmissao,
  validarAtivo,
  validarColaborador
} = require("../regrasColaboradores");

// ---------- Colaborador real do Atlas ----------

describe("colaborador no Atlas", () => {
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
      .collection("colaboradores")
      .findOne({ codigo: "COL003" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o colaborador COL003", () => {
    assert.ok(documento, "Colaborador não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const colaborador = validarColaborador(documento);

    assert.equal(colaborador.nome, "Rafael Antunes");
    assert.equal(colaborador.cargo, "Tecnico de Suporte");
    assert.equal(colaborador.setor, "Assistencia");
    assert.equal(colaborador.salario, 3400);
    assert.ok(colaborador.data_admissao instanceof Date);
    assert.equal(colaborador.data_admissao.toISOString().slice(0, 10), "2022-11-07");
    assert.equal(colaborador.ativo, true);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de colaborador", () => {
  test("codigo: aceita COL001 e recusa C001", () => {
    assert.equal(validarCodigo("COL001"), "COL001");
    assert.throws(() => validarCodigo("C001"), /codigo/);
  });

  test("nome: tira espaços e exige pelo menos 3 caracteres", () => {
    assert.equal(validarNome("  Ana Lima "), "Ana Lima");
    assert.throws(() => validarNome("Al"), /nome/);
  });

  test("cargo e setor: obrigatórios", () => {
    assert.throws(() => validarCargo(""), /cargo/);
    assert.throws(() => validarSetor(null), /setor/);
  });

  test("salario: deve ser maior que zero", () => {
    assert.throws(() => validarSalario(0), /salario/);
    assert.throws(() => validarSalario(-100), /salario/);
  });

  test("data_admissao: não pode ser inválida nem futura", () => {
    assert.throws(() => validarDataAdmissao(new Date("abc")), /data_admissao/);
    assert.throws(() => validarDataAdmissao(new Date("2999-01-01")), /futura/);
    assert.throws(() => validarDataAdmissao("2022-01-01"), /data_admissao/);
  });

  test("ativo: só aceita boolean", () => {
    assert.throws(() => validarAtivo("sim"), /ativo/);
  });
});
