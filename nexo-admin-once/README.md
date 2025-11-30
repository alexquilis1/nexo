# 🛡️ NEXO Admin ONCE

Panel administrativo para gestionar acreditaciones de discapacidad de ONCE en blockchain BSV.

## 🚀 Características

- Registro seguro de acreditaciones en blockchain BSV
- Cifrado AES-256 de datos personales
- Validación con número de expediente ONCE
- Trazabilidad completa con TXID único

## 📋 Tipos de Discapacidad

**Visual**
- Soporte para braille, lector de pantalla y guía de audio
- Clasificación por grado y permanencia

**Auditiva**
- Soporte para audífono y lengua de signos
- Clasificación por grado y permanencia

## 🔧 Tecnologías

- Next.js + TypeScript
- BSV SDK (Blockchain Bitcoin SV)
- Cifrado AES-256

## 📡 API

### POST `/api/register-encrypted`

Registra una acreditación cifrada en blockchain.

**Request:**
```json
{
  "identityKey": "usuario_123",
  "encryptedData": "datos_cifrados...",
  "encryptionKey": "clave_aes...",
  "keyHash": "hash...",
  "expediente": "EXP-2025-001",
  "dni": "12345678A"
}
```

**Response:**
```json
{
  "success": true,
  "txid": "abc123...",
  "recordId": "def456...",
  "explorerUrl": "https://whatsonchain.com/tx/abc123..."
}
```

## 🔐 Seguridad

- **Cifrado**: AES-256-CBC para todos los datos personales
- **Blockchain**: Almacenamiento inmutable en BSV
- **Privacidad**: Solo datos cifrados en blockchain público


## 📝 Notas

- Cada registro genera un TXID único verificable públicamente
- Las claves de cifrado se guardan localmente para recuperación
- Los datos sin cifrar nunca se almacenan en blockchain

## 🔍 Explorador

Visualiza las transacciones en: https://whatsonchain.com