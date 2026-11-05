const database = "LojaInformatica";
use(database);

// ---------------------------------------------------------------------------
// Este script pode ser executado quantas vezes quiser SEM duplicar dados:
//  - cria a colecao so se ela ainda nao existir
//  - cria indice unico em "codigo" (o banco recusa codigo repetido)
//  - salvar() usa upsert: se o codigo ja existe, atualiza; se nao, insere
// ---------------------------------------------------------------------------
const colecoes = [
  "clientes", "produtos", "colaboradores", "categorias", "marcas", "pedidos",
  "pagamentos", "fornecedores", "movimentacoes_estoque", "servicos",
  "ordens_servico", "avaliacoes"
];

const existentes = db.getCollectionNames();
colecoes.forEach(nome => {
  if (!existentes.includes(nome)) {
    db.createCollection(nome);
    print("Colecao criada: " + nome);
  }
  try {
    db.getCollection(nome).createIndex({ codigo: 1 }, { unique: true });
  } catch (e) {
    print("ATENCAO: " + nome + " ja tem codigos duplicados, indice unico nao criado: " + e.message);
  }
});

function salvar(nomeColecao, doc) {
  db.getCollection(nomeColecao).replaceOne({ codigo: doc.codigo }, doc, { upsert: true });
}
//************************************************************************** */
salvar("categorias", { codigo: "CAT001", nome: "Notebooks",   descricao: "Notebooks e ultrabooks",               ativo: true });
salvar("categorias", { codigo: "CAT002", nome: "Desktops",    descricao: "Computadores de mesa e kits montados", ativo: true });
salvar("categorias", { codigo: "CAT003", nome: "Monitores",   descricao: "Monitores e telas",                    ativo: true });
salvar("categorias", { codigo: "CAT004", nome: "Perifericos", descricao: "Teclados, mouses, headsets e webcams", ativo: true });
salvar("categorias", { codigo: "CAT005", nome: "Componentes", descricao: "SSD, memorias, placas e fontes",       ativo: true });
salvar("categorias", { codigo: "CAT006", nome: "Redes",       descricao: "Roteadores, switches e cabos",         ativo: true });
//*****************************************************************************/
salvar("marcas", { codigo: "MAR001", nome: "Dell",     pais_origem: "EUA",    site: "dell.com",     ativo: true });
salvar("marcas", { codigo: "MAR002", nome: "Lenovo",   pais_origem: "China",  site: "lenovo.com",   ativo: true });
salvar("marcas", { codigo: "MAR003", nome: "Acer",     pais_origem: "Taiwan", site: "acer.com",     ativo: true });
salvar("marcas", { codigo: "MAR004", nome: "Logitech", pais_origem: "Suica",  site: "logitech.com", ativo: true });
salvar("marcas", { codigo: "MAR005", nome: "Kingston", pais_origem: "EUA",    site: "kingston.com", ativo: true });
salvar("marcas", { codigo: "MAR006", nome: "TP-Link",  pais_origem: "China",  site: "tp-link.com",  ativo: true });
/***************************************************************************/
salvar("produtos", {
  codigo: "P001", nome: "Notebook Dell Inspiron 15", codigo_categoria: "CAT001", codigo_marca: "MAR001",
  preco: 3899.90, estoque: 12, garantia_meses: 12,
  especificacoes: { processador: "i5-1235U", memoria_gb: 8, armazenamento: "SSD 256GB", tela: "15.6 Full HD" }
});

salvar("produtos", {
  codigo: "P002", nome: "Notebook Lenovo IdeaPad 3", codigo_categoria: "CAT001", codigo_marca: "MAR002",
  preco: 3299.00, estoque: 8, garantia_meses: 12,
  especificacoes: { processador: "Ryzen 5 5500U", memoria_gb: 8, armazenamento: "SSD 512GB", tela: "15.6 Full HD" }
});

salvar("produtos", {
  codigo: "P003", nome: "Notebook Acer Aspire 5", codigo_categoria: "CAT001", codigo_marca: "MAR003",
  preco: 3549.90, estoque: 15, garantia_meses: 12,
  especificacoes: { processador: "i5-1135G7", memoria_gb: 16, armazenamento: "SSD 512GB", tela: "15.6 Full HD" }
});

salvar("produtos", {
  codigo: "P004", nome: "Monitor Dell 24 Polegadas", codigo_categoria: "CAT003", codigo_marca: "MAR001",
  preco: 899.00, estoque: 22, garantia_meses: 36,
  especificacoes: { tamanho: "23.8", resolucao: "1920x1080", painel: "IPS", conexoes: ["HDMI", "DisplayPort"] }
});

salvar("produtos", {
  codigo: "P005", nome: "Teclado Mecanico Logitech G413", codigo_categoria: "CAT004", codigo_marca: "MAR004",
  preco: 429.90, estoque: 30, garantia_meses: 24,
  especificacoes: { layout: "ABNT2", switch: "Romer-G", iluminacao: "LED vermelho" }
});

salvar("produtos", {
  codigo: "P006", nome: "Mouse Logitech M170", codigo_categoria: "CAT004", codigo_marca: "MAR004",
  preco: 79.90, estoque: 60, garantia_meses: 12,
  especificacoes: { conexao: "Wireless 2.4GHz", botoes: 3, pilha_inclusa: true }
});

salvar("produtos", {
  codigo: "P007", nome: "SSD Kingston NV2 1TB", codigo_categoria: "CAT005", codigo_marca: "MAR005",
  preco: 349.90, estoque: 40, garantia_meses: 36,
  especificacoes: { interface: "NVMe PCIe 4.0", leitura_mb_s: 3500, escrita_mb_s: 2100 }
});

salvar("produtos", {
  codigo: "P008", nome: "Roteador TP-Link Archer C6", codigo_categoria: "CAT006", codigo_marca: "MAR006",
  preco: 259.90, estoque: 18, garantia_meses: 24,
  especificacoes: { padrao: "AC1200", bandas: "dual band", portas_lan: 4 }
});

salvar("produtos", {
  codigo: "P009", nome: "Memoria Kingston DDR4 8GB", codigo_categoria: "CAT005", codigo_marca: "MAR005",
  preco: 189.90, estoque: 35, garantia_meses: 120,
  especificacoes: { frequencia_mhz: 3200, tipo: "DDR4", dissipador: false }
});

salvar("produtos", {
  codigo: "P010", nome: "Desktop Montado Ryzen 5", codigo_categoria: "CAT002", codigo_marca: null,
  preco: 4290.00, estoque: 5, garantia_meses: 12,
  especificacoes: { processador: "Ryzen 5 5600", memoria_gb: 16, armazenamento: "SSD 1TB", fonte: "550W 80 Plus" }
});
/***************************************************************************/
salvar("clientes", {
  codigo: "C001", nome: "Ana Paula Ribeiro", tipo: "PF", documento: "123.456.789-00",
  email: "ana.ribeiro@email.com", telefone: "(41) 99811-2233", cidade: "Curitiba", uf: "PR",
  data_cadastro: new Date("2026-01-14"), ativo: true
});

salvar("clientes", {
  codigo: "C002", nome: "Bruno Carvalho Lima", tipo: "PF", documento: "987.654.321-00",
  email: "bruno.lima@email.com", telefone: "(41) 99744-8899", cidade: "Curitiba", uf: "PR",
  data_cadastro: new Date("2026-02-03"), ativo: true
});

salvar("clientes", {
  codigo: "C003", nome: "TecnoForte Solucoes LTDA", tipo: "PJ", documento: "12.345.678/0001-90",
  email: "compras@tecnoforte.com.br", telefone: "(41) 3322-4455", cidade: "Sao Jose dos Pinhais", uf: "PR",
  data_cadastro: new Date("2026-02-21"), ativo: true
});

salvar("clientes", {
  codigo: "C004", nome: "Carla Menezes Souza", tipo: "PF", documento: "456.789.123-00",
  email: "carla.souza@email.com", telefone: "(47) 99666-1122", cidade: "Joinville", uf: "SC",
  data_cadastro: new Date("2026-03-09"), ativo: true
});

salvar("clientes", {
  codigo: "C005", nome: "Escola Saber Digital", tipo: "PJ", documento: "98.765.432/0001-10",
  email: "ti@escolasaber.edu.br", telefone: "(41) 3444-7788", cidade: "Curitiba", uf: "PR",
  data_cadastro: new Date("2026-04-18"), ativo: true
});

salvar("clientes", {
  codigo: "C006", nome: "Diego Fontes Alves", tipo: "PF", documento: "321.654.987-00",
  email: "diego.alves@email.com", telefone: "(41) 99333-4455", cidade: "Colombo", uf: "PR",
  data_cadastro: new Date("2026-05-27"), ativo: false
});
/***************************************************************************/
salvar("colaboradores", {
  codigo: "COL001", nome: "Marcos Vinicius Prado", cargo: "Vendedor", setor: "Comercial",
  salario: 2800.00, data_admissao: new Date("2023-03-01"), ativo: true
});

salvar("colaboradores", {
  codigo: "COL002", nome: "Juliana Teixeira", cargo: "Gerente de Loja", setor: "Gestao",
  salario: 6200.00, data_admissao: new Date("2021-08-16"), ativo: true
});

salvar("colaboradores", {
  codigo: "COL003", nome: "Rafael Antunes", cargo: "Tecnico de Suporte", setor: "Assistencia",
  salario: 3400.00, data_admissao: new Date("2022-11-07"), ativo: true
});

salvar("colaboradores", {
  codigo: "COL004", nome: "Patricia Nogueira", cargo: "Analista de Estoque", setor: "Logistica",
  salario: 3100.00, data_admissao: new Date("2024-02-19"), ativo: true
});

salvar("colaboradores", {
  codigo: "COL005", nome: "Eduardo Salles", cargo: "Estagiario de TI", setor: "Assistencia",
  salario: 1600.00, data_admissao: new Date("2025-09-01"), ativo: false
});
/***************************************************************************/
salvar("fornecedores", {
  codigo: "F001", razao_social: "Distribuidora TechSul LTDA", cnpj: "11.222.333/0001-44",
  contato: { nome: "Fernanda Rocha", email: "fernanda@techsul.com.br", telefone: "(51) 3222-1100" },
  prazo_entrega_dias: 7, marcas_atendidas: ["MAR001", "MAR002"], ativo: true
});

salvar("fornecedores", {
  codigo: "F002", razao_social: "InfoParts Importadora SA", cnpj: "22.333.444/0001-55",
  contato: { nome: "Alexandre Dias", email: "alexandre@infoparts.com", telefone: "(11) 4002-8922" },
  prazo_entrega_dias: 15, marcas_atendidas: ["MAR005", "MAR006"], ativo: true
});

salvar("fornecedores", {
  codigo: "F003", razao_social: "Perifericos Brasil Comercio", cnpj: "33.444.555/0001-66",
  contato: { nome: "Simone Barros", email: "simone@perifericosbrasil.com.br", telefone: "(41) 3355-9900" },
  prazo_entrega_dias: 5, marcas_atendidas: ["MAR004"], ativo: true
});

salvar("fornecedores", {
  codigo: "F004", razao_social: "Acer Partner Distribuicao", cnpj: "44.555.666/0001-77",
  contato: { nome: "Ricardo Mota", email: "ricardo@acerpartner.com.br", telefone: "(11) 3077-4455" },
  prazo_entrega_dias: 10, marcas_atendidas: ["MAR003"], ativo: true
});

salvar("fornecedores", {
  codigo: "F005", razao_social: "Global Info Atacado", cnpj: "55.666.777/0001-88",
  contato: { nome: "Luciana Pires", email: "luciana@globalinfo.com.br", telefone: "(21) 3555-2211" },
  prazo_entrega_dias: 20, marcas_atendidas: ["MAR001", "MAR003", "MAR006"], ativo: false
});
/***************************************************************************/
salvar("movimentacoes_estoque", {
  codigo: "MOV001", codigo_produto: "P001", tipo: "entrada", quantidade: 20,
  data: new Date("2026-09-02"), responsavel: "Patricia Nogueira", motivo: "Compra fornecedor F001"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV002", codigo_produto: "P004", tipo: "entrada", quantidade: 30,
  data: new Date("2026-09-05"), responsavel: "Patricia Nogueira", motivo: "Compra fornecedor F001"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV003", codigo_produto: "P006", tipo: "entrada", quantidade: 80,
  data: new Date("2026-09-10"), responsavel: "Patricia Nogueira", motivo: "Compra fornecedor F003"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV004", codigo_produto: "P001", tipo: "saida", quantidade: 1,
  data: new Date("2026-09-12"), responsavel: "Marcos Vinicius Prado", motivo: "Venda pedido PE001"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV005", codigo_produto: "P006", tipo: "saida", quantidade: 2,
  data: new Date("2026-09-15"), responsavel: "Marcos Vinicius Prado", motivo: "Venda pedido PE002"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV006", codigo_produto: "P007", tipo: "saida", quantidade: 2,
  data: new Date("2026-09-15"), responsavel: "Marcos Vinicius Prado", motivo: "Venda pedidos PE002 e PE005"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV007", codigo_produto: "P009", tipo: "ajuste", quantidade: -1,
  data: new Date("2026-09-22"), responsavel: "Patricia Nogueira", motivo: "Avaria identificada na conferencia"
});

salvar("movimentacoes_estoque", {
  codigo: "MOV008", codigo_produto: "P010", tipo: "entrada", quantidade: 5,
  data: new Date("2026-10-01"), responsavel: "Patricia Nogueira", motivo: "Montagem interna de kits"
});
/***************************************************************************/
salvar("pedidos", {
  codigo: "PE001", codigo_cliente: "C001", data: new Date("2026-09-12"), canal: "loja_fisica",
  itens: [ { codigo_produto: "P001", quantidade: 1, preco_unitario: 3899.90 } ],
  total: 3899.90, status: "entregue"
});

salvar("pedidos", {
  codigo: "PE002", codigo_cliente: "C002", data: new Date("2026-09-15"), canal: "site",
  itens: [ { codigo_produto: "P006", quantidade: 2, preco_unitario: 79.90 },
           { codigo_produto: "P007", quantidade: 1, preco_unitario: 349.90 } ],
  total: 509.70, status: "enviado"
});

salvar("pedidos", {
  codigo: "PE003", codigo_cliente: "C003", data: new Date("2026-09-19"), canal: "telefone",
  itens: [ { codigo_produto: "P004", quantidade: 1, preco_unitario: 899.00 },
           { codigo_produto: "P005", quantidade: 1, preco_unitario: 429.90 } ],
  total: 1328.90, status: "pago"
});

salvar("pedidos", {
  codigo: "PE004", codigo_cliente: "C004", data: new Date("2026-09-26"), canal: "site",
  itens: [ { codigo_produto: "P003", quantidade: 1, preco_unitario: 3549.90 } ],
  total: 3549.90, status: "aguardando_pagamento"
});

salvar("pedidos", {
  codigo: "PE005", codigo_cliente: "C005", data: new Date("2026-10-02"), canal: "site",
  itens: [ { codigo_produto: "P009", quantidade: 2, preco_unitario: 189.90 },
           { codigo_produto: "P007", quantidade: 1, preco_unitario: 349.90 } ],
  total: 729.70, status: "pago"
});

salvar("pedidos", {
  codigo: "PE006", codigo_cliente: "C006", data: new Date("2026-10-08"), canal: "loja_fisica",
  itens: [ { codigo_produto: "P008", quantidade: 1, preco_unitario: 259.90 } ],
  total: 259.90, status: "cancelado"
});
/***************************************************************************/
salvar("pagamentos", {
  codigo: "PG001", codigo_pedido: "PE001", forma: "pix", valor: 3899.90,
  parcelas: 1, status: "aprovado", data: new Date("2026-09-12"), transacao_id: "TX-90001"
});

salvar("pagamentos", {
  codigo: "PG002", codigo_pedido: "PE002", forma: "cartao_credito", valor: 509.70,
  parcelas: 3, status: "aprovado", data: new Date("2026-09-15"), transacao_id: "TX-90002"
});

salvar("pagamentos", {
  codigo: "PG003", codigo_pedido: "PE003", forma: "boleto", valor: 1328.90,
  parcelas: 1, status: "aprovado", data: new Date("2026-09-20"), transacao_id: "TX-90003"
});

salvar("pagamentos", {
  codigo: "PG004", codigo_pedido: "PE004", forma: "cartao_credito", valor: 3549.90,
  parcelas: 10, status: "pendente", data: new Date("2026-09-26"), transacao_id: null
});

salvar("pagamentos", {
  codigo: "PG005", codigo_pedido: "PE005", forma: "pix", valor: 729.70,
  parcelas: 1, status: "aprovado", data: new Date("2026-10-02"), transacao_id: "TX-90005"
});

salvar("pagamentos", {
  codigo: "PG006", codigo_pedido: "PE006", forma: "cartao_debito", valor: 259.90,
  parcelas: 1, status: "estornado", data: new Date("2026-10-08"), transacao_id: "TX-90006"
});
/***************************************************************************/
salvar("servicos", {
  codigo: "S001", nome: "Formatacao com backup", descricao: "Backup dos arquivos e reinstalacao do sistema",
  preco_base: 180.00, duracao_horas: 3, garantia_dias: 30, ativo: true
});

salvar("servicos", {
  codigo: "S002", nome: "Upgrade de SSD", descricao: "Troca do disco por SSD e clonagem do sistema",
  preco_base: 120.00, duracao_horas: 2, garantia_dias: 90, ativo: true
});

salvar("servicos", {
  codigo: "S003", nome: "Limpeza e troca de pasta", descricao: "Limpeza interna e troca da pasta termica",
  preco_base: 150.00, duracao_horas: 2, garantia_dias: 30, ativo: true
});

salvar("servicos", {
  codigo: "S004", nome: "Remocao de virus", descricao: "Desinfeccao do sistema e instalacao de antivirus",
  preco_base: 130.00, duracao_horas: 2, garantia_dias: 15, ativo: true
});

salvar("servicos", {
  codigo: "S005", nome: "Montagem de desktop", descricao: "Montagem completa de PC com teste de estabilidade",
  preco_base: 250.00, duracao_horas: 4, garantia_dias: 30, ativo: false
});
/***************************************************************************/
salvar("ordens_servico", {
  codigo: "OS001", codigo_cliente: "C001", codigo_servico: "S001", codigo_colaborador: "COL003",
  equipamento: "Notebook Dell Inspiron 15", defeito_relatado: "Sistema nao inicia apos atualizacao",
  status: "concluida", valor_total: 180.00,
  data_abertura: new Date("2026-09-08"), data_conclusao: new Date("2026-09-10")
});

salvar("ordens_servico", {
  codigo: "OS002", codigo_cliente: "C002", codigo_servico: "S002", codigo_colaborador: "COL003",
  equipamento: "Notebook Lenovo IdeaPad 3", defeito_relatado: "Lentidao ao abrir programas",
  status: "concluida", valor_total: 120.00,
  data_abertura: new Date("2026-09-16"), data_conclusao: new Date("2026-09-16")
});

salvar("ordens_servico", {
  codigo: "OS003", codigo_cliente: "C003", codigo_servico: "S005", codigo_colaborador: "COL003",
  equipamento: "Desktop montado para escritorio", defeito_relatado: "Montagem de 3 maquinas novas",
  status: "em_andamento", valor_total: 750.00,
  data_abertura: new Date("2026-10-05"), data_conclusao: null
});

salvar("ordens_servico", {
  codigo: "OS004", codigo_cliente: "C004", codigo_servico: "S003", codigo_colaborador: "COL005",
  equipamento: "Notebook Acer Aspire 5", defeito_relatado: "Superaquecimento e desligamento",
  status: "aguardando_aprovacao", valor_total: 150.00,
  data_abertura: new Date("2026-10-09"), data_conclusao: null
});

salvar("ordens_servico", {
  codigo: "OS005", codigo_cliente: "C005", codigo_servico: "S004", codigo_colaborador: "COL003",
  equipamento: "Computador da secretaria", defeito_relatado: "Pop-ups e navegador sequestrado",
  status: "aberta", valor_total: 130.00,
  data_abertura: new Date("2026-10-14"), data_conclusao: null
});
/***************************************************************************/
salvar("avaliacoes", {
  codigo: "AV001", codigo_cliente: "C001", tipo: "pedido", codigo_referencia: "PE001",
  nota: 5, comentario: "Notebook entregue no prazo e bem embalado.", data: new Date("2026-09-14")
});

salvar("avaliacoes", {
  codigo: "AV002", codigo_cliente: "C002", tipo: "pedido", codigo_referencia: "PE002",
  nota: 4, comentario: "Produtos bons, entrega demorou um dia mais que o previsto.", data: new Date("2026-09-20")
});

salvar("avaliacoes", {
  codigo: "AV003", codigo_cliente: "C001", tipo: "ordem_servico", codigo_referencia: "OS001",
  nota: 5, comentario: "Atendimento tecnico resolveu rapido.", data: new Date("2026-09-11")
});

salvar("avaliacoes", {
  codigo: "AV004", codigo_cliente: "C003", tipo: "pedido", codigo_referencia: "PE003",
  nota: 4, comentario: "Bom atendimento no telefone.", data: new Date("2026-09-25")
});

salvar("avaliacoes", {
  codigo: "AV005", codigo_cliente: "C005", tipo: "pedido", codigo_referencia: "PE005",
  nota: 5, comentario: "Compra institucional com nota fiscal sem problemas.", data: new Date("2026-10-06")
});

salvar("avaliacoes", {
  codigo: "AV006", codigo_cliente: "C006", tipo: "pedido", codigo_referencia: "PE006",
  nota: 2, comentario: "Pedido cancelado, mas o estorno foi rapido.", data: new Date("2026-10-10")
});

// Conferencia final: quantidade de documentos por colecao
colecoes.forEach(nome => print(nome.padEnd(24) + db.getCollection(nome).countDocuments()));
