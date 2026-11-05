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
  validarAtivo,
  validarCategoria
} = require("../regrasCategorias");

// ---------- Categoria real do Atlas ----------

describe("categoria no Atlas", () => {
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
      .collection("categorias")
      .findOne({ codigo: "CAT003" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra a categoria CAT003", () => {
    assert.ok(documento, "Categoria não encontrada no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const categoria = validarCategoria(documento);

    assert.equal(categoria.codigo, "CAT003");
    assert.equal(categoria.nome, "Monitores");
    assert.equal(categoria.descricao, "Monitores e telas");
    assert.equal(categoria.ativo, true);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de categoria", () => {
  test("codigo: aceita CAT001 e recusa outros formatos", () => {
    assert.equal(validarCodigo("CAT001"), "CAT001");
    assert.throws(() => validarCodigo("C001"), /codigo/);
    assert.throws(() => validarCodigo("cat001"), /codigo/);
  });

  test("nome: tira espaços e exige entre 3 e 50 caracteres", () => {
    assert.equal(validarNome("  Redes  "), "Redes");
    assert.throws(() => validarNome("TV"), /nome/);
    assert.throws(() => validarNome(123), /nome/);
  });

  test("descricao: obrigatória", () => {
    assert.throws(() => validarDescricao("   "), /descricao/);
    assert.throws(() => validarDescricao("x".repeat(201)), /descricao/);
  });

  test("ativo: só aceita boolean", () => {
    assert.equal(validarAtivo(false), false);
    assert.throws(() => validarAtivo("true"), /ativo/);
  });
});
