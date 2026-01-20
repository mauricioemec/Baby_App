# BabyTrack Pro - Backend API

Backend completo para o aplicativo BabyTrack Pro, desenvolvido com Node.js, Express, Prisma e PostgreSQL.

## Características

- **Autenticação**: JWT com sistema de OTP por email
- **Gerenciamento de Bebês**: CRUD completo com configurações personalizadas
- **Registros de Mamadas**: Tracking de amamentação e mamadeira com conversão automática
- **Registros de Fraldas**: Monitoramento de xixi e cocô com cálculo de volume
- **Crescimento**: Acompanhamento de peso, altura e perímetro cefálico com cálculo de percentis OMS
- **Medicações**: Gerenciamento de medicamentos com lembretes programados
- **Sintomas**: Registro de sintomas e temperatura
- **Notificações Push**: FCM para lembretes de mamada, medicação e alertas
- **Cálculos Avançados**: Peso teórico, percentis OMS, metas diárias
- **Rate Limiting**: Proteção contra abuso de API
- **Validação Completa**: Zod para validação de dados

## Tecnologias

- **Node.js** + **Express**: Framework web
- **Prisma**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados
- **JWT**: Autenticação
- **Bcrypt**: Hash de senhas
- **Nodemailer**: Envio de emails
- **Firebase Admin**: Push notifications
- **Zod**: Validação de schemas
- **date-fns**: Manipulação de datas
- **node-cron**: Tarefas agendadas

## Instalação

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/babytrack_pro"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Firebase (optional - for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3001`

## Estrutura de Pastas

```
backend/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── config/                # Configurações (DB, Firebase, Env)
│   │   ├── database.js
│   │   ├── firebase.js
│   │   └── env.js
│   ├── controllers/           # Controladores de rotas
│   │   ├── authController.js
│   │   ├── babyController.js
│   │   ├── feedingController.js
│   │   ├── diaperController.js
│   │   ├── growthController.js
│   │   ├── medicationController.js
│   │   ├── symptomController.js
│   │   └── fcmController.js
│   ├── cron/                  # Tarefas agendadas
│   │   ├── notificationCron.js
│   │   └── lowIntakeCron.js
│   ├── data/                  # Dados estáticos
│   │   └── oms-data.json      # Tabelas OMS
│   ├── middleware/            # Middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── routes/                # Rotas da API
│   │   ├── authRoutes.js
│   │   ├── babyRoutes.js
│   │   ├── recordsRoutes.js
│   │   ├── medicationRoutes.js
│   │   ├── symptomRoutes.js
│   │   └── fcmRoutes.js
│   ├── services/              # Serviços de negócio
│   │   ├── calculationService.js
│   │   ├── emailService.js
│   │   ├── omsService.js
│   │   ├── otpService.js
│   │   └── pushService.js
│   ├── utils/                 # Utilitários
│   │   ├── bcrypt.js
│   │   ├── constants.js
│   │   ├── jwt.js
│   │   └── logger.js
│   └── server.js              # Ponto de entrada
├── .env.example               # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## Endpoints da API

### Autenticação (`/api/auth`)
- `POST /signup` - Criar conta
- `POST /login` - Login
- `POST /verify-otp` - Verificar OTP
- `POST /resend-otp` - Reenviar OTP
- `POST /logout` - Logout
- `GET /me` - Dados do usuário
- `POST /change-password` - Alterar senha

### Bebês (`/api/baby`)
- `POST /` - Criar bebê
- `GET /` - Listar bebês
- `GET /:id` - Obter bebê
- `PUT /:id` - Atualizar bebê
- `DELETE /:id` - Deletar bebê

### Mamadas (`/api/feeding`)
- `POST /` - Criar registro
- `GET /` - Listar registros
- `GET /stats` - Estatísticas do dia
- `GET /:id` - Obter registro
- `PUT /:id` - Atualizar registro
- `DELETE /:id` - Deletar registro

### Fraldas (`/api/diaper`)
- `POST /` - Criar registro
- `GET /` - Listar registros
- `GET /stats` - Estatísticas do dia
- `GET /:id` - Obter registro
- `PUT /:id` - Atualizar registro
- `DELETE /:id` - Deletar registro

### Crescimento (`/api/growth`)
- `POST /` - Criar registro
- `GET /` - Listar registros
- `GET /latest` - Último registro
- `GET /:id` - Obter registro
- `PUT /:id` - Atualizar registro
- `DELETE /:id` - Deletar registro

### Medicações (`/api/medication`)
- `POST /` - Criar medicação
- `GET /` - Listar medicações
- `GET /today` - Medicações de hoje
- `GET /:id` - Obter medicação
- `PUT /:id` - Atualizar medicação
- `DELETE /:id` - Deletar medicação
- `POST /:id/log` - Registrar tomada
- `GET /:id/logs` - Histórico de tomadas

### Sintomas (`/api/symptom`)
- `POST /` - Criar sintoma
- `GET /` - Listar sintomas
- `GET /:id` - Obter sintoma
- `PUT /:id` - Atualizar sintoma
- `DELETE /:id` - Deletar sintoma

### FCM (`/api/fcm`)
- `POST /register` - Registrar token
- `POST /unregister` - Remover token

## Cron Jobs

### Notificações (a cada 5 minutos)
- **Lembretes de Mamada**: Verifica se passaram X horas desde a última mamada
- **Lembretes de Medicação**: Envia notificação 5 minutos antes do horário programado

### Alerta de Baixa Ingestão (diário às 18h)
- Verifica se o bebê atingiu menos de 70% da meta diária de ingestão
- Envia notificação para os pais

## Configuração de Email

### Gmail (Recomendado)

1. Ative a autenticação de 2 fatores na sua conta Google
2. Gere uma "Senha de App" em: https://myaccount.google.com/apppasswords
3. Use essa senha no `EMAIL_PASSWORD`

### Outros provedores

Configure as variáveis de ambiente de acordo com seu provedor SMTP.

## Configuração Firebase (Push Notifications)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto ou use um existente
3. Vá em Configurações > Contas de Serviço
4. Gere uma nova chave privada (JSON)
5. Copie as credenciais para o `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

## Desenvolvimento

### Comandos Úteis

```bash
# Prisma Studio (visualizar/editar dados)
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name migration_name

# Formatar schema
npx prisma format
```

### Logs

O sistema possui logs coloridos para facilitar debugging:
- **AZUL**: Informações gerais
- **VERDE**: Sucesso
- **AMARELO**: Avisos
- **VERMELHO**: Erros
- **CINZA**: Debug (apenas em dev)

## Produção

### Recomendações

1. Use um **JWT_SECRET** forte (mínimo 32 caracteres)
2. Configure **CORS** adequadamente
3. Use **HTTPS** sempre
4. Configure **rate limiting** de acordo com suas necessidades
5. Monitore logs e erros
6. Faça backup regular do banco de dados
7. Use variáveis de ambiente seguras

## Licença

Proprietary - Todos os direitos reservados
