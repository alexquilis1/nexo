# 📁 nexo-web-examples

Mockups y ejemplos web del ecosistema Nexo para verificación y solicitud de beneficios.

## 📂 Estructura
```
nexo-web-examples/
├── nexo-web-validation/     # Verificación de acreditaciones ONCE
└── nexo-web-requests/        # Portal de solicitud de beneficios
```

---

## 🔍 nexo-web-validation

Página de verificación de acreditaciones ONCE mediante escaneo de QR.

### Características

- **Verificación en blockchain BSV**: Confirmación inmutable de credenciales
- **Datos protegidos**: Cifrado AES-256 de extremo a extremo
- **Información del titular**: Visualización de datos verificados
- **TXID único**: Trazabilidad completa en blockchain

### Datos Mostrados
```
✓ Credencial Válida
  Verificada en Blockchain BSV

📋 Información del Titular
  - Nombre
  - Apellidos
  - DNI/NIE
  - Tipo de discapacidad
  - Nº Expediente
  - Fecha de registro

🔐 Verificación Blockchain
  - Transaction ID (TXID)
  - Confirmación en BSV
```

### Uso

Resultado del escaneo del código QR de una acreditación ONCE para visualizar su información verificada.

---

## 🏛️ nexo-web-requests

Portal de la Comunidad de Madrid para solicitar beneficios por discapacidad.

### Páginas

**1. HomePage (`/`)**
- Portal de servicios públicos
- Acceso a beneficios por discapacidad
- Navegación a servicios (salud, educación, transporte, etc.)

**2. TramitesPage (`/tramites`)**
- Catálogo de beneficios disponibles
- Filtros por categoría (Transporte, Sanitario, Fiscal)
- Requisitos y montos de cada beneficio

**3. ApplyTramitePage (`/apply-tramite`)**
- Flujo de solicitud en 3 pasos:
  1. **Login**: Inicio de sesión con Nexo
  2. **Verificar**: Validación automática de requisitos
  3. **Confirmar**: Confirmación y registro en blockchain
  4. **Resultado**: Aprobación o rechazo con TXID

### Beneficios Disponibles

| ID | Beneficio | Categoría | Requisito | Monto |
|----|-----------|-----------|-----------|-------|
| 2 | Descuento en Transporte Público | Transporte | Visual ≥33% | 27.35€/mes |
| 3 | Ayudas Técnicas Visuales | Sanitario | Visual ≥33% | 600€ |
| 7 | Deducción Fiscal Severa | Fiscal | Visual ≥65% | 3000€/año |

### Flujo de Usuario
```
1. Usuario selecciona beneficio
   ↓
2. Inicia sesión con credencial Nexo
   ↓
3. Verificación automática de requisitos
   ↓
4. Confirmación de solicitud
   ↓
5. Registro en blockchain BSV
   ↓
6. Resolución instantánea (Aprobado/Rechazado)
```

### Datos Demo
```typescript
DEMO_USER = {
  txid: 'eed28d9a...537e06',
  dni: '12345678X',
  fullName: 'María García López',
  disabilityType: 'visual',
  disabilityPercentage: 85,
  expediente: 'ONCE-2024-VIS8529'
}
```

---

## 🎨 Diseño

- **Framework**: Next.js + React + TypeScript
- **Estilos**: Tailwind CSS
- **UI**: Componentes personalizados con diseño limpio y profesional
- **Responsive**: Adaptado para móvil y escritorio

---

## 🔐 Seguridad

- Verificación en blockchain BSV para inmutabilidad
- Cifrado AES-256 de datos personales
- Trazabilidad completa con TXID único
- Validación automática de requisitos

---

## 📝 Notas

- Los mockups son ejemplos visuales del sistema
- Las transacciones simulan el comportamiento real
- Los datos demo son ficticios para demostración
- La integración real requiere conexión con blockchain BSV