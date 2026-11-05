const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { MongoClient } = require("mongodb");

const {
  validarCodigo,
  validarRazaoSocial,
  validarCnpj,
  validarContato,
  validarPrazoEntregaDias,
  validarMarcasAtendidas,
  validarAtivo,
  validarFornecedor
} = require("../regrasFornecedores");

// ---------- Fornecedor real do Atlas ----------

describe("fornecedor no Atlas", () => {
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
      .collection("fornecedores")
      .findOne({ codigo: "F002" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o fornecedor F002", () => {
    assert.ok(documento, "Fornecedor não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const fornecedor = validarFornecedor(documento);

    assert.equal(fornecedor.razao_social, "InfoParts Importadora SA");
    assert.equal(fornecedor.cnpj, "22333444000155");
    assert.equal(fornecedor.contato.nome, "Alexandre Dias");
    assert.equal(fornecedor.contato.email, "alexandre@infoparts.com");
    assert.equal(fornecedor.contato.telefone, "1140028922");
    assert.equal(fornecedor.prazo_entrega_dias, 15);
    assert.deepEqual(fornecedor.marcas_atendidas, ["MAR005", "MAR006"]);
    assert.equal(fornecedor.ativo, true);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de fornecedor", () => {
  test("codigo: aceita F001 e recusa outros formatos", () => {
    assert.equal(validarCodigo("F001"), "F001");
    assert.throws(() => validarCodigo("FOR001"), /codigo/);
  });

  test("razao_social: exige pelo menos 3 caracteres", () => {
    assert.throws(() => validarRazaoSocial("AB"), /razao_social/);
  });

  test("cnpj: tira a máscara e exige 14 dígitos", () => {
    assert.equal(validarCnpj("11.222.333/0001-44"), "11222333000144");
    assert.throws(() => validarCnpj("123.456.789-00"), /cnpj/);
  });

  test("contato: valida nome, email e telefone", () => {
    const ok = validarContato({ nome: "Ana", email: "ANA@X.COM", telefone: "(41) 3333-4444" });
    assert.equal(ok.email, "ana@x.com");
    assert.equal(ok.telefone, "4133334444");
    assert.throws(() => validarContato(null), /contato/);
    assert.throws(() => validarContato({ nome: "Ana", email: "ana@@x", telefone: "4133334444" }), /email/);
    assert.throws(() => validarContato({ nome: "Ana", email: "ana@x.com", telefone: "3333" }), /telefone/);
  });

  test("prazo_entrega_dias: inteiro maior que zero", () => {
    assert.throws(() => validarPrazoEntregaDias(0), /prazo_entrega_dias/);
  });

  test("marcas_atendidas: lista não vazia, formato MAR001, sem repetição", () => {
    assert.throws(() => validarMarcasAtendidas([]), /marcas_atendidas/);
    assert.throws(() => validarMarcasAtendidas(["DELL"]), /marcas_atendidas/);
    assert.throws(() => validarMarcasAtendidas(["MAR001", "MAR001"]), /repita/);
  });

  test("ativo: só aceita boolean", () => {
    assert.throws(() => validarAtivo(null), /ativo/);
  });
});
