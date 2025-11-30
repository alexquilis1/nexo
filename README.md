# 🔷 Nexo - Sistema de Credenciales Digitales en Blockchain

Sistema completo de gestión de credenciales digitales para personas con discapacidad, con verificación en blockchain BSV.

---

## 📁 Estructura del Proyecto
```
nexo/
├── nexo_app/              # 📱 Aplicación móvil Flutter
├── nexo-admin-once/       # 🛡️ Panel administrativo ONCE
├── nexo-backend/          # 🔌 API Backend Express
└── nexo-web-examples/     # 🌐 Ejemplos web y mockups
```

---

## 📱 nexo_app

**Aplicación móvil Flutter para usuarios finales**

Credencial digital unificada para personas con discapacidad con verificación en blockchain BSV.

### Características principales
- Autenticación segura con DNI/NIE + OTP
- Credencial digital con código QR verificable
- Acceso automático a beneficios y ayudas
- Historial de transacciones verificadas
- Totalmente accesible (WCAG 2.2 AA compliant)

### Stack tecnológico
- Flutter + Dart
- Blockchain BSV
- Diseño accesible (TalkBack/VoiceOver)

[📖 Ver documentación completa →](./nexo_app/README.md)

---

## 🛡️ nexo-admin-once

**Panel administrativo para ONCE**

Sistema de gestión y registro de acreditaciones de discapacidad en blockchain.

### Características principales
- Registro seguro de acreditaciones en blockchain BSV
- Cifrado AES-256 de datos personales
- Sistema de logging estructurado
- Trazabilidad completa con TXID único

### Stack tecnológico
- Next.js + TypeScript
- BSV SDK
- Cifrado AES-256

### API principal
`POST /api/register-encrypted` - Registra acreditación cifrada en blockchain

[📖 Ver documentación completa →](./nexo-admin-once/README.md)

---

## 🔌 nexo-backend

**API Backend con Express**

Servidor de búsqueda y verificación de acreditaciones ONCE en blockchain.

### Endpoints disponibles
- `GET /search` - Búsqueda por número de expediente
- `GET /verify` - Verificación de validez de acreditación

### Stack tecnológico
- Express + TypeScript
- Controladores modulares
- Validación de datos

[📖 Ver documentación completa →](./nexo-backend/README.md)

---

## 🌐 nexo-web-examples

**Mockups y ejemplos web**

Demostraciones del ecosistema Nexo en entornos web.

### Componentes

**nexo-web-validation**
- Página de verificación mediante escaneo QR
- Visualización de datos verificados en blockchain
- Confirmación de autenticidad

**nexo-web-requests**
- Portal de solicitud de beneficios (Comunidad de Madrid)
- Flujo completo de solicitud con verificación automática
- Catálogo de beneficios por discapacidad

### Stack tecnológico
- Next.js + React + TypeScript
- Tailwind CSS
- Diseño responsive

[📖 Ver documentación completa →](./nexo-web-examples/README.md)

---

## 🔒 Seguridad

- **Blockchain**: Almacenamiento inmutable en BSV
- **Cifrado**: AES-256 para datos personales
- **Autenticación**: 2FA con DNI/NIE + OTP
- **Trazabilidad**: TXID único para cada registro
- **Privacidad**: Solo datos cifrados en blockchain público

---

## 🚀 Inicio Rápido

### nexo_app (Flutter)
```bash
cd nexo_app
flutter pub get
flutter run
```

### nexo-admin-once (Next.js)
```bash
cd nexo-admin-once
npm install
npm run dev
```

### nexo-backend (Express)
```bash
cd nexo-backend
npm install
npm run dev
```

### nexo-web-examples (Next.js)
```bash
cd nexo-web-examples/nexo-web-requests
npm install
npm run dev
```

---

## 🤝 Contribución

Proyecto desarrollado para el **Hackathon BSV 2025**

---

<div align="center">

**Hecho con ❤️ usando Flutter, Next.js y Blockchain BSV**

</div>