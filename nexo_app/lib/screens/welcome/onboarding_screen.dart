// lib/screens/welcome/onboarding_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/semantics.dart';
import '../../widgets/onboarding_page.dart';
import '../../services/auth_service.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  final AuthService _authService = AuthService();
  int _currentPage = 0;
  String? _dni;
  bool _isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Recibir el DNI desde login
    _dni = ModalRoute.of(context)?.settings.arguments as String?;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _goToNextPage() {
    if (_currentPage < 1) {
      // WCAG 2.2: Feedback háptico en navegación
      HapticFeedback.lightImpact();
      
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      
      // WCAG 2.2: Anunciar cambio de página para lectores de pantalla
      _announcePageChange(_currentPage + 1);
    } else {
      _completeOnboarding();
    }
  }

  Future<void> _completeOnboarding() async {
    setState(() {
      _isLoading = true;
    });

    // WCAG 2.2: Feedback háptico en acción importante
    HapticFeedback.mediumImpact();

    // Guardar que completó el onboarding
    if (_dni != null) {
      await _authService.completeOnboarding(_dni!);
    }

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
  }

  void _goToPreviousPage() {
    // WCAG 2.2: Feedback háptico
    HapticFeedback.lightImpact();
    
    _pageController.previousPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    
    // WCAG 2.2: Anunciar cambio de página
    _announcePageChange(_currentPage - 1);
  }

  // WCAG 2.2: Anunciar cambios de página para tecnologías asistivas
  void _announcePageChange(int pageIndex) {
    final announcements = [
      'Página 1 de 2: Información unificada',
      'Página 2 de 2: Seguridad garantizada',
    ];
    
    if (pageIndex >= 0 && pageIndex < announcements.length) {
      // Usar SemanticsService para anunciar
      SemanticsService.announce(
        announcements[pageIndex],
        TextDirection.ltr,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // WCAG 2.2: Semántica global de la pantalla
      body: Semantics(
        label: 'Tutorial de bienvenida, página ${_currentPage + 1} de 2',
        child: Stack(
          children: [
            // PageView principal
            PageView(
              controller: _pageController,
              // WCAG 2.2: Permitir navegación con gestos accesibles
              physics: const ClampingScrollPhysics(),
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
                // Anunciar cambio automático de página
                _announcePageChange(index);
              },
              children: [
                // Página 1: Unified Data
                OnboardingPage(
                  icon: Icons.layers_rounded,
                  title: 'Toda tu información unificada',
                  description:
                      'Nexo agrupa todos tus datos importantes en un único lugar',
                  currentPage: 0,
                  totalPages: 2,
                  onNext: _goToNextPage,
                  onSkip: _completeOnboarding,
                  isLoading: _isLoading,
                ),

                // Página 2: Secured Data
                OnboardingPage(
                  icon: Icons.verified_user_rounded,
                  title: 'Seguridad Garantizada',
                  description:
                      'Tus datos permanecen protegidos, verificados y siempre bajo tu control',
                  currentPage: 1,
                  totalPages: 2,
                  onNext: _completeOnboarding,
                  onBack: _goToPreviousPage,
                  buttonText: 'Empezar',
                  isLoading: _isLoading,
                ),
              ],
            ),

            // WCAG 2.2: Indicador de carga accesible
            if (_isLoading)
              Positioned.fill(
                child: Container(
                  color: Colors.black45,
                  child: Center(
                    child: Semantics(
                      label: 'Cargando, por favor espera',
                      child: const CircularProgressIndicator(
                        color: Colors.white,
                        semanticsLabel: 'Procesando',
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}