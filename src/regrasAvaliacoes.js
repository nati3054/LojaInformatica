const TIPOS = ["pedido", "ordem_servico"];

function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^AV\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato AV001");
  }
  return codigo;
}

function validarCodigoCliente(codigo) {
  if (typeof codigo !== "string" || !/^C\d{3,}$/.test(codigo)) {
    throw new Error("codigo_cliente: use o formato C001");
  }
  return codigo;
}

function validarTipo(tipo) {
  if (!TIPOS.includes(tipo)) {
    throw new Error("tipo: use pedido ou ordem_servico");
  }
  return tipo;
}

// a referencia depende do tipo: pedido -> PE001, ordem_servico -> OS001
function validarCodigoReferencia(codigo, tipo) {
  const formato = tipo === "pedido" ? /^PE\d{3,}$/ : /^OS\d{3,}$/;
  if (typeof codigo !== "string" || !formato.test(codigo)) {
    throw new Error(
      tipo === "pedido"
        ? "codigo_referencia: use o formato PE001 para pedido"
        : "codigo_referencia: use o formato OS001 para ordem_servico"
    );
  }
  return codigo;
}

function validarNota(nota) {
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw new Error("nota: deve ser um inteiro de 1 a 5");
  }
  return nota;
}

function validarComentario(comentario) {
  if (typeof comentario !== "string") {
    throw new Error("comentario: deve ser texto");
  }
  const limpo = comentario.trim();
  if (limpo.length > 500) {
    throw new Error("comentario: deve ter no máximo 500 caracteres");
  }
  return limpo;
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

function validarAvaliacao(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("avaliacao: documento obrigatório");
  }
  const tipo = validarTipo(doc.tipo);
  return {
    codigo: validarCodigo(doc.codigo),
    codigo_cliente: validarCodigoCliente(doc.codigo_cliente),
    tipo,
    codigo_referencia: validarCodigoReferencia(doc.codigo_referencia, tipo),
    nota: validarNota(doc.nota),
    comentario: validarComentario(doc.comentario),
    data: validarData(doc.data)
  };
}

module.exports = {
  validarCodigo,
  validarCodigoCliente,
  validarTipo,
  validarCodigoReferencia,
  validarNota,
  validarComentario,
  validarData,
  validarAvaliacao
};
