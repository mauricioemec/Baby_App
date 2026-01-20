# Setup Rápido - BabyTrack Pro Backend

Guia passo-a-passo para configurar e rodar o backend.

## Pré-requisitos

- **Node.js** 18+ e npm
- **PostgreSQL** 14+
- **Git**

## Instalação

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar PostgreSQL

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE babytrack_pro;
```

Ou via terminal:

```bash
psql -U postgres
CREATE DATABASE babytrack_pro;
\q
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# OBRIGATÓRIO
DATABASE_URL="postgresql://postgres:senha@localhost:5432/babytrack_pro?schema=public"
JWT_SECRET="chave-secreta-muito-segura-com-pelo-menos-32-caracteres"

# OPCIONAL (para emails)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app

# OPCIONAL (para push notifications)
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
```

### 4. Executar Migrations

```bash
npx prisma generate
npx prisma migrate dev
```

Isso irá:
- Gerar o Prisma Client
- Criar as tabelas no banco de dados
- Aplicar todas as migrations

### 5. (Opcional) Popular Dados de Teste

Você pode usar o Prisma Studio para adicionar dados manualmente:

```bash
npx prisma studio
```

Abrirá uma interface web em `http://localhost:5555`

### 6. Iniciar Servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## Testar a API

### 1. Health Check

```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "BabyTrack Pro API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Criar Conta

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 3. Verificar Email

Verifique seu email ou os logs do servidor para obter o código OTP.

### 4. Verificar OTP

```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "code": "123456"
  }'
```

Salve o token retornado!

### 5. Criar Bebê

```bash
curl -X POST http://localhost:3001/api/baby \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "João",
    "sex": "male",
    "birthDate": "2024-01-01T10:00:00.000Z",
    "birthWeight": 3200,
    "birthHeight": 50
  }'
```

## Configuração de Email (Gmail)

1. Ative a autenticação de 2 fatores na sua conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma senha de app
4. Use essa senha no `EMAIL_PASSWORD` do `.env`

Configuração no `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=senha-de-app-gerada
```

## Configuração Firebase (Push Notifications)

1. Acesse: https://console.firebase.google.com/
2. Crie um projeto ou use um existente
3. Vá em: Configurações > Contas de Serviço
4. Clique em "Gerar nova chave privada"
5. Baixe o arquivo JSON
6. Copie os valores para o `.env`:

```env
FIREBASE_PROJECT_ID=valor-do-project_id
FIREBASE_PRIVATE_KEY="valor-do-private_key-com-quebras-de-linha"
FIREBASE_CLIENT_EMAIL=valor-do-client_email
```

## Comandos Úteis

### Prisma

```bash
# Visualizar e editar dados
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Formatar schema
npx prisma format

# Ver status das migrations
npx prisma migrate status
```

### Desenvolvimento

```bash
# Rodar com auto-reload
npm run dev

# Apenas rodar
npm start

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

## Estrutura de Diretórios

```
backend/
├── prisma/
│   └── schema.prisma          # Schema do banco
├── src/
│   ├── config/                # Configurações
│   ├── controllers/           # Lógica de rotas
│   ├── cron/                  # Tarefas agendadas
│   ├── data/                  # Dados estáticos (OMS)
│   ├── middleware/            # Middlewares
│   ├── routes/                # Definição de rotas
│   ├── schemas/               # Schemas de validação
│   ├── services/              # Lógica de negócio
│   ├── utils/                 # Utilitários
│   └── server.js              # Entrada da aplicação
├── .env                       # Variáveis de ambiente
├── .env.example               # Exemplo de .env
├── .gitignore
├── package.json
└── README.md
```

## Solução de Problemas

### Erro: "DATABASE_URL is required"
- Certifique-se de que o arquivo `.env` existe
- Verifique se a variável `DATABASE_URL` está configurada

### Erro: "Connection refused" no PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `DATABASE_URL`
- Teste a conexão: `psql -U postgres -d babytrack_pro`

### Erro: "Invalid environment variables"
- Verifique se todas as variáveis obrigatórias estão no `.env`
- Certifique-se de que `JWT_SECRET` tem pelo menos 32 caracteres

### Emails não estão sendo enviados
- Verifique se `EMAIL_USER` e `EMAIL_PASSWORD` estão configurados
- Para Gmail, use uma senha de app, não a senha da conta
- Verifique os logs do servidor para mais detalhes

### Push notifications não funcionam
- As configurações do Firebase são opcionais
- Se não configurado, as notificações simplesmente não serão enviadas
- Verifique se as credenciais estão corretas
- Veja os logs para mensagens de erro do Firebase

## Próximos Passos

1. ✅ Backend configurado e rodando
2. Configure o frontend para conectar na API
3. Teste todos os endpoints usando Postman ou similar
4. Configure notificações push (Firebase)
5. Configure email para produção
6. Deploy em produção (Railway, Render, etc.)

## Suporte

Para dúvidas ou problemas, verifique:
- `README.md` - Documentação completa
- `API.md` - Documentação da API
- Logs do servidor para mensagens de erro
