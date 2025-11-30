import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../services/auth_service.dart';

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(
    4,
    (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(
    4,
    (index) => FocusNode(),
  );
  
  bool _isLoading = false;
  String? _dni;
  String? _phoneNumber;
  String? _errorMessage;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, String>?;
    _dni = args?['dni'];
    _phoneNumber = args?['phone'] ?? '+34 XXX XXX XXX';
  }

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _handleOtpChange(int index, String value) {
    // Limpiar mensaje de error cuando el usuario empiece a escribir
    if (_errorMessage != null) {
      setState(() {
        _errorMessage = null;
      });
    }

    if (value.isNotEmpty && index < 3) {
      _focusNodes[index + 1].requestFocus();
    }
    
    // Si todos los campos están llenos, auto-verificar
    if (_controllers.every((controller) => controller.text.isNotEmpty)) {
      _verifyOtp();
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _controllers.map((c) => c.text).join();
    
    if (otp.length != 4) {
      setState(() {
        _errorMessage = 'Por favor, introduce el código completo de 4 dígitos';
      });
      
      // Anunciar error para lectores de pantalla
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_errorMessage!),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    // Simular verificación
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    // TODO: Validar OTP real (por ahora acepta cualquier código)
    
    // Verificar si ya tiene credencial
    final authService = AuthService();
    final hasCredential = await authService.hasCredential(_dni ?? '');

    if (!mounted) return;

    if (hasCredential) {
      // Ya tiene credencial → Login directo a Home
      await authService.login(_dni ?? '');
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
    } else {
      // Primera vez → Onboarding
      Navigator.pushNamed(
        context,
        '/onboarding',
        arguments: _dni,
      );
    }
  }

  Future<void> _resendOtp() async {
    // Feedback háptico
    HapticFeedback.mediumImpact();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Código reenviado correctamente'),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
    
    // Limpiar campos y error
    setState(() {
      _errorMessage = null;
    });
    
    for (var controller in _controllers) {
      controller.clear();
    }
    _focusNodes[0].requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    // WCAG 2.2: Verificar contraste de colores
    final theme = Theme.of(context);
    final primaryColor = theme.primaryColor;
    
    return Scaffold(
      // WCAG 2.2: Permitir rotación de pantalla
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          // WCAG 2.2: Tooltip para accesibilidad
          tooltip: 'Volver atrás',
          onPressed: () => Navigator.pop(context),
          // WCAG 2.2: Área táctil mínima de 44x44
          iconSize: 24,
        ),
      ),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height - 
                          MediaQuery.of(context).padding.top - 
                          kToolbarHeight - 48,
            ),
            child: IntrinsicHeight(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),
                  
                  // WCAG 2.2: Semántica para lectores de pantalla
                  Semantics(
                    label: 'Icono de mensaje',
                    child: Icon(
                      Icons.message_outlined,
                      size: 64,
                      color: primaryColor,
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // WCAG 2.2: Contraste de texto adecuado
                  const Text(
                    'Verificación',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      // Color automático según tema
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 12),
                  
                  Text(
                    'Código enviado a',
                    style: TextStyle(
                      fontSize: 16,
                      // WCAG 2.2: Contraste mínimo 4.5:1 para texto normal
                      color: Colors.grey[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // WCAG 2.2: Información importante con semántica
                  Semantics(
                    label: 'Número de teléfono: ${_phoneNumber ?? "+34 XXX XXX XXX"}',
                    child: Text(
                      _phoneNumber ?? '+34 XXX XXX XXX',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // WCAG 2.2: Label y descripción para campos OTP
                  Semantics(
                    label: 'Campos de código de verificación de 4 dígitos',
                    child: Column(
                      children: [
                        // Mensaje de error visible
                        if (_errorMessage != null) ...[
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: Colors.red.shade50,
                              border: Border.all(color: Colors.red),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.error_outline, color: Colors.red, size: 20),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _errorMessage!,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        
                        // Campos OTP
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: List.generate(4, (index) {
                            return SizedBox(
                              // WCAG 2.2: Área táctil adecuada
                              width: 64,
                              height: 64,
                              child: Semantics(
                                label: 'Dígito ${index + 1} de 4',
                                child: TextField(
                                  controller: _controllers[index],
                                  focusNode: _focusNodes[index],
                                  textAlign: TextAlign.center,
                                  keyboardType: TextInputType.number,
                                  maxLength: 1,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  decoration: InputDecoration(
                                    counterText: '',
                                    // WCAG 2.2: Indicador visual de error
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: BorderSide(
                                        color: _errorMessage != null 
                                            ? Colors.red 
                                            : Colors.grey,
                                        width: _errorMessage != null ? 2 : 1,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: BorderSide(
                                        color: _errorMessage != null 
                                            ? Colors.red 
                                            : primaryColor,
                                        width: 2,
                                      ),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: const BorderSide(
                                        color: Colors.red,
                                        width: 2,
                                      ),
                                    ),
                                    // WCAG 2.2: Padding suficiente
                                    contentPadding: const EdgeInsets.symmetric(vertical: 16),
                                  ),
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly,
                                  ],
                                  onChanged: (value) => _handleOtpChange(index, value),
                                  onTap: () {
                                    _controllers[index].selection = TextSelection.fromPosition(
                                      TextPosition(offset: _controllers[index].text.length),
                                    );
                                  },
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // WCAG 2.2: Contraste y área táctil adecuada
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '¿No recibiste el código? ',
                        style: TextStyle(color: Colors.grey[700]),
                      ),
                      // WCAG 2.2: Área táctil mínima
                      TextButton(
                        onPressed: _resendOtp,
                        style: TextButton.styleFrom(
                          minimumSize: const Size(44, 44),
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                        ),
                        child: const Text(
                          'Reenviar',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // WCAG 2.2: Botón con semántica y tamaño adecuado
                  Semantics(
                    button: true,
                    enabled: !_isLoading,
                    label: _isLoading 
                        ? 'Verificando código, por favor espera' 
                        : 'Confirmar código de verificación',
                    child: SizedBox(
                      width: double.infinity,
                      height: 48, // WCAG 2.2: Altura mínima recomendada
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _verifyOtp,
                        style: ElevatedButton.styleFrom(
                          // WCAG 2.2: Contraste adecuado en estados
                          disabledBackgroundColor: Colors.grey[400],
                          disabledForegroundColor: Colors.grey[700],
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                  semanticsLabel: 'Cargando',
                                ),
                              )
                            : const Text(
                                'Confirmar',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
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