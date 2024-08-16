# Sistema de Gerenciamento de E-commerce

## Descrição

Este projeto é um sistema de gerenciamento de e-commerce desenvolvido com Node.js, Express, Prisma, PostgreSQL, e TypeScript. Ele permite a administração e processamento de pedidos, clientes, produtos e geração de relatórios, com suporte para autenticação e autorização.

## Tecnologias

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Express**: Framework para construção de APIs.
- **Prisma**: ORM para gerenciamento de banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Yup**: Biblioteca para validação de esquemas.
- **Jest**: Framework para testes.
- **Docker**: Plataforma para desenvolvimento e execução de aplicações em contêineres.

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:claudiocassimiro/e-commerce-manager.git
   cd seu-repositorio
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente.** Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

   ```env
   PORT=
   DATABASE_URL="postgresql://seu_user:sua_senha@db:5434/ecommerce"
   POSTGRES_USER=seu_user
   POSTGRES_PASSWORD=sua_senha
   POSTGRES_DB=ecommerce
   JWT_SECRET=secret
   ```

4. **Execute as migrações do banco de dados:**

   ```bash
   npx prisma migrate dev
   ```

## Comandos

- **Rodar o servidor em modo de desenvolvimento:**

  ```bash
  npm run dev
  ```

- **Compilar o código TypeScript:**

  ```bash
  npm run build
  ```

- **Executar testes:**

  ```bash
  npm test
  ```

- **Corrigir problemas de linting:**

  ```bash
  npm run eslint:fix
  ```

## Docker

Para executar o projeto usando Docker, siga o passo abaixo:

1. **Rode o docker compose:**

   ```bash
   docker compose up --build
   ```

## Rotas da API

### Autenticação

- **POST auth/register**: Registra um novo usuário.
- **POST auth/login**: Faz login de um usuário existente.

### Clientes

- **POST api/clientes**: Cria um novo cliente.
- **GET api/clientes/:id**: Obtém detalhes de um cliente específico.
- **PUT api/clientes/:id**: Atualiza informações de um cliente específico.
- **DELETE api/clientes/:id**: Remove um cliente específico.
- **GET api/clientes**: Obtém uma lista de todos os clientes.

### Pedidos

- **POST api/pedidos**: Cria um novo pedido.
- **GET api/pedidos**: Obtém todos os pedidos.
- **GET api/pedidos/:id**: Obtém detalhes de um pedido específico.
- **PUT api/pedidos/:id**: Atualiza um pedido existente.
- **DELETE api/pedidos/:id**: Remove um pedido específico.

### Produtos

- **POST api/produtos**: Cria um novo produto.
- **GET api/produtos/:id**: Obtém detalhes de um produto específico.
- **PUT api/produtos/:id**: Atualiza um produto existente.
- **DELETE api/produtos/:id**: Remove um produto específico.
- **GET api/produtos**: Obtém uma lista de todos os produtos.

### Relatórios

- **GET api/relatorios**: Gera relatórios de vendas.

## Documentação da API

A documentação completa da API está disponível em [Swagger/OpenAPI](http://localhost:3000/api-docs/).

## Contribuição

Contribuições são bem-vindas! Por favor, abra um `issue` ou envie um `pull request` com suas sugestões ou melhorias.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
