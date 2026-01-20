# BabyTrack Pro - Frontend

Sistema profissional de acompanhamento neonatal.

## Tecnologias

- React 18
- Vite
- TailwindCSS
- React Router
- i18next
- Recharts
- Firebase (FCM)
- Axios

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:
   - `VITE_API_URL`: URL da API backend
   - Credenciais do Firebase para notificações push

## Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## Build para Produção

```bash
npm run build
```

Os arquivos estarão em `/dist`

## Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/       # Componentes React
│   ├── common/      # Componentes reutilizáveis
│   ├── auth/        # Autenticação
│   ├── baby/        # Perfil do bebê
│   ├── dashboard/   # Dashboard
│   ├── records/     # Registros (alimentação, fralda, crescimento)
│   ├── charts/      # Gráficos
│   ├── health/      # Saúde (medicamentos, sintomas)
│   └── settings/    # Configurações
├── contexts/        # React Contexts
├── hooks/           # Custom Hooks
├── i18n/            # Internacionalização
├── pages/           # Páginas
├── services/        # Serviços de API
├── utils/           # Utilitários
└── data/            # Dados estáticos (OMS)
```

## PWA

O aplicativo é um Progressive Web App (PWA) instalável com:
- Service Worker para cache
- Notificações push via Firebase
- Funciona offline

## Licença

Proprietário - BabyTrack Pro
