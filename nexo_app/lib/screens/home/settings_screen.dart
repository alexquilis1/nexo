import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../services/auth_service.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // WCAG 2.2: Título como header
            Semantics(
              header: true,
              child: const Text(
                'Ajustes',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Sección Cuenta
            _buildSettingsSection(context, 'Cuenta', [
              _buildSettingsItem(
                context,
                Icons.person_outline,
                'Mis datos',
                'Ver y editar información personal',
                () {
                  // Navegar a perfil
                },
              ),
            ]),

            const SizedBox(height: 16),

            // Sección Privacidad
            _buildSettingsSection(context, 'Privacidad', [
              _buildSettingsItem(
                context,
                Icons.shield_outlined,
                'Privacidad y seguridad',
                'Gestionar permisos y datos',
                () {
                  // Navegar a privacidad
                },
              ),
            ]),

            const SizedBox(height: 16),

            // Sección General
            _buildSettingsSection(context, 'General', [
              _buildSettingsItem(
                context,
                Icons.notifications_outlined,
                'Notificaciones',
                'Configurar alertas y avisos',
                () {
                  // Navegar a notificaciones
                },
              ),
              _buildSettingsItem(
                context,
                Icons.help_outline,
                'Ayuda y soporte',
                'Obtener ayuda y contactar soporte',
                () {
                  // Navegar a ayuda
                },
              ),
              _buildSettingsItem(
                context,
                Icons.info_outline,
                'Acerca de',
                'Información de la aplicación',
                () {
                  // Navegar a acerca de
                },
              ),
            ]),

            const SizedBox(height: 32),

            // WCAG 2.2: Botón de cerrar sesión con confirmación
            Semantics(
              button: true,
              label: 'Cerrar sesión',
              hint: 'Toca para salir de tu cuenta',
              child: SizedBox(
                width: double.infinity,
                height: 56, // WCAG 2.2: Altura recomendada
                child: ElevatedButton(
                  onPressed: () => _showLogoutDialog(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.logout, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Cerrar sesión',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // WCAG 2.2: Información de versión con contraste adecuado
            Semantics(
              readOnly: true,
              child: Center(
                child: Text(
                  'Versión 1.0.0',
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // WCAG 2.2: Diálogo de confirmación antes de cerrar sesión
  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) => AlertDialog(
        backgroundColor: const Color(0xFF1A1F3A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          '¿Cerrar sesión?',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Text(
          'Se cerrará tu sesión y tendrás que iniciar sesión nuevamente.',
          style: TextStyle(color: Colors.grey[300], fontSize: 14),
        ),
        actions: [
          // WCAG 2.2: Botón Cancelar
          Semantics(
            button: true,
            label: 'Cancelar y permanecer en la aplicación',
            child: TextButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
              },
              style: TextButton.styleFrom(
                minimumSize: const Size(44, 44),
                foregroundColor: Colors.grey[400],
              ),
              child: const Text('Cancelar', style: TextStyle(fontSize: 16)),
            ),
          ),

          // WCAG 2.2: Botón Confirmar
          Semantics(
            button: true,
            label: 'Confirmar cierre de sesión',
            child: ElevatedButton(
              onPressed: () async {
                // Feedback háptico
                HapticFeedback.mediumImpact();

                Navigator.of(dialogContext).pop();
                await AuthService().logout();

                if (context.mounted) {
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    '/',
                    (route) => false,
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                foregroundColor: Colors.white,
                minimumSize: const Size(44, 44),
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
              child: const Text(
                'Cerrar sesión',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(
    BuildContext context,
    String title,
    List<Widget> items,
  ) {
    return Semantics(
      label: 'Sección de $title',
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1A1F3A),
          borderRadius: BorderRadius.circular(12),
          // WCAG 2.2: Sombra sutil para profundidad
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // WCAG 2.2: Título de sección con contraste mejorado
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                title.toUpperCase(),
                style: const TextStyle(
                  // Mejorado de grey[400] a grey[300]
                  color: Color(0xFFD1D5DB),
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            ...items,
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsItem(
    BuildContext context,
    IconData icon,
    String title,
    String description,
    VoidCallback onTap,
  ) {
    return Semantics(
      button: true,
      label: title,
      hint: description,
      enabled: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            // WCAG 2.2: Feedback háptico
            HapticFeedback.lightImpact();
            onTap();
          },
          // WCAG 2.2: Efecto ripple visible
          splashColor: Colors.white.withValues(alpha: 0.1),
          highlightColor: Colors.white.withValues(alpha: 0.05),
          child: Container(
            // WCAG 2.2: Altura mínima para área táctil
            constraints: const BoxConstraints(minHeight: 56),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(
                  // WCAG 2.2: Borde más visible
                  color: Colors.grey[800]!.withValues(alpha: 0.5),
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                // WCAG 2.2: Icono con contraste mejorado
                Icon(
                  icon,
                  // Mejorado de grey[400] a grey[300]
                  color: const Color(0xFFD1D5DB),
                  size: 24,
                ),
                const SizedBox(width: 16),
                // WCAG 2.2: Texto con información accesible
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      // Descripción opcional visible
                      if (description.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          description,
                          style: TextStyle(
                            color: Colors.grey[500],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                // WCAG 2.2: Indicador visual de navegación
                Icon(Icons.chevron_right, color: Colors.grey[600], size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
