function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^P\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato P001");
  }
  return codigo;
}

function validarNome(nome) {
  if (typeof nome !== "string") {
    throw new Error("nome: deve ser texto");
  }
  const limpo = nome.trim();
  if (limpo.length < 3 || limpo.length > 100) {
    throw new Error("nome: deve ter entre 3 e 100 caracteres");
  }
  return limpo;
}

function validarCodigoCategoria(codigo) {
  if (typeof codigo !== "string" || !/^CAT\d{3,}$/.test(codigo)) {
    throw new Error("codigo_categoria: use o formato CAT001");
  }
  return codigo;
}

// marca pode ser null (ex.: desktop montado pela propria loja)
function validarCodigoMarca(codigo) {
  if (codigo === null) {
    return null;
  }
  if (typeof codigo !== "string" || !/^MAR\d{3,}$/.test(codigo)) {
    throw new Error("codigo_marca: use o formato MAR001 ou null");
  }
  return codigo;
}

function validarPreco(preco) {
  if (typeof preco !== "number" || !Number.isFinite(preco) || preco <= 0) {
    throw new Error("preco: deve ser um número maior que zero");
  }
  return Math.round(preco * 100) / 100;
}

function validarEstoque(estoque) {
  if (!Number.isInteger(estoque) || estoque < 0) {
    throw new Error("estoque: deve ser um inteiro maior ou igual a zero");
  }
  return estoque;
}

function validarGarantiaMeses(meses) {
  if (!Number.isInteger(meses) || meses < 0 || meses > 120) {
    throw new Error("garantia_meses: deve ser um inteiro entre 0 e 120");
  }
  return meses;
}

function validarEspecificacoes(especificacoes) {
  if (!especificacoes || typeof especificacoes !== "object" || Array.isArray(especificacoes)) {
    throw new Error("especificacoes: deve ser um objeto");
  }
  if (Object.keys(especificacoes).length === 0) {
    throw new Error("especificacoes: informe pelo menos uma especificação");
  }
  return especificacoes;
}

function validarProduto(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("produto: documento obrigatório");
  }
  return {
    codigo: validarCodigo(doc.codigo),
    nome: validarNome(doc.nome),
    codigo_categoria: validarCodigoCategoria(doc.codigo_categoria),
    codigo_marca: validarCodigoMarca(doc.codigo_marca),
    preco: validarPreco(doc.preco),
    estoque: validarEstoque(doc.estoque),
    garantia_meses: validarGarantiaMeses(doc.garantia_meses),
    especificacoes: validarEspecificacoes(doc.especificacoes)
  };
}

module.exports = {
  validarCodigo,
  validarNome,
  validarCodigoCategoria,
  validarCodigoMarca,
  validarPreco,
  validarEstoque,
  validarGarantiaMeses,
  validarEspecificacoes,
  validarProduto
};
