# API de E-commerce - NestJS

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  API RESTful para gerenciamento de produtos, pedidos, categorias e usuários, construída com NestJS, TypeScript e PostgreSQL.
</p>

<p align="center">
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#pré-requisitos">Pré-requisitos</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#executando-o-projeto">Executando o projeto</a> •
  <a href="#testes">Testes</a> •
  <a href="#documentação-da-api">Documentação da API</a> •
  <a href="#coleção-postman">Coleção Postman</a>
</p>

## Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js para construção de aplicações server-side
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript
- [JWT](https://jwt.io/) - JSON Web Token para autenticação
- [Docker](https://www.docker.com/) - Containerização da aplicação
- [Jest](https://jestjs.io/) - Framework de testes

## Funcionalidades

- 🔐 **Autenticação**: Login e registro de usuários com JWT
- 👤 **Usuários**: Gerenciamento de usuários (admin/cliente)
- 📦 **Produtos**: CRUD completo de produtos
- 🛒 **Pedidos**: Criação e gerenciamento de pedidos
- 🏷️ **Categorias**: Organização de produtos por categorias
- 📊 **Status**: Acompanhamento do status dos pedidos

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
DB_NAME=thera_db
API_PORT=3000
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/thera_db"
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=1d
```

## Executando o projeto

### Usando Docker (Recomendado)

1. Inicie os containers com Docker Compose:

```bash
docker-compose up -d
```

2. A API estará disponível em: `http://localhost:3000`

### Sem Docker (Desenvolvimento local)

1. Certifique-se de ter um PostgreSQL rodando e atualize o `DATABASE_URL` no arquivo `.env`

2. Execute as migrações do Prisma:

```bash
npm run migrate
# ou
yarn migrate
```

3. Popule o banco de dados com dados iniciais:

```bash
npm run seed
# ou
yarn seed
```

4. Inicie a aplicação:

```bash
# Modo de desenvolvimento
npm run start:dev
# ou
yarn start:dev

# Modo de produção
npm run start:prod
# ou
yarn start:prod
```

## Testes

Execute os testes unitários:

```bash
npm test
# ou
yarn test
```

Para testes com cobertura:

```bash
npm run test:cov
# ou
yarn test:cov
```

## Documentação da API

A documentação da API está disponível através do Swagger UI:

```
http://localhost:3000/api/docs
```

## Coleção Postman

Para facilitar o teste da API, disponibilizamos uma coleção do Postman com todas as rotas configuradas:

<div class="postman-run-button"
data-postman-action="collection/fork"
data-postman-visibility="public"
data-postman-var-1="22433778-f7f29ac2-466a-45aa-aad0-d5d4593e3fde"
data-postman-collection-url="entityId=22433778-f7f29ac2-466a-45aa-aad0-d5d4593e3fde&entityType=collection&workspaceId=9780995d-0ac0-4d84-831a-bb9f113d571e"></div>
<script type="text/javascript">
  (function (p,o,s,t,m,a,n) {
    !p[s] && (p[s] = function () { (p[t] || (p[t] = [])).push(arguments); });
    !o.getElementById(s+t) && o.getElementsByTagName("head")[0].appendChild((
      (n = o.createElement("script")),
      (n.id = s+t), (n.async = 1), (n.src = m), n
    ));
  }(window, document, "_pm", "PostmanRunObject", "https://run.pstmn.io/button.js"));
</script>

A coleção inclui:
- Autenticação (login e registro)
- Gerenciamento de usuários
- CRUD de produtos
- Gerenciamento de pedidos
- Operações de categorias
- Gerenciamento de status

Para usar a coleção:
1. Clique no botão "Run in Postman" acima
2. Importe a coleção para o seu Postman
3. Configure o ambiente com a URL base da sua API (por padrão: `http://localhost:3000`)
4. Use a rota de login para obter um token JWT
5. O token será automaticamente configurado para as demais requisições

---

<p align="center">
  Desenvolvido como parte do teste técnico para Thera
</p>
