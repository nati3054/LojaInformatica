function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^CAT\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato CAT001");
  }
  return codigo;
}

function validarNome(nome) {
  if (typeof nome !== "string") {
    throw new Error("nome: deve ser texto");
  }
  const limpo = nome.trim();
  if (limpo.length < 3 || limpo.length > 50) {
    throw new Error("nome: deve ter entre 3 e 50 caracteres");
  }
  return limpo;
}

function validarDescricao(descricao) {
  if (typeof descricao !== "string" || descricao.trim().length === 0) {
    throw new Error("descricao: obrigatória");
  }
  const limpo = descricao.trim();
  if (limpo.length > 200) {
    throw new Error("descricao: deve ter no máximo 200 caracteres");
  }
  return limpo;
}

function validarAtivo(ativo) {
  if (typeof ativo !== "boolean") {
    throw new Error("ativo: deve ser true ou false");
  }
  return ativo;
}

function validarCategoria(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("categoria: documento obrigatório");
  }
  return {
    codigo: validarCodigo(doc.codigo),
    nome: validarNome(doc.nome),
    descricao: validarDescricao(doc.descricao),
    ativo: validarAtivo(doc.ativo)
  };
}

module.exports = {
  validarCodigo,
  validarNome,
  validarDescricao,
  validarAtivo,
  validarCategoria
};
