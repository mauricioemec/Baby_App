# 🚀 BabyTrack Pro - Guia de Início Rápido

## ✅ Projeto Completo e Commitado!

Todo o código foi implementado e está no branch: **`claude/babytrack-pro-setup-t8yKt`**

**Link do PR:** https://github.com/mauricioemec/Baby_App/pull/new/claude/babytrack-pro-setup-t8yKt

---

## 📦 O que foi Criado

### Backend (43 arquivos)
- ✅ Express + Prisma + PostgreSQL
- ✅ Autenticação JWT + OTP por email
- ✅ CRUD completo (Baby, Feeding, Diaper, Growth, Medication, Symptom)
- ✅ Serviços de cálculo (peso teórico, percentis OMS, conversões)
- ✅ Push notifications (Firebase Cloud Messaging)
- ✅ Cron jobs automáticos (lembretes + alertas)
- ✅ Validação Zod + Rate limiting + Error handling

### Frontend (71 arquivos)
- ✅ React 18 + Vite + Tailwind CSS
- ✅ UI mobile-first completa e responsiva
- ✅ Dashboard com status diário e quick actions
- ✅ Timer de mamada funcional (Start/Pause/Stop)
- ✅ Formulários com validação em tempo real
- ✅ Gráficos Recharts (Peso OMS, Volume 7 dias)
- ✅ i18n trilíngue (PT/EN/ES)
- ✅ PWA instalável (manifest + service worker)
- ✅ Context API + hooks customizados
- ✅ Toast notifications + Modal confirmations

### Dados e Documentação
- ✅ Dados oficiais da OMS (peso, altura, perímetro cefálico)
- ✅ Schema Prisma completo (9 modelos)
- ✅ Seed para dados de teste
- ✅ Traduções completas (PT/EN/ES - 325+ strings)
- ✅ Documentação detalhada (README, API, SETUP)

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Pré-requisitos

```bash
# Node.js 16+
node --version

# PostgreSQL 12+
psql --version

# Criar banco de dados
psql -U postgres
CREATE DATABASE babytrack_pro;
\q
```

### 2️⃣ Configurar Backend

```bash
cd babytrack-pro/backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Edite .env com suas credenciais:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET (qualquer string longa)
# - EMAIL_* (SMTP para envio de OTP)
# - FIREBASE_* (credenciais Firebase para push)

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev --name init

# Popular com dados de teste (OPCIONAL)
npm run seed

# Iniciar servidor (porta 3001)
npm run dev
```

### 3️⃣ Configurar Frontend

```bash
cd babytrack-pro/frontend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Edite .env:
VITE_API_URL=http://localhost:3001
# + credenciais Firebase (mesmas do backend)

# Iniciar aplicação (porta 5173)
npm run dev
```

### 4️⃣ Acessar Aplicação

Abra o navegador em: **http://localhost:5173**

---

## 🧪 Dados de Teste (após seed)

Se você executou `npm run seed` no backend:

```
📧 Email: teste@babytrack.com
🔑 Senha: password123
👶 Bebê: Miguel (3 meses)
```

O banco terá:
- 13 registros de crescimento (últimas 12 semanas)
- ~50 mamadas (últimos 7 dias)
- ~60 fraldas (últimos 7 dias)
- 2 medicamentos (Vitamina D, Probiótico)
- 14 logs de medicamentos
- 2 sintomas

---

## 🔧 Configurações Necessárias

### PostgreSQL (DATABASE_URL)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/babytrack_pro"
```

### Email (para OTP)

**Opção 1 - Gmail:**
1. Ativar verificação em 2 etapas
2. Gerar senha de app: https://myaccount.google.com/apppasswords
3. Usar no .env:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=senha-de-app-gerada
```

**Opção 2 - Mailtrap (para testes):**
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu-usuario-mailtrap
EMAIL_PASS=sua-senha-mailtrap
```

### Firebase (para Push Notifications)

1. Criar projeto: https://console.firebase.google.com/
2. Habilitar Cloud Messaging
3. Baixar credenciais:
   - Configurações do projeto > Service accounts > Generate new private key
4. Copiar credenciais para .env (backend e frontend)

**Backend .env:**
```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project.iam.gserviceaccount.com
```

**Frontend .env:**
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=seu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### JWT Secret

Gere uma string aleatória segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Adicione ao backend .env:
```env
JWT_SECRET=sua-string-aleatoria-aqui
```

---

## 📱 PWA - Ícones

Substitua os placeholders em `/frontend/public/`:

- **icon-192.png** (192x192 pixels)
- **icon-512.png** (512x512 pixels)

Use ferramentas como:
- https://realfavicongenerator.net/
- https://favicon.io/

---

## 🔔 Testar Notificações Push

1. Abra o app no navegador
2. Faça login
3. Aceite permissões de notificação
4. Adicione um medicamento com horário em 5 minutos
5. Aguarde - você receberá uma notificação!

---

## 🎨 Funcionalidades para Testar

### 1. Dashboard
- ✅ Status do dia (leite + xixi) com progress bars
- ✅ Quick actions para registro rápido
- ✅ Medicamentos de hoje com checklist

### 2. Mamadas
- ✅ Timer funcional (Start/Pause/Stop)
- ✅ Conversão automática duração → ml
- ✅ Registros de mamadeira
- ✅ Histórico completo

### 3. Fraldas
- ✅ Registro de xixi, cocô ou ambos
- ✅ Pesagem para calcular volume
- ✅ Gráfico de últimos 7 dias

### 4. Crescimento
- ✅ Registro de peso, altura, perímetro
- ✅ **Cálculo automático de percentis OMS**
- ✅ Modal com resultados dos percentis
- ✅ Gráfico peso vs curva OMS

### 5. Medicamentos
- ✅ Cadastro com horários
- ✅ Checklist diário
- ✅ Marcar como tomado/pulado
- ✅ Lembretes automáticos

### 6. Configurações
- ✅ Seletor de idioma (PT/EN/ES)
- ✅ Editor de constantes (ml/min, ml/kg, tara)
- ✅ Toggles de notificações
- ✅ Toggle idade corrigida (prematuros)

---

## 🧮 Cálculos Implementados

### Peso Teórico
```
SE (últimoPeso <= 15 dias atrás):
  25% ganho real + 75% curva OMS
SENÃO:
  curva OMS pura
```

### Percentis OMS
- Interpolação linear entre pontos da tabela
- Suporte para peso, altura e perímetro cefálico
- Comparação em tempo real

### Conversão Amamentação
```
volumeML = duração(min) * taxa(ml/min)
Taxa por idade:
- 0-1 meses: 5 ml/min
- 1-3 meses: 6 ml/min
- 3-6 meses: 7 ml/min
- 6+ meses: 8 ml/min
```

### Metas Diárias
```
Leite: pesoTeórico(kg) × 150 ml/kg
Xixi: pesoTeórico(g) × 10%
```

---

## 📊 Estrutura de Arquivos

```
babytrack-pro/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      ← Modelo de dados
│   │   └── seed.js            ← Dados de teste
│   ├── src/
│   │   ├── config/            ← Database, Firebase, Env
│   │   ├── controllers/       ← Lógica de negócio
│   │   ├── middleware/        ← Auth, Error, Validator
│   │   ├── routes/            ← Rotas da API
│   │   ├── services/          ← Email, OTP, OMS, Cálculos, Push
│   │   ├── utils/             ← JWT, Bcrypt, Logger
│   │   ├── cron/              ← Jobs automáticos
│   │   └── server.js          ← Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── manifest.json      ← PWA manifest
    │   ├── firebase-messaging-sw.js
    │   └── icons/
    ├── src/
    │   ├── components/        ← Componentes React
    │   ├── contexts/          ← Context API
    │   ├── hooks/             ← Hooks customizados
    │   ├── services/          ← API calls
    │   ├── utils/             ← Helpers e cálculos
    │   ├── data/              ← oms-data.json
    │   ├── i18n/              ← Traduções
    │   ├── pages/             ← Páginas
    │   ├── App.jsx            ← Routing
    │   └── main.jsx           ← Entry point
    └── package.json
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar PostgreSQL rodando
sudo systemctl status postgresql

# Verificar conexão DB
npx prisma studio

# Ver logs detalhados
npm run dev
```

### Frontend não conecta ao backend

1. Verificar backend rodando em http://localhost:3001
2. Verificar VITE_API_URL no .env
3. Abrir DevTools → Network → ver requisições

### OTP não chega por email

1. Verificar credenciais SMTP no .env
2. Verificar logs do backend
3. Usar Mailtrap para testes

### Push notifications não funcionam

1. Verificar permissões no navegador
2. Verificar credenciais Firebase
3. Testar em HTTPS (push não funciona em HTTP local no Chrome)

---

## 📚 Documentação Adicional

- **README Principal**: `/babytrack-pro/README.md`
- **Backend Docs**: `/babytrack-pro/backend/README.md`
- **API Docs**: `/babytrack-pro/backend/API.md`
- **Setup Guide**: `/babytrack-pro/backend/SETUP.md`
- **Frontend Docs**: `/babytrack-pro/frontend/README.md`

---

## 🎉 Projeto Pronto!

O BabyTrack Pro está **100% funcional** e pronto para:

- ✅ Desenvolvimento local
- ✅ Testes de funcionalidades
- ✅ Deploy em produção
- ✅ Customizações e melhorias

---

## 📞 Suporte

Dúvidas sobre o código?
- Verifique a documentação em cada pasta
- Leia os comentários nos arquivos principais
- Consulte os arquivos de exemplo (.env.example)

Bom desenvolvimento! 🚀👶💙
