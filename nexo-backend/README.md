# 📂 Routes - API Endpoints

Rutas API para búsqueda y verificación de acreditaciones ONCE en blockchain.

## 📍 Endpoints Disponibles

### 🔍 Search - Búsqueda de Acreditaciones

**GET** `/search?expediente=EXP-2025-001`

Busca una acreditación por número de expediente.

**Query Parameters:**
- `expediente` (string, requerido): Número de expediente ONCE

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "txid": "abc123...",
    "expediente": "EXP-2025-001",
    "timestamp": "2025-11-30T10:30:00.000Z",
    "encryptedData": "...",
    "issuer": "ONCE"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Expediente no encontrado"
}
```

---

### ✅ Verify - Verificación de Acreditaciones

**GET** `/verify?expediente=EXP-2025-001`

Verifica la validez de una acreditación en blockchain.

**Query Parameters:**
- `expediente` (string, requerido): Número de expediente ONCE

**Response Success (200):**
```json
{
  "success": true,
  "verified": true,
  "expediente": "EXP-2025-001",
  "txid": "abc123...",
  "timestamp": "2025-11-30T10:30:00.000Z",
  "issuer": "ONCE"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "verified": false,
  "error": "Acreditación no encontrada"
}
```

## 📦 Estructura
```
routes/
├── searchRoute.ts    # Búsqueda de acreditaciones
└── verifyRoute.ts    # Verificación de acreditaciones
```