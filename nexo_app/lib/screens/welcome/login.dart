// lib/screens/welcome/login.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _dniController = TextEditingController();
  final FocusNode _dniFocusNode = FocusNode();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _dniController.dispose();
    _dniFocusNode.dispose();
    super.dispose();
  }

  // WCAG 2.2: Validación de DNI y NIE
  bool _isValidDNI(String dni) {
    if (dni.isEmpty) return false;
    
    // Formato DNI: 8 dígitos + 1 letra (ej: 12345678A)
    final dniRegex = RegExp(r'^[0-9]{8}[A-Za-z]$');
    
    // Formato NIE: 1 letra (X, Y, Z) + 7 dígitos + 1 letra (ej: X1234567A)
    final nieRegex = RegExp(r'^[XYZxyz][0-9]{7}[A-Za-z]$');
    
    return dniRegex.hasMatch(dni) || nieRegex.hasMatch(dni);
  }

  String _getDocumentType(String dni) {
    if (dni.isEmpty) return 'documento';
    
    // Verificar si es NIE (empieza con X, Y o Z)
    if (RegExp(r'^[XYZxyz]').hasMatch(dni)) {
      return 'NIE';
    }
    // Si no, es DNI
    return 'DNI';
  }

  void _handleContinue() async {
    final dni = _dniController.text.trim().toUpperCase();

    // WCAG 2.2: Limpiar error previo
    setState(() {
      _errorMessage = null;
    });

    // WCAG 2.2: Validación con mensajes descriptivos
    if (dni.isEmpty) {
      setState(() {
        _errorMessage = 'Por favor, introduce tu DNI o NIE';
      });
      _dniFocusNode.requestFocus();
      return;
    }

    if (!_isValidDNI(dni)) {
      final docType = _getDocumentType(dni);
      setState(() {
        if (docType == 'NIE') {
          _errorMessage = 'El formato del NIE no es válido. Debe tener: letra (X, Y o Z) + 7 números + 1 letra';
        } else {
          _errorMessage = 'El formato del DNI no es válido. Debe tener: 8 números + 1 letra';
        }
      });
      _dniFocusNode.requestFocus();
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // WCAG 2.2: Feedback háptico en acción importante
    HapticFeedback.mediumImpact();

    // Simular validación con ONCE
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    // SIEMPRE ir a OTP (tanto primera vez como login)
    Navigator.pushNamed(
      context,
      '/otp',
      arguments: {
        'dni': dni,
        'phone': '+34 612 345 678', // Simular teléfono registrado en ONCE
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // WCAG 2.2: Ajustar vista cuando aparece el teclado
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height -
                  MediaQuery.of(context).padding.top -
                  MediaQuery.of(context).padding.bottom -
                  48,
            ),
            child: IntrinsicHeight(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),

                  // WCAG 2.2: Logo con semántica
                  Semantics(
                    label: 'Logo de Nexo',
                    image: true,
                    child: Image.asset(
                      'assets/logo.jpg',
                      width: 120,
                      height: 120,
                      fit: BoxFit.contain,
                      // WCAG 2.2: Fallback si no carga la imagen
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.fingerprint,
                          size: 80,
                          color: Theme.of(context).primaryColor,
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // WCAG 2.2: Título como header
                  Semantics(
                    header: true,
                    child: const Text(
                      'Bienvenido a Nexo',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),

                  const SizedBox(height: 8),

                  // WCAG 2.2: Subtítulo con contraste mejorado
                  Text(
                    'Tu credencial digital unificada',
                    style: TextStyle(
                      fontSize: 16,
                      // Mejor contraste: grey[700] en lugar de grey[600]
                      color: Colors.grey[700],
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 48),

                  // WCAG 2.2: Mensaje de error visible
                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        border: Border.all(color: Colors.red, width: 1.5),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Semantics(
                        liveRegion: true,
                        child: Row(
                          children: [
                            Icon(
                              Icons.error_outline,
                              color: Colors.red.shade700,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: TextStyle(
                                  color: Colors.red.shade900,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],

                  // WCAG 2.2: Campo DNI con semántica mejorada
                  Semantics(
                    textField: true,
                    label: 'Campo de DNI o NIE',
                    hint: 'Introduce tu documento de identidad',
                    child: TextField(
                      controller: _dniController,
                      focusNode: _dniFocusNode,
                      enabled: !_isLoading,
                      autofocus: true,
                      textCapitalization: TextCapitalization.characters,
                      keyboardType: TextInputType.text,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        labelText: 'DNI / NIE',
                        hintText: '12345678A o X1234567B',
                        // WCAG 2.2: Texto de ayuda
                        helperText: 'DNI: 8 números + letra | NIE: X/Y/Z + 7 números + letra',
                        helperStyle: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 11,
                        ),
                        // WCAG 2.2: Error visible en el campo
                        errorText: null, // El error ya se muestra arriba
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: _errorMessage != null
                                ? Colors.red
                                : Colors.grey.shade300,
                            width: _errorMessage != null ? 2 : 1,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: _errorMessage != null
                                ? Colors.red
                                : Colors.grey.shade300,
                            width: _errorMessage != null ? 2 : 1,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: _errorMessage != null
                                ? Colors.red
                                : Theme.of(context).primaryColor,
                            width: 2,
                          ),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Colors.red,
                            width: 2,
                          ),
                        ),
                        // WCAG 2.2: Prefijo para claridad
                        prefixIcon: Icon(
                          Icons.badge_outlined,
                          color: _errorMessage != null
                              ? Colors.red
                              : Colors.grey[600],
                        ),
                        // WCAG 2.2: Padding adecuado
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 16,
                        ),
                      ),
                      inputFormatters: [
                        LengthLimitingTextInputFormatter(9),
                        FilteringTextInputFormatter.allow(
                          RegExp(r'[0-9A-Za-z]'),
                        ),
                      ],
                      onChanged: (value) {
                        // WCAG 2.2: Limpiar error al empezar a escribir
                        if (_errorMessage != null) {
                          setState(() {
                            _errorMessage = null;
                          });
                        }
                      },
                      onSubmitted: (_) => _handleContinue(),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // WCAG 2.2: Botón con semántica y tamaño adecuado
                  Semantics(
                    button: true,
                    enabled: !_isLoading,
                    label: _isLoading
                        ? 'Verificando DNI, por favor espera'
                        : 'Continuar con el inicio de sesión',
                    child: SizedBox(
                      width: double.infinity,
                      height: 56, // WCAG 2.2: Altura recomendada
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleContinue,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          // WCAG 2.2: Estados con contraste adecuado
                          disabledBackgroundColor: Colors.grey[400],
                          disabledForegroundColor: Colors.grey[700],
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: Colors.white,
                                  semanticsLabel: 'Verificando',
                                ),
                              )
                            : const Text(
                                'Continuar',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // WCAG 2.2: Información adicional con semántica
                  Semantics(
                    readOnly: true,
                    child: Text(
                      'Protegido con cifrado de extremo a extremo',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}