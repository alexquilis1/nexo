# 🔐 Nexo - Credencial Digital Unificada

Aplicación móvil Flutter para gestión de credencial digital de personas con discapacidad, con verificación en blockchain BSV.

## ✨ Características

- 🔐 Autenticación segura con DNI/NIE + OTP
- 📱 Credencial digital con código QR verificable
- ♿ Acceso automático a beneficios y ayudas
- 📊 Gestión de datos personales y de discapacidad
- 📜 Historial de transacciones verificadas
- ✅ WCAG 2.2 AA compliant (totalmente accesible)

## 🏗️ Estructura

```
lib/
├── screens/
│   ├── welcome/      # Login, OTP, Onboarding
│   └── home/         # Home, Datos, Historial, Ajustes
├── widgets/          # Componentes reutilizables
└── services/         # Lógica de negocio
```

## ♿ Accesibilidad WCAG 2.2

- ✅ Contraste mínimo 4.5:1 para texto
- ✅ Áreas táctiles mínimas 44x44 dp
- ✅ Soporte TalkBack/VoiceOver
- ✅ Semántica completa en toda la app
- ✅ Feedback háptico en interacciones
- ✅ Mensajes de error descriptivos

## 📱 Formatos Soportados

**DNI:** 8 números + 1 letra (ej: `12345678A`)  
**NIE:** X/Y/Z + 7 números + 1 letra (ej: `X1234567B`)

## 🔐 Seguridad

- Autenticación de dos factores (DNI/NIE + OTP)
- Verificación en blockchain BSV
- Cifrado de extremo a extremo
- Almacenamiento local seguro

## 📄 Licencia

MIT License

---

<div align="center">

**Hecho con Flutter ❤️**

*Proyecto desarrollado para el Hackathon BSV 2024*

</div>