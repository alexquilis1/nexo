// lib/widgets/onboarding_page.dart

import 'package:flutter/material.dart';

class OnboardingPage extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final int currentPage;
  final int totalPages;
  final VoidCallback onNext;
  final VoidCallback? onBack;
  final VoidCallback? onSkip;
  final String? buttonText;
  final bool isLoading;

  const OnboardingPage({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    required this.currentPage,
    required this.totalPages,
    required this.onNext,
    this.onBack,
    this.onSkip,
    this.buttonText,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLastPage = currentPage == totalPages - 1;

    return Scaffold(
      // WCAG 2.2: Color de fondo con contraste adecuado
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // WCAG 2.2: Botón "Saltar" con área táctil adecuada
              if (!isLastPage && onSkip != null)
                Align(
                  alignment: Alignment.topRight,
                  child: Semantics(
                    button: true,
                    label: 'Saltar tutorial',
                    hint: 'Ir directamente a la aplicación',
                    child: TextButton(
                      onPressed: isLoading ? null : onSkip,
                      style: TextButton.styleFrom(
                        // WCAG 2.2: Tamaño mínimo 44x44
                        minimumSize: const Size(44, 44),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                      child: Text(
                        'Saltar',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          // WCAG 2.2: Contraste adecuado
                          color: theme.primaryColor,
                        ),
                      ),
                    ),
                  ),
                ),

              const Spacer(),

              // WCAG 2.2: Icono con semántica descriptiva
              Semantics(
                label: currentPage == 0
                    ? 'Icono de información unificada'
                    : 'Icono de seguridad',
                child: Icon(
                  icon,
                  size: 120,
                  color: theme.primaryColor,
                ),
              ),

              const SizedBox(height: 48),

              // WCAG 2.2: Título con semántica de encabezado
              Semantics(
                header: true,
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    // Color se hereda del tema (contraste automático)
                  ),
                  textAlign: TextAlign.center,
                ),
              ),

              const SizedBox(height: 24),

              // WCAG 2.2: Descripción con contraste adecuado
              Text(
                description,
                style: TextStyle(
                  fontSize: 16,
                  height: 1.5,
                  // WCAG 2.2: Color con contraste mínimo 4.5:1
                  color: Colors.grey[700],
                ),
                textAlign: TextAlign.center,
              ),

              const Spacer(flex: 2),

              // WCAG 2.2: Botones de navegación
              Column(
                children: [
                  // Botón principal (Siguiente/Empezar)
                  Semantics(
                    button: true,
                    enabled: !isLoading,
                    label: isLastPage
                        ? 'Empezar a usar la aplicación'
                        : 'Ir a la siguiente página del tutorial',
                    child: SizedBox(
                      width: double.infinity,
                      height: 56, // WCAG 2.2: Altura recomendada
                      child: ElevatedButton(
                        onPressed: isLoading ? null : onNext,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          // WCAG 2.2: Estados con contraste adecuado
                          disabledBackgroundColor: Colors.grey[400],
                          disabledForegroundColor: Colors.grey[700],
                        ),
                        child: isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: Colors.white,
                                  semanticsLabel: 'Procesando',
                                ),
                              )
                            : Text(
                                buttonText ?? 'Siguiente',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                  ),

                  // Botón "Atrás" si no es la primera página
                  if (currentPage > 0 && onBack != null) ...[
                    const SizedBox(height: 12),
                    Semantics(
                      button: true,
                      enabled: !isLoading,
                      label: 'Volver a la página anterior',
                      child: SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: TextButton(
                          onPressed: isLoading ? null : onBack,
                          style: TextButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            // WCAG 2.2: Contraste en estado deshabilitado
                            disabledForegroundColor: Colors.grey[400],
                          ),
                          child: Text(
                            'Atrás',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              // WCAG 2.2: Contraste adecuado
                              color: isLoading
                                  ? Colors.grey[400]
                                  : theme.primaryColor,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}