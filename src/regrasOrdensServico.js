const STATUS = ["aberta", "aguardando_aprovacao", "em_andamento", "concluida", "cancelada"];

function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^OS\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato OS001");
  }
  return codigo;
}

function validarCodigoCliente(codigo) {
  if (typeof codigo !== "string" || !/^C\d{3,}$/.test(codigo)) {
    throw new Error("codigo_cliente: use o formato C001");
  }
  return codigo;
}

function validarCodigoServico(codigo) {
  if (typeof codigo !== "string" || !/^S\d{3,}$/.test(codigo)) {
    throw new Error("codigo_servico: use o formato S001");
  }
  return codigo;
}

function validarCodigoColaborador(codigo) {
  if (typeof codigo !== "string" || !/^COL\d{3,}$/.test(codigo)) {
    throw new Error("codigo_colaborador: use o formato COL001");
  }
  return codigo;
}

function validarEquipamento(equipamento) {
  if (typeof equipamento !== "string" || equipamento.trim().length === 0) {
    throw new Error("equipamento: obrigatório");
  }
  return equipamento.trim();
}

function validarDefeitoRelatado(defeito) {
  if (typeof defeito !== "string" || defeito.trim().length < 5) {
    throw new Error("defeito_relatado: descreva o defeito (mínimo 5 caracteres)");
  }
  return defeito.trim();
}

function validarStatus(status) {
  if (!STATUS.includes(status)) {
    throw new Error("status: use aberta, aguardando_aprovacao, em_andamento, concluida ou cancelada");
  }
  return status;
}

function validarValorTotal(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
    throw new Error("valor_total: deve ser um número maior ou igual a zero");
  }
  return Math.round(valor * 100) / 100;
}

function validarDataAbertura(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    throw new Error("data_abertura: data inválida");
  }
  if (data > new Date()) {
    throw new Error("data_abertura: não pode ser futura");
  }
  return data;
}

// concluida precisa de data_conclusao; os outros status ficam com null
function validarDataConclusao(data, status, dataAbertura) {
  if (status !== "concluida") {
    if (data !== null) {
      throw new Error("data_conclusao: deve ser null enquanto a OS não estiver concluída");
    }
    return null;
  }
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    throw new Error("data_conclusao: obrigatória para OS concluída");
  }
  if (data < dataAbertura) {
    throw new Error("data_conclusao: não pode ser antes da data_abertura");
  }
  return data;
}

function validarOrdemServico(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("ordem_servico: documento obrigatório");
  }
  const status = validarStatus(doc.status);
  const dataAbertura = validarDataAbertura(doc.data_abertura);
  return {
    codigo: validarCodigo(doc.codigo),
    codigo_cliente: validarCodigoCliente(doc.codigo_cliente),
    codigo_servico: validarCodigoServico(doc.codigo_servico),
    codigo_colaborador: validarCodigoColaborador(doc.codigo_colaborador),
    equipamento: validarEquipamento(doc.equipamento),
    defeito_relatado: validarDefeitoRelatado(doc.defeito_relatado),
    status,
    valor_total: validarValorTotal(doc.valor_total),
    data_abertura: dataAbertura,
    data_conclusao: validarDataConclusao(doc.data_conclusao, status, dataAbertura)
  };
}

module.exports = {
  validarCodigo,
  validarCodigoCliente,
  validarCodigoServico,
  validarCodigoColaborador,
  validarEquipamento,
  validarDefeitoRelatado,
  validarStatus,
  validarValorTotal,
  validarDataAbertura,
  validarDataConclusao,
  validarOrdemServico
};
