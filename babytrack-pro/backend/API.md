# BabyTrack Pro - Documentação da API

Base URL: `http://localhost:3001`

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer <token>
```

---

## Autenticação (`/api/auth`)

### POST /api/auth/signup
Criar nova conta de usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Conta criada com sucesso. Verifique seu email para o código OTP.",
  "data": {
    "userId": "uuid",
    "email": "user@example.com"
  }
}
```

---

### POST /api/auth/login
Login com email e senha.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

---

### POST /api/auth/verify-otp
Verificar código OTP.

**Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "OTP verificado com sucesso",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

---

### POST /api/auth/resend-otp
Reenviar código OTP.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Novo código OTP enviado para seu email"
}
```

---

### GET /api/auth/me
Obter dados do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### POST /api/auth/change-password
Alterar senha do usuário.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

## Bebês (`/api/baby`)

### POST /api/baby
Criar novo bebê.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "João",
  "sex": "male",
  "birthDate": "2024-01-01T10:30:00.000Z",
  "expectedDueDate": null,
  "birthWeight": 3200,
  "birthHeight": 50,
  "birthHeadCircumference": 35,
  "useAdjustedAge": false,
  "mlPerMinBreastfeeding": {
    "0-1": 5,
    "1-3": 6,
    "3-6": 7,
    "6+": 8
  },
  "mlPerKgTarget": 150,
  "diaperTareWeight": 30,
  "feedingReminderHours": 3,
  "enableFeedingReminder": true,
  "enableLowIntakeAlert": true,
  "enableMedicationReminder": true,
  "omsPercentile": "P50"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Bebê cadastrado com sucesso",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "João",
    "sex": "male",
    // ... demais campos
  }
}
```

---

### GET /api/baby
Listar todos os bebês do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "João",
      // ... demais campos
    }
  ]
}
```

---

### GET /api/baby/:id
Obter dados de um bebê específico.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João",
    // ... demais campos
  }
}
```

---

### PUT /api/baby/:id
Atualizar dados de um bebê.

**Headers:** `Authorization: Bearer <token>`

**Body:** (campos que deseja atualizar)
```json
{
  "name": "João Pedro",
  "mlPerKgTarget": 160
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bebê atualizado com sucesso",
  "data": {
    "id": "uuid",
    "name": "João Pedro",
    // ... demais campos
  }
}
```

---

### DELETE /api/baby/:id
Deletar um bebê (e todos os registros relacionados).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bebê removido com sucesso"
}
```

---

## Mamadas (`/api/feeding`)

### POST /api/feeding
Criar registro de mamada.

**Headers:** `Authorization: Bearer <token>`

**Body (Amamentação):**
```json
{
  "babyId": "uuid",
  "type": "breast",
  "side": "left",
  "duration": 20,
  "timestamp": "2024-01-01T10:30:00.000Z",
  "notes": "Mamou bem"
}
```

**Body (Mamadeira):**
```json
{
  "babyId": "uuid",
  "type": "bottle",
  "volumeMl": 120,
  "timestamp": "2024-01-01T10:30:00.000Z",
  "notes": null
}
```

**Response:** `201 Created`

---

### GET /api/feeding?babyId=:babyId&startDate=:start&endDate=:end&page=1&limit=50
Listar registros de mamadas.

**Query Params:**
- `babyId` (obrigatório): UUID do bebê
- `startDate` (opcional): Data inicial (ISO 8601)
- `endDate` (opcional): Data final (ISO 8601)
- `page` (opcional): Página (default: 1)
- `limit` (opcional): Itens por página (default: 50)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "feedings": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "pages": 2
    }
  }
}
```

---

### GET /api/feeding/stats?babyId=:babyId&date=:date
Obter estatísticas de mamadas do dia.

**Query Params:**
- `babyId` (obrigatório): UUID do bebê
- `date` (opcional): Data (ISO 8601, default: hoje)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalVolume": 800,
    "dailyTarget": 1000,
    "percentage": 80,
    "theoreticalWeight": 5000,
    "feedingCount": 8,
    "lastFeeding": {...},
    "feedings": [...]
  }
}
```

---

### GET /api/feeding/:id
Obter registro específico.

---

### PUT /api/feeding/:id
Atualizar registro.

---

### DELETE /api/feeding/:id
Deletar registro.

---

## Fraldas (`/api/diaper`)

Endpoints similares aos de mamadas:
- `POST /api/diaper`
- `GET /api/diaper`
- `GET /api/diaper/stats`
- `GET /api/diaper/:id`
- `PUT /api/diaper/:id`
- `DELETE /api/diaper/:id`

**Body exemplo:**
```json
{
  "babyId": "uuid",
  "type": "both",
  "weightGrams": 150,
  "timestamp": "2024-01-01T10:30:00.000Z",
  "notes": null
}
```

---

## Crescimento (`/api/growth`)

### POST /api/growth
Criar registro de crescimento.

**Body:**
```json
{
  "babyId": "uuid",
  "weightGrams": 5200,
  "heightCm": 55,
  "headCircumferenceCm": 37,
  "timestamp": "2024-01-01T10:30:00.000Z",
  "notes": "Consulta de rotina"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registro de crescimento criado com sucesso",
  "data": {
    "id": "uuid",
    "babyId": "uuid",
    "weightGrams": 5200,
    "heightCm": 55,
    "headCircumferenceCm": 37,
    "weightPercentile": "P50",
    "heightPercentile": "P50",
    "headPercentile": "P50",
    "timestamp": "2024-01-01T10:30:00.000Z",
    "notes": "Consulta de rotina"
  }
}
```

---

### GET /api/growth/latest?babyId=:babyId
Obter último registro de crescimento.

---

## Medicações (`/api/medication`)

### POST /api/medication
Criar medicação.

**Body:**
```json
{
  "babyId": "uuid",
  "name": "Vitamina D",
  "dosage": "5 gotas",
  "frequency": "1x/dia",
  "times": ["08:00"],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "isActive": true,
  "notes": "Após mamada da manhã"
}
```

---

### GET /api/medication/today?babyId=:babyId
Obter medicações de hoje com status de tomada.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vitamina D",
      "dosage": "5 gotas",
      "times": ["08:00"],
      "logs": [
        {
          "scheduledTime": "2024-01-01T08:00:00.000Z",
          "takenAt": "2024-01-01T08:05:00.000Z",
          "skipped": false
        }
      ]
    }
  ]
}
```

---

### POST /api/medication/:id/log
Registrar tomada de medicamento.

**Body:**
```json
{
  "scheduledTime": "2024-01-01T08:00:00.000Z",
  "takenAt": "2024-01-01T08:05:00.000Z",
  "skipped": false,
  "notes": null
}
```

---

## Sintomas (`/api/symptom`)

### POST /api/symptom
Registrar sintoma.

**Body:**
```json
{
  "babyId": "uuid",
  "type": "fever",
  "severity": "moderate",
  "description": "Febre desde a manhã",
  "temperature": 38.5,
  "timestamp": "2024-01-01T10:30:00.000Z"
}
```

**Tipos disponíveis:**
- `fever`, `colic`, `rash`, `congestion`, `diarrhea`, `vomiting`, `other`

**Severidades:**
- `mild`, `moderate`, `severe`

---

## FCM Push Notifications (`/api/fcm`)

### POST /api/fcm/register
Registrar token FCM para notificações.

**Body:**
```json
{
  "token": "fcm-token-here"
}
```

---

### POST /api/fcm/unregister
Remover token FCM.

**Body:**
```json
{
  "token": "fcm-token-here"
}
```

---

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: email já existe)
- `422 Unprocessable Entity`: Erro de validação
- `429 Too Many Requests`: Rate limit excedido
- `500 Internal Server Error`: Erro no servidor

---

## Rate Limiting

- **Rotas de autenticação**: 100 requisições por hora
- **Rotas de API**: 1000 requisições por 15 minutos

---

## Formato de Erros

```json
{
  "success": false,
  "message": "Descrição do erro",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```
