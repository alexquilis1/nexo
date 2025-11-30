import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/semantics.dart';
import '../../widgets/nexo_app_bar.dart';
import 'home_screen.dart';
import 'data_screen.dart';
import 'history_screen.dart';
import 'settings_screen.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;

  // WCAG 2.2: Labels descriptivos para navegación
  static const List<String> _screenTitles = [
    'Inicio',
    'Mis Datos',
    'Historial de Transacciones',
    'Ajustes',
  ];

  void _onItemTapped(int index) {
    if (_selectedIndex == index) return;

    setState(() {
      _selectedIndex = index;
    });

    // WCAG 2.2: Feedback háptico en navegación
    HapticFeedback.lightImpact();

    // WCAG 2.2: Anunciar cambio de pantalla para lectores de pantalla
    _announceScreenChange(index);
  }

  // WCAG 2.2: Anunciar navegación para tecnologías asistivas
  void _announceScreenChange(int index) {
    final screenName = _screenTitles[index];
    // Usar context mounted para evitar errores
    if (mounted) {
      // Pequeño delay para que el cambio visual ocurra primero
      Future.delayed(const Duration(milliseconds: 100), () {
        if (mounted) {
          SemanticsService.announce(
            'Navegando a $screenName',
            TextDirection.ltr,
          );
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      // WCAG 2.2: AppBar solo en Home con semántica
      appBar: _selectedIndex == 0
          ? const NexoAppBar(userName: 'Junjie', onProfileTap: null)
          : null,
      // WCAG 2.2: Semántica de navegación principal
      body: Semantics(
        label: 'Pantalla de ${_screenTitles[_selectedIndex]}',
        child: IndexedStack(
          index: _selectedIndex,
          children: const [
            HomeContent(),
            DataScreen(),
            HistoryScreen(),
            SettingsScreen(),
          ],
        ),
      ),
      // WCAG 2.2: Barra de navegación mejorada
      bottomNavigationBar: _buildAccessibleBottomNav(),
    );
  }

  Widget _buildAccessibleBottomNav() {
    return Semantics(
      label: 'Navegación principal',
      container: true,
      child: Container(
        // WCAG 2.2: Altura mínima para área táctil
        height: 65,
        decoration: BoxDecoration(
          color: const Color(0xFF1A1F3A),
          // WCAG 2.2: Borde superior para separación visual
          border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.1), width: 1),
          ),
          // Sombra sutil para profundidad
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.transparent,
          elevation: 0,
          // WCAG 2.2: Contraste mejorado para item seleccionado
          selectedItemColor: const Color(0xFF818CF8), // Indigo más claro
          // WCAG 2.2: Contraste mejorado para items no seleccionados
          unselectedItemColor: const Color(0xFF9CA3AF), // Grey más claro
          // WCAG 2.2: Tamaño de fuente adecuado
          selectedFontSize: 12,
          unselectedFontSize: 11,
          // WCAG 2.2: Labels siempre visibles
          showSelectedLabels: true,
          showUnselectedLabels: true,
          // WCAG 2.2: Iconos con tamaño adecuado
          iconSize: 24,
          items: [
            _buildNavItem(
              icon: Icons.home_outlined,
              activeIcon: Icons.home,
              label: 'Inicio',
              semanticLabel: 'Ir a inicio',
            ),
            _buildNavItem(
              icon: Icons.folder_outlined,
              activeIcon: Icons.folder,
              label: 'Datos',
              semanticLabel: 'Ir a mis datos',
            ),
            _buildNavItem(
              icon: Icons.history_outlined,
              activeIcon: Icons.history,
              label: 'Historial',
              semanticLabel: 'Ir a historial de transacciones',
            ),
            _buildNavItem(
              icon: Icons.settings_outlined,
              activeIcon: Icons.settings,
              label: 'Ajustes',
              semanticLabel: 'Ir a ajustes',
            ),
          ],
        ),
      ),
    );
  }

  // WCAG 2.2: Helper para crear items de navegación accesibles
  BottomNavigationBarItem _buildNavItem({
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required String semanticLabel,
  }) {
    return BottomNavigationBarItem(
      icon: Semantics(
        label: semanticLabel,
        button: true,
        enabled: true,
        child: Padding(
          // WCAG 2.2: Padding para aumentar área táctil
          padding: const EdgeInsets.all(4),
          child: Icon(icon),
        ),
      ),
      activeIcon: Semantics(
        label: '$semanticLabel (activo)',
        button: true,
        selected: true,
        child: Padding(
          padding: const EdgeInsets.all(4),
          child: Icon(activeIcon),
        ),
      ),
      label: label,
      tooltip: semanticLabel,
    );
  }
}
