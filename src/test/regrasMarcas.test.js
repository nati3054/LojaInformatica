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
  validarPaisOrigem,
  validarSite,
  validarAtivo,
  validarMarca
} = require("../regrasMarcas");

// ---------- Marca real do Atlas ----------

describe("marca no Atlas", () => {
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
      .collection("marcas")
      .findOne({ codigo: "MAR004" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra a marca MAR004", () => {
    assert.ok(documento, "Marca não encontrada no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const marca = validarMarca(documento);

    assert.equal(marca.codigo, "MAR004");
    assert.equal(marca.nome, "Logitech");
    assert.equal(marca.pais_origem, "Suica");
    assert.equal(marca.site, "logitech.com");
    assert.equal(marca.ativo, true);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de marca", () => {
  test("codigo: aceita MAR001 e recusa outros formatos", () => {
    assert.equal(validarCodigo("MAR001"), "MAR001");
    assert.throws(() => validarCodigo("M001"), /codigo/);
  });

  test("nome: aceita nomes curtos como HP, recusa vazio", () => {
    assert.equal(validarNome("HP"), "HP");
    assert.throws(() => validarNome(" "), /nome/);
  });

  test("pais_origem: obrigatório", () => {
    assert.throws(() => validarPaisOrigem(""), /pais_origem/);
  });

  test("site: normaliza para minúsculas e recusa formato inválido", () => {
    assert.equal(validarSite("Dell.COM"), "dell.com");
    assert.throws(() => validarSite("dell"), /site/);
    assert.throws(() => validarSite("dell .com"), /site/);
  });

  test("ativo: só aceita boolean", () => {
    assert.throws(() => validarAtivo(1), /ativo/);
  });
});
