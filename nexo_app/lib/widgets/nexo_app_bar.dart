import 'package:flutter/material.dart';

class NexoAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String userName;
  final VoidCallback? onProfileTap;

  const NexoAppBar({
    super.key,
    this.userName = 'Usuario',
    this.onProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF0A0E27),
      elevation: 0,
      // WCAG 2.2: Avatar con área táctil y semántica
      leading: Semantics(
        button: true,
        label: 'Perfil de $userName',
        hint: 'Toca para ver tu perfil',
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            // WCAG 2.2: Área táctil mínima 48x48
            onTap: onProfileTap,
            customBorder: const CircleBorder(),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                // WCAG 2.2: Contraste mejorado para el fondo
                backgroundColor: const Color(0xFF1A1F3A),
                child: Icon(
                  Icons.person,
                  // WCAG 2.2: Contraste mejorado (blanco sobre oscuro)
                  color: Colors.white70,
                  size: 24,
                  semanticLabel: 'Icono de perfil',
                ),
              ),
            ),
          ),
        ),
      ),
      title: Semantics(
        // WCAG 2.2: Agrupar información del usuario
        label: 'Bienvenido $userName, estás en Nexo',
        header: true,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // WCAG 2.2: Saludo con mejor contraste
            Text(
              'Hola, $userName',
              style: const TextStyle(
                // Cambiado a Colors.white70 para mejor contraste
                color: Colors.white70,
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 2),
            // WCAG 2.2: Nombre de la app destacado
            const Text(
              'Nexo',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
      // WCAG 2.2: Acciones adicionales (opcional)
      actions: [
        // Ejemplo: botón de notificaciones
        // Descomenta si lo necesitas
        /*
        Semantics(
          button: true,
          label: 'Notificaciones',
          child: IconButton(
            icon: const Icon(Icons.notifications_outlined),
            color: Colors.white70,
            onPressed: () {
              // Acción de notificaciones
            },
            tooltip: 'Ver notificaciones',
            iconSize: 24,
          ),
        ),
        const SizedBox(width: 8),
        */
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}