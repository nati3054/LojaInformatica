const FORMAS = ["pix", "boleto", "cartao_credito", "cartao_debito"];
const STATUS = ["pendente", "aprovado", "recusado", "estornado"];

function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^PG\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato PG001");
  }
  return codigo;
}

function validarCodigoPedido(codigo) {
  if (typeof codigo !== "string" || !/^PE\d{3,}$/.test(codigo)) {
    throw new Error("codigo_pedido: use o formato PE001");
  }
  return codigo;
}

function validarForma(forma) {
  if (!FORMAS.includes(forma)) {
    throw new Error("forma: use pix, boleto, cartao_credito ou cartao_debito");
  }
  return forma;
}

function validarValor(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
    throw new Error("valor: deve ser um número maior que zero");
  }
  return Math.round(valor * 100) / 100;
}

// so cartao de credito pode parcelar (ate 12x); o resto e sempre 1x
function validarParcelas(parcelas, forma) {
  if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > 12) {
    throw new Error("parcelas: deve ser um inteiro entre 1 e 12");
  }
  if (forma !== "cartao_credito" && parcelas !== 1) {
    throw new Error("parcelas: só cartão de crédito pode ser parcelado");
  }
  return parcelas;
}

function validarStatus(status) {
  if (!STATUS.includes(status)) {
    throw new Error("status: use pendente, aprovado, recusado ou estornado");
  }
  return status;
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

// pagamento pendente ainda nao tem transacao; aprovado/estornado precisa ter
function validarTransacaoId(transacaoId, status) {
  if (transacaoId === null) {
    if (status === "aprovado" || status === "estornado") {
      throw new Error("transacao_id: obrigatório para pagamento aprovado ou estornado");
    }
    return null;
  }
  if (typeof transacaoId !== "string" || !/^TX-\d+$/.test(transacaoId)) {
    throw new Error("transacao_id: use o formato TX-90001 ou null");
  }
  return transacaoId;
}

function validarPagamento(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("pagamento: documento obrigatório");
  }
  const forma = validarForma(doc.forma);
  const status = validarStatus(doc.status);
  return {
    codigo: validarCodigo(doc.codigo),
    codigo_pedido: validarCodigoPedido(doc.codigo_pedido),
    forma,
    valor: validarValor(doc.valor),
    parcelas: validarParcelas(doc.parcelas, forma),
    status,
    data: validarData(doc.data),
    transacao_id: validarTransacaoId(doc.transacao_id, status)
  };
}

module.exports = {
  validarCodigo,
  validarCodigoPedido,
  validarForma,
  validarValor,
  validarParcelas,
  validarStatus,
  validarData,
  validarTransacaoId,
  validarPagamento
};
