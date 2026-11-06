# Loja Informática

Regras de validação e testes para o banco de dados **LojaInformatica** no MongoDB Atlas.

Cada collection da loja tem um arquivo de regras com funções que validam os atributos do documento (formato, tamanho, valores permitidos). Os testes buscam um documento real no Atlas e conferem se ele segue as regras. Também testam casos inválidos para garantir que as regras rejeitam dados errados.

## Collections

| Collection | Regras | Testes |
|---|---|---|
| Avaliações | `src/regrasAvaliacoes.js` | `npm run test:avaliacoes` |
| Categorias | `src/regrasCategorias.js` | `npm run test:categorias` |
| Clientes | `src/regrasClientes.js` | `npm run test:clientes` |
| Colaboradores | `src/regrasColaboradores.js` | `npm run test:colaboradores` |
| Fornecedores | `src/regrasFornecedores.js` | `npm run test:fornecedores` |
| Marcas | `src/regrasMarcas.js` | `npm run test:marcas` |
| Movimentações de estoque | `src/regrasMovimentacoesEstoque.js` | `npm run test:movimentacoes` |
| Ordens de serviço | `src/regrasOrdensServico.js` | `npm run test:ordens` |
| Pagamentos | `src/regrasPagamentos.js` | `npm run test:pagamentos` |
| Pedidos | `src/regrasPedidos.js` | `npm run test:pedidos` |
| Produtos | `src/regrasProdutos.js` | `npm run test:produtos` |
| Serviços | `src/regrasServicos.js` | `npm run test:servicos` |

Os arquivos de teste ficam em `src/test/`.

## Tecnologias

- Node.js (test runner nativo `node:test`)
- MongoDB Atlas (driver `mongodb`)
- `dotenv` para as variáveis de ambiente

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto com a conexão do seu cluster:

   ```env
   MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/
   DB_NAME=LojaInformatica
   ```

   O `.env` está no `.gitignore` e não deve ser enviado para o GitHub.

3. Rode todos os testes:

   ```bash
   npm test
   ```

   Ou só os de uma collection, por exemplo:

   ```bash
   npm run test:clientes
   ```

## Autora

Natália Ferreira Fernandes ([@nati3054](https://github.com/nati3054))
