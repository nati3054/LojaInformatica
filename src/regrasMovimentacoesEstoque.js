const TIPOS = ["entrada", "saida", "ajuste"];

function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^MOV\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato MOV001");
  }
  return codigo;
}

function validarCodigoProduto(codigo) {
  if (typeof codigo !== "string" || !/^P\d{3,}$/.test(codigo)) {
    throw new Error("codigo_produto: use o formato P001");
  }
  return codigo;
}

function validarTipo(tipo) {
  if (!TIPOS.includes(tipo)) {
    throw new Error("tipo: use entrada, saida ou ajuste");
  }
  return tipo;
}

// entrada e saida: quantidade positiva; ajuste: pode ser negativo, mas nao zero
function validarQuantidade(quantidade, tipo) {
  if (!Number.isInteger(quantidade)) {
    throw new Error("quantidade: deve ser um número inteiro");
  }
  if ((tipo === "entrada" || tipo === "saida") && quantidade <= 0) {
    throw new Error("quantidade: entrada e saída devem ser maiores que zero");
  }
  if (tipo === "ajuste" && quantidade === 0) {
    throw new Error("quantidade: ajuste não pode ser zero");
  }
  return quantidade;
}

function validarData(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    throw new Error("data: data inválida");
  }
  if (data > new Date()) {
    throw new Error("data: não pode ser futura");
  }
  return data;
}

function validarResponsavel(responsavel) {
  if (typeof responsavel !== "string" || responsavel.trim().length < 3) {
    throw new Error("responsavel: deve ter pelo menos 3 caracteres");
  }
  return responsavel.trim();
}

function validarMotivo(motivo) {
  if (typeof motivo !== "string" || motivo.trim().length === 0) {
    throw new Error("motivo: obrigatório");
  }
  return motivo.trim();
}

function validarMovimentacao(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("movimentacao: documento obrigatório");
  }
  const tipo = validarTipo(doc.tipo);
  return {
    codigo: validarCodigo(doc.codigo),
    codigo_produto: validarCodigoProduto(doc.codigo_produto),
    tipo,
    quantidade: validarQuantidade(doc.quantidade, tipo),
    data: validarData(doc.data),
    responsavel: validarResponsavel(doc.responsavel),
    motivo: validarMotivo(doc.motivo)
  };
}

module.exports = {
  validarCodigo,
  validarCodigoProduto,
  validarTipo,
  validarQuantidade,
  validarData,
  validarResponsavel,
  validarMotivo,
  validarMovimentacao
};
