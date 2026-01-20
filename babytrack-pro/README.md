# 📱 BabyTrack Pro - Growth & Health Intelligence

<div align="center">

![BabyTrack Pro](https://img.shields.io/badge/BabyTrack-Pro-60A5FA?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-34D399?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-FBBF24?style=for-the-badge)

**Um PWA completo para monitoramento do desenvolvimento infantil**

[🚀 Demo](#) · [📖 Documentação](#documentação) · [🐛 Report Bug](https://github.com/seu-usuario/babytrack-pro/issues) · [✨ Request Feature](https://github.com/seu-usuario/babytrack-pro/issues)

</div>

---

## 🎯 Sobre o Projeto

**BabyTrack Pro** é uma aplicação web progressiva (PWA) completa e profissional para monitoramento do desenvolvimento infantil. O app permite controle detalhado de:

- 📊 **Crescimento**: Peso, altura e perímetro cefálico com cálculos de percentis OMS
- 🍼 **Alimentação**: Registro de mamadas (peito com timer e mamadeira)
- 👶 **Higiene**: Controle de fraldas com volume de xixi
- 💊 **Saúde**: Medicamentos com lembretes e rastreamento de sintomas
- 📈 **Gráficos**: Visualização de tendências e comparação com curvas da OMS
- 🌍 **Multilíngue**: Suporte para Português, Inglês e Espanhol
- 🔔 **Notificações**: Lembretes automáticos via push notifications

### ⚠️ Aviso Importante

> BabyTrack Pro é uma ferramenta de acompanhamento e **não substitui consultas médicas**. Sempre consulte um pediatra para orientações profissionais sobre a saúde do seu bebê.

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação Segura
- Cadastro e login com email e senha
- Verificação por código OTP (6 dígitos)
- JWT com expiração de 7 dias
- Termo de consentimento obrigatório

### 👶 Gestão de Bebês
- Cadastro completo (nome, sexo, datas, peso/altura ao nascer)
- Suporte para prematuros com idade corrigida
- Configurações personalizadas por bebê
- Múltiplos bebês por conta

### 📊 Monitoramento de Crescimento
- Registro de peso, altura e perímetro cefálico
- **Cálculo automático de percentis OMS** com interpolação precisa
- Peso teórico baseado em crescimento real + curva OMS (25% real + 75% OMS)
- Gráfico de peso vs curva OMS de referência

### 🍼 Controle de Alimentação
- **Timer integrado** para mamadas no peito (Start/Pause/Stop)
- Conversão automática de duração → ml (customizável por idade)
- Registro de mamadeiras
- Cálculo de meta diária (ml/kg/dia)
- Gráfico de volume dos últimos 7 dias
- **Lembretes automáticos** (3h ou 4h após última mamada)
- **Alerta de baixa ingestão** (diário às 18h se <70% da meta)

### 👶 Controle de Fraldas
- Registro de xixi, cocô ou ambos
- Pesagem de fralda para calcular volume de xixi
- Meta diária (10% do peso teórico)
- Gráfico de volume dos últimos 7 dias

### 💊 Gestão de Medicamentos
- Cadastro com horários programados
- Checklist diário de medicamentos
- **Lembretes automáticos** (5 min antes do horário)
- Histórico de tomadas/pulos

### 🤒 Rastreamento de Sintomas
- Tipos: Febre, cólica, erupção cutânea, congestão, etc.
- Níveis de severidade (leve, moderado, grave)
- Registro de temperatura
- Histórico completo

### 📈 Gráficos Interativos (Recharts)
- **Peso vs Curva OMS**: Comparação com percentil de referência
- **Volume de Leite (7 dias)**: Bar chart com meta diária
- **Volume de Xixi (7 dias)**: Bar chart com meta diária

### ⚙️ Configurações
- Seletor de idioma (PT/EN/ES)
- Editor de constantes (ml/min, ml/kg, tara fralda)
- Toggles de notificações
- Toggle de idade corrigida (prematuros)
- Alterar senha

### 🔔 Notificações Push (FCM)
- Lembrete de mamada
- Lembrete de medicamento
- Alerta de baixa ingestão
- Cron jobs automáticos

### 📱 PWA Completo
- Instalável no dispositivo
- Manifest.json configurado
- Service Worker para FCM
- Ícones 192x192 e 512x512

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 18** - Biblioteca UI
- ⚡ **Vite** - Build tool
- 🎨 **Tailwind CSS** - Styling
- 🔄 **React Router** - Navegação
- 📊 **Recharts** - Gráficos interativos
- 🌍 **i18next** - Internacionalização
- 🔥 **Firebase SDK** - Push notifications
- 📡 **Axios** - HTTP client
- 📅 **date-fns** - Manipulação de datas
- 🎯 **Lucide React** - Ícones

### Backend
- 🚀 **Node.js + Express** - Framework web
- 🗄️ **PostgreSQL** - Banco de dados
- 🔷 **Prisma ORM** - Database toolkit
- 🔐 **JWT** - Autenticação
- 🔒 **Bcrypt** - Hash de senhas
- 📧 **Nodemailer** - Envio de emails
- 🔥 **Firebase Admin** - Push notifications
- ✅ **Zod** - Validação de schemas
- ⏰ **node-cron** - Tarefas agendadas

---

## 📁 Estrutura do Projeto

```
babytrack-pro/
├── frontend/                 # React + Vite + Tailwind
│   ├── public/              # Assets estáticos + PWA
│   │   ├── manifest.json
│   │   ├── firebase-messaging-sw.js
│   │   └── icons/
│   └── src/
│       ├── components/      # Componentes React
│       │   ├── auth/       # Login, Signup, OTP
│       │   ├── baby/       # Setup, Profile
│       │   ├── dashboard/  # Dashboard, Status, Actions
│       │   ├── records/    # Feeding, Diaper, Growth
│       │   ├── charts/     # Gráficos Recharts
│       │   ├── health/     # Medication, Symptom
│       │   ├── settings/   # Configurações
│       │   └── common/     # Button, Input, Modal, etc
│       ├── contexts/        # AuthContext, BabyContext, NotificationContext
│       ├── hooks/           # useAuth, useBaby, useNotifications, useCalculations
│       ├── services/        # API calls (auth, baby, records, etc)
│       ├── utils/           # constants, calculation-helpers, validators, formatters
│       ├── data/            # oms-data.json (curvas OMS)
│       ├── i18n/            # Traduções (pt, en, es)
│       ├── pages/           # LoginPage, DashboardPage, ChartsPage, etc
│       ├── App.jsx          # Routing + Context providers
│       └── main.jsx         # Entry point
│
└── backend/                  # Node.js + Express + Prisma
    ├── prisma/              # Schema + Migrations + Seed
    └── src/
        ├── config/          # database, firebase, env
        ├── controllers/     # auth, baby, feeding, diaper, growth, medication, symptom, fcm
        ├── middleware/      # authMiddleware, errorHandler, rateLimiter, validator
        ├── routes/          # Rotas da API
        ├── services/        # email, otp, oms, calculation, push
        ├── utils/           # jwt, bcrypt, logger, constants
        ├── cron/            # Cron jobs (notificações)
        ├── data/            # oms-data.json
        └── server.js        # Entry point
```

---

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js 16+ e npm/yarn
- PostgreSQL 12+
- Conta Firebase (para push notifications)
- Conta Gmail/SMTP (para envio de OTP)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/babytrack-pro.git
cd babytrack-pro
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Popular banco com dados de teste (opcional)
npm run seed

# Iniciar servidor
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com URL do backend e credenciais Firebase

# Iniciar aplicação
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 4. Criar Ícones PWA

Substitua os placeholders em `/frontend/public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

### 5. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite Cloud Messaging
3. Copie as credenciais para `.env` (frontend e backend)
4. Atualize `/frontend/public/firebase-messaging-sw.js` com suas credenciais

---

## 🧮 Lógica de Negócio (Cálculos Críticos)

### 1. Idade

```javascript
// Cronológica
idadeCronologica = dataAtual - dataNascimento

// Corrigida (apenas prematuros: nascimento < DPP)
idadeCorrigida = dataAtual - DPP

// Toggle global no app (campo useAdjustedAge no Baby)
```

### 2. Peso Teórico Diário

```javascript
SE (diasDesdeÚltimoPeso <= 15):
  ganhoReal = (pesoAtual - pesoAnterior) / diasEntrePesos
  ganhoOMS = getDiferençaCurvaOMS(idade, sexo, percentil)
  pesoTeórico = pesoAtual + ((ganhoReal * 0.25) + (ganhoOMS * 0.75)) * diasDesdeÚltimoPeso
SENÃO:
  pesoTeórico = curvaOMS[idade][sexo][percentil]
```

### 3. Conversão Amamentação

```javascript
volumeML = duração(minutos) * taxaPorIdade
// 0-1m=5ml/min, 1-3m=6ml/min, 3-6m=7ml/min, 6+m=8ml/min
// Ajustável em settings (Baby.mlPerMinBreastfeeding)
```

### 4. Alvos Diários

```javascript
alvoLeite = pesoTeórico(kg) * 150ml/kg  // Ajustável
alvoXixi = pesoTeórico(g) * 10%
```

### 5. Percentil OMS (Interpolação Precisa)

```javascript
// Interpolação linear entre pontos da tabela OMS
percentil = calculatePercentile(valor, idadeMeses, sexo, metric)
```

---

## 📊 API REST

### Autenticação

```bash
POST /api/auth/signup          # Cadastro
POST /api/auth/login           # Login
POST /api/auth/verify-otp      # Verificar OTP
POST /api/auth/resend-otp      # Reenviar OTP
POST /api/auth/logout          # Logout
GET  /api/auth/me              # Usuário atual
PUT  /api/auth/change-password # Alterar senha
```

### Bebê

```bash
POST /api/baby           # Criar bebê
GET  /api/baby           # Listar bebês
GET  /api/baby/:id       # Obter bebê
PUT  /api/baby/:id       # Atualizar bebê
DELETE /api/baby/:id     # Deletar bebê
```

### Alimentação

```bash
POST /api/feeding        # Criar registro
GET  /api/feeding        # Listar registros
GET  /api/feeding/stats  # Estatísticas
PUT  /api/feeding/:id    # Atualizar registro
DELETE /api/feeding/:id  # Deletar registro
```

### Fraldas, Crescimento, Medicamentos, Sintomas

Mesmos endpoints CRUD + stats/today quando aplicável.

Veja documentação completa em `backend/API.md`

---

## 🔔 Notificações Push

### Tipos de Notificação

1. **Lembrete de Mamada**
   - Trigger: X horas após última mamada (3h ou 4h configurável)
   - Cron: A cada 5 min
   - Mensagem: "🍼 Hora da mamada de [Nome]!"

2. **Lembrete de Medicamento**
   - Trigger: 5 min antes do horário programado
   - Cron: A cada 5 min
   - Mensagem: "💊 [Medicamento] - [Dose] às [Horário]"

3. **Alerta de Baixa Ingestão**
   - Trigger: Às 18h, se volume < 70% do alvo
   - Cron: Diário às 18h
   - Mensagem: "⚠️ [Nome] mamou apenas XXml hoje (meta: YYml)"

---

## 🧪 Dados de Teste

Após executar `npm run seed` no backend:

```
Email: teste@babytrack.com
Senha: password123
Bebê: Miguel (3 meses)
```

O seed cria:
- 1 usuário
- 1 bebê (3 meses)
- 13 registros de crescimento (semanal)
- ~50 mamadas (últimos 7 dias)
- ~60 fraldas (últimos 7 dias)
- 2 medicamentos (Vitamina D, Probiótico)
- 14 logs de medicamentos
- 2 sintomas

---

## 🌍 Internacionalização

Idiomas suportados:
- 🇧🇷 **Português** (pt)
- 🇺🇸 **English** (en)
- 🇪🇸 **Español** (es)

Arquivos de tradução em `/frontend/src/i18n/locales/`

---

## 🎨 Design System

### Paleta de Cores

```css
--primary: #60A5FA      /* Azul claro */
--secondary: #86EFAC    /* Verde pastel */
--danger: #F87171       /* Vermelho suave */
--success: #34D399      /* Verde */
--warning: #FBBF24      /* Amarelo */
--bg: #F9FAFB           /* Fundo */
--text: #1F2937         /* Texto */
```

### Princípios UI/UX

- **Mobile-First**: Viewport base 375px
- **Botões**: Altura mínima 48px
- **Espaçamento**: Padding 16px, margem cards 12px
- **Tipografia**: Inter (Bold/Regular), 16px base
- **Acessibilidade**: Labels, ARIA, contraste 4.5:1

---

## 📖 Documentação

- **Backend**: `/backend/README.md` - Documentação completa do backend
- **API**: `/backend/API.md` - Documentação detalhada da API REST
- **Setup**: `/backend/SETUP.md` - Guia de instalação rápida
- **Frontend**: `/frontend/README.md` - Documentação do frontend

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu-email@exemplo.com

---

## 🙏 Agradecimentos

- [World Health Organization (WHO)](https://www.who.int/) - Dados das curvas de crescimento
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Firebase](https://firebase.google.com/)
- [Recharts](https://recharts.org/)

---

<div align="center">

Feito com ❤️ para pais e bebês

</div>
