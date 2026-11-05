
function calcularPedido(itens, produtos) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error("O pedido precisa ter pelo menos um item.");
  }

  const ids = itens.map(item => String(item.produtoId));

  if (new Set(ids).size !== ids.length) {
    throw new Error("Não repita o mesmo produto no pedido.");
  }

  const itensCalculados = itens.map(item => {
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new Error("A quantidade deve ser um inteiro positivo.");
    }

    const produto = produtos.find(
      produto => String(produto._id) === String(item.produtoId)
    );

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    if (!Number.isInteger(produto.estoque) || produto.estoque < item.quantidade) {
      throw new Error("Estoque insuficiente.");
    }

    if (typeof produto.preco !== "number" || produto.preco < 0) {
      throw new Error("Preço inválido.");
    }

    return {
      produtoId: produto._id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco
    };
  });

  const totalCentavos = itensCalculados.reduce(
    (soma, item) =>
      soma + Math.round(item.precoUnitario * 100) * item.quantidade,
    0
  );

  return {
    itens: itensCalculados,
    total: totalCentavos / 100
  };
}

// ---------- Validação dos atributos da collection pedidos ----------

const CANAIS = ["loja_fisica", "site", "telefone"];
const STATUS = ["aguardando_pagamento", "pago", "enviado", "entregue", "cancelado"];

function validarCodigo(codigo) {
  if (typeof codigo !== "string" || !/^PE\d{3,}$/.test(codigo)) {
    throw new Error("codigo: use o formato PE001");
  }
  return codigo;
}

function validarCodigoCliente(codigo) {
  if (typeof codigo !== "string" || !/^C\d{3,}$/.test(codigo)) {
    throw new Error("codigo_cliente: use o formato C001");
  }
  return codigo;
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

function validarCanal(canal) {
  if (!CANAIS.includes(canal)) {
    throw new Error("canal: use loja_fisica, site ou telefone");
  }
  return canal;
}

function validarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error("itens: o pedido precisa ter pelo menos um item");
  }
  const codigos = itens.map(item => item && item.codigo_produto);
  if (new Set(codigos).size !== codigos.length) {
    throw new Error("itens: não repita o mesmo produto no pedido");
  }
  return itens.map(item => {
    if (typeof item.codigo_produto !== "string" || !/^P\d{3,}$/.test(item.codigo_produto)) {
      throw new Error("itens.codigo_produto: use o formato P001");
    }
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new Error("itens.quantidade: deve ser um inteiro positivo");
    }
    if (typeof item.preco_unitario !== "number" || !Number.isFinite(item.preco_unitario) || item.preco_unitario < 0) {
      throw new Error("itens.preco_unitario: deve ser um número maior ou igual a zero");
    }
    return {
      codigo_produto: item.codigo_produto,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario
    };
  });
}

// o total gravado tem que bater com a soma dos itens (conta feita em centavos)
function validarTotal(total, itens) {
  if (typeof total !== "number" || !Number.isFinite(total) || total < 0) {
    throw new Error("total: deve ser um número maior ou igual a zero");
  }
  const somaCentavos = itens.reduce(
    (soma, item) => soma + Math.round(item.preco_unitario * 100) * item.quantidade,
    0
  );
  if (Math.round(total * 100) !== somaCentavos) {
    throw new Error("total: não confere com a soma dos itens");
  }
  return somaCentavos / 100;
}

function validarStatus(status) {
  if (!STATUS.includes(status)) {
    throw new Error("status: use aguardando_pagamento, pago, enviado, entregue ou cancelado");
  }
  return status;
}

function validarPedido(doc) {
  if (!doc || typeof doc !== "object") {
    throw new Error("pedido: documento obrigatório");
  }
  const itens = validarItens(doc.itens);
  return {
    codigo: validarCodigo(doc.codigo),
    codigo_cliente: validarCodigoCliente(doc.codigo_cliente),
    data: validarData(doc.data),
    canal: validarCanal(doc.canal),
    itens,
    total: validarTotal(doc.total, itens),
    status: validarStatus(doc.status)
  };
}

module.exports = {
  calcularPedido,
  validarCodigo,
  validarCodigoCliente,
  validarData,
  validarCanal,
  validarItens,
  validarTotal,
  validarStatus,
  validarPedido
};