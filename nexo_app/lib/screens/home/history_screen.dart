import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // WCAG 2.2: Header con padding consistente
            Padding(
              padding: const EdgeInsets.all(20),
              child: Semantics(
                header: true,
                child: const Text(
                  'Historial',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            // WCAG 2.2: Lista con semántica
            Expanded(child: _buildHistoryList()),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryList() {
    // Lista de transacciones
    final historyItems = [
      _HistoryItem(
        title: 'Solicitud de ayuda municipal en el Ayuntamiento de Madrid',
        timestamp: DateTime(2024, 11, 28, 14, 32),
        icon: Icons.account_balance,
        category: 'Ayuntamiento',
      ),
      _HistoryItem(
        title: 'Descuento aplicado en Renfe',
        timestamp: DateTime(2024, 11, 26, 9, 15),
        icon: Icons.train,
        category: 'Transporte',
      ),
      _HistoryItem(
        title: 'Revisión médica registrada',
        timestamp: DateTime(2024, 11, 22, 11, 45),
        icon: Icons.local_hospital,
        category: 'Salud',
      ),
      _HistoryItem(
        title: 'Descuento en Kinépolis Ciudad de la Imagen',
        timestamp: DateTime(2024, 11, 20, 18, 20),
        icon: Icons.movie,
        category: 'Ocio',
      ),
      _HistoryItem(
        title: 'Credencial verificada en farmacia',
        timestamp: DateTime(2024, 11, 18, 10, 30),
        icon: Icons.local_pharmacy,
        category: 'Salud',
      ),
      _HistoryItem(
        title: 'Bonificación de IBI solicitada',
        timestamp: DateTime(2024, 11, 15, 12, 15),
        icon: Icons.home,
        category: 'Vivienda',
      ),
    ];

    return Semantics(
      label: 'Lista de transacciones, ${historyItems.length} elementos',
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: historyItems.length,
        itemBuilder: (context, index) {
          return _buildHistoryItem(
            historyItems[index],
            index,
            historyItems.length,
          );
        },
      ),
    );
  }

  Widget _buildHistoryItem(_HistoryItem item, int index, int totalItems) {
    // Formatear fecha de forma legible
    final formattedDate = _formatDate(item.timestamp);

    return Semantics(
      button: true,
      label: '${item.title}, ${item.category}, $formattedDate',
      hint: 'Toca para ver detalles',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            // WCAG 2.2: Feedback háptico
            HapticFeedback.lightImpact();
            // Navegar a detalles (implementar según necesidad)
            _showHistoryDetails(item);
          },
          // WCAG 2.2: Efecto visual de toque
          splashColor: Colors.white.withValues(alpha: 0.1),
          highlightColor: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            // WCAG 2.2: Altura mínima para área táctil
            constraints: const BoxConstraints(minHeight: 72),
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1F3A),
              borderRadius: BorderRadius.circular(12),
              // WCAG 2.2: Borde sutil para separación
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.05),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                // WCAG 2.2: Icono con contraste mejorado
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.blue.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    item.icon,
                    // Mejorado de blue[400] a blue[300]
                    color: const Color(0xFF93C5FD),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                // WCAG 2.2: Contenido con jerarquía clara
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Título
                      Text(
                        item.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          height: 1.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      // Categoría y timestamp
                      Row(
                        children: [
                          // Badge de categoría
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.blue.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              item.category,
                              style: const TextStyle(
                                color: Color(0xFF93C5FD),
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Timestamp con contraste mejorado
                          Expanded(
                            child: Text(
                              formattedDate,
                              style: const TextStyle(
                                // Mejorado de grey[500] a grey[400]
                                color: Color(0xFF9CA3AF),
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // WCAG 2.2: Indicador de navegación
                Icon(Icons.chevron_right, color: Colors.grey[600], size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // WCAG 2.2: Formatear fecha de forma accesible
  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    // Si es hoy
    if (difference.inDays == 0) {
      return 'Hoy, ${_formatTime(date)}';
    }
    // Si es ayer
    else if (difference.inDays == 1) {
      return 'Ayer, ${_formatTime(date)}';
    }
    // Si es esta semana
    else if (difference.inDays < 7) {
      return '${difference.inDays} días, ${_formatTime(date)}';
    }
    // Fecha completa
    else {
      return '${date.day}/${date.month}/${date.year}, ${_formatTime(date)}';
    }
  }

  String _formatTime(DateTime date) {
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  // WCAG 2.2: Mostrar detalles (implementación de ejemplo)
  void _showHistoryDetails(_HistoryItem item) {
    // Aquí navegarías a una pantalla de detalles
    // Navigator.push(context, MaterialPageRoute(...));
    debugPrint('Mostrar detalles de: ${item.title}');
  }
}

// WCAG 2.2: Modelo de datos para item de historial
class _HistoryItem {
  final String title;
  final DateTime timestamp;
  final IconData icon;
  final String category;

  _HistoryItem({
    required this.title,
    required this.timestamp,
    required this.icon,
    required this.category,
  });
}
