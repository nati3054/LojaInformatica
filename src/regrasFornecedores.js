function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^F\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato F001");
  }
  return codigo;
}

function validarRazaoSocial(razao) {
  if (typeof razao !== "string") {
    throw new Error("razao_social: deve ser texto");
  }
  const limpo = razao.trim();
  if (limpo.length < 3 || limpo.length > 150) {
    throw new Error("razao_social: deve ter entre 3 e 150 caracteres");
  }
  return limpo;
}

function validarCnpj(cnpj) {
  const soDigitos = String(cnpj ?? "").replace(/\D/g, "");
  if (soDigitos.length !== 14) {
    throw new Error("cnpj: deve ter 14 dígitos");
  }
  return soDigitos;
}

function validarEmail(email) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("contato.email: inválido");
  }
  return email.trim().toLowerCase();
}

function validarTelefone(telefone) {
  const soDigitos = String(telefone ?? "").replace(/\D/g, "");
  if (soDigitos.length < 10 || soDigitos.length > 11) {
    throw new Error("contato.telefone: informe DDD + número");
  }
  return soDigitos;
}

// contato e um subdocumento: { nome, email, telefone }
function validarContato(contato) {
  if (!contato || typeof contato !== "object") {
    throw new Error("contato: obrigatório");
  }
  if (typeof contato.nome !== "string" || contato.nome.trim().length < 3) {
    throw new Error("contato.nome: deve ter pelo menos 3 caracteres");
  }
  return {
    nome: contato.nome.trim(),
    email: validarEmail(contato.email),
    telefone: validarTelefone(contato.telefone)
  };
}

function validarPrazoEntregaDias(dias) {
  if (!Number.isInteger(dias) || dias <= 0) {
    throw new Error("prazo_entrega_dias: deve ser um inteiro maior que zero");
  }
  return dias;
}

function validarMarcasAtendidas(marcas) {
  if (!Array.isArray(marcas) || marcas.length === 0) {
    throw new Error("marcas_atendidas: informe pelo menos uma marca");
  }
  marcas.forEach(marca => {
    if (typeof marca !== "string" || !/^MAR\d{3,}$/.test(marca)) {
      throw new Error("marcas_atendidas: use o formato MAR001");
    }
  });
  if (new Set(marcas).size !== marcas.length) {
    throw new Error("marcas_atendidas: não repita a mesma marca");
  }
  return marcas;
}

function validarAtivo(ativo) {
  if (typeof ativo !== "boolean") {
    throw new Error("ativo: deve ser true ou false");
  }
  return ativo;
}

function validarFornecedor(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("fornecedor: documento obrigatório");
  }
  return {
    codigo: validarCodigo(doc.codigo),
    razao_social: validarRazaoSocial(doc.razao_social),
    cnpj: validarCnpj(doc.cnpj),
    contato: validarContato(doc.contato),
    prazo_entrega_dias: validarPrazoEntregaDias(doc.prazo_entrega_dias),
    marcas_atendidas: validarMarcasAtendidas(doc.marcas_atendidas),
    ativo: validarAtivo(doc.ativo)
  };
}

module.exports = {
  validarCodigo,
  validarRazaoSocial,
  validarCnpj,
  validarContato,
  validarPrazoEntregaDias,
  validarMarcasAtendidas,
  validarAtivo,
  validarFornecedor
};
