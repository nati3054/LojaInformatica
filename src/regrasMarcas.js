function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^MAR\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato MAR001");
  }
  return codigo;
}

function validarNome(nome) {
  if (typeof nome !== "string") {
    throw new Error("nome: deve ser texto");
  }
  const limpo = nome.trim();
  if (limpo.length < 2 || limpo.length > 50) {
    throw new Error("nome: deve ter entre 2 e 50 caracteres");
  }
  return limpo;
}

function validarPaisOrigem(pais) {
  if (typeof pais !== "string" || pais.trim().length === 0) {
    throw new Error("pais_origem: obrigatório");
  }
  return pais.trim();
}

// dominio simples: algo.algo, sem espacos e sem http://
function validarSite(site) {
  if (typeof site !== "string" || !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(site.trim())) {
    throw new Error("site: use o formato exemplo.com");
  }
  return site.trim().toLowerCase();
}

function validarAtivo(ativo) {
  if (typeof ativo !== "boolean") {
    throw new Error("ativo: deve ser true ou false");
  }
  return ativo;
}

function validarMarca(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("marca: documento obrigatório");
  }
  return {
    codigo: validarCodigo(doc.codigo),
    nome: validarNome(doc.nome),
    pais_origem: validarPaisOrigem(doc.pais_origem),
    site: validarSite(doc.site),
    ativo: validarAtivo(doc.ativo)
  };
}

module.exports = {
  validarCodigo,
  validarNome,
  validarPaisOrigem,
  validarSite,
  validarAtivo,
  validarMarca
};
