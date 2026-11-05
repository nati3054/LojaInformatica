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
  validarCodigoCategoria,
  validarCodigoMarca,
  validarPreco,
  validarEstoque,
  validarGarantiaMeses,
  validarEspecificacoes,
  validarProduto
} = require("../regrasProdutos");

// ---------- Produto real do Atlas ----------

describe("produto no Atlas", () => {
  let client;
  let documento;
  let semMarca;

  before(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const produtos = client.db("LojaInformatica").collection("produtos");
    documento = await produtos.findOne({ codigo: "P007" });
    semMarca = await produtos.findOne({ codigo: "P010" });
  });

  after(async () => {
    if (client) {
      await client.close();
    }
  });

  test("encontra o produto P007", () => {
    assert.ok(documento, "Produto não encontrado no Atlas");
  });

  test("passa nas regras e devolve os campos limpos", () => {
    const produto = validarProduto(documento);

    assert.equal(produto.nome, "SSD Kingston NV2 1TB");
    assert.equal(produto.codigo_categoria, "CAT005");
    assert.equal(produto.codigo_marca, "MAR005");
    assert.equal(produto.preco, 349.9);
    assert.equal(produto.estoque, 40);
    assert.equal(produto.garantia_meses, 36);
    assert.equal(produto.especificacoes.interface, "NVMe PCIe 4.0");
  });

  test("produto P010 sem marca (null) também é válido", () => {
    const produto = validarProduto(semMarca);
    assert.equal(produto.codigo_marca, null);
  });
});

// ---------- Regras de cada atributo ----------

describe("regras de produto", () => {
  test("codigo: aceita P001 e recusa PE001", () => {
    assert.equal(validarCodigo("P001"), "P001");
    assert.throws(() => validarCodigo("PE001"), /codigo/);
  });

  test("nome: exige entre 3 e 100 caracteres", () => {
    assert.throws(() => validarNome("SS"), /nome/);
  });

  test("codigo_categoria e codigo_marca: formato CAT001 / MAR001", () => {
    assert.throws(() => validarCodigoCategoria("MAR001"), /codigo_categoria/);
    assert.throws(() => validarCodigoMarca("CAT001"), /codigo_marca/);
    assert.equal(validarCodigoMarca(null), null);
  });

  test("preco: deve ser maior que zero", () => {
    assert.throws(() => validarPreco(0), /preco/);
    assert.throws(() => validarPreco("10"), /preco/);
  });

  test("estoque: inteiro maior ou igual a zero", () => {
    assert.equal(validarEstoque(0), 0);
    assert.throws(() => validarEstoque(-1), /estoque/);
    assert.throws(() => validarEstoque(1.5), /estoque/);
  });

  test("garantia_meses: entre 0 e 120", () => {
    assert.throws(() => validarGarantiaMeses(121), /garantia_meses/);
  });

  test("especificacoes: objeto com pelo menos um campo", () => {
    assert.throws(() => validarEspecificacoes({}), /especificacoes/);
    assert.throws(() => validarEspecificacoes(["a"]), /especificacoes/);
  });
});
