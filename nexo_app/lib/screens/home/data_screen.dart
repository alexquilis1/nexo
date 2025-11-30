import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class DataScreen extends StatelessWidget {
  const DataScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // WCAG 2.2: Header
            Padding(
              padding: const EdgeInsets.all(20),
              child: Semantics(
                header: true,
                child: const Text(
                  'Mis Datos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            // WCAG 2.2: Lista scrolleable
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                children: [
                  // Identificación
                  _buildExpandableCard(
                    'Identificación',
                    'Información personal básica',
                    [
                      _buildDataRow('Nombre completo', 'Junjie Wang López'),
                      _buildDataRow('DNI', '12345678X'),
                      _buildDataRow('Fecha de nacimiento', '15 de marzo, 1990'),
                      _buildDataRow('Domicilio', 'Madrid, España'),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Credencial
                  _buildExpandableCard(
                    'Credencial',
                    'Información de tu credencial Nexo',
                    [
                      _buildDataRow('Familia numerosa', 'No'),
                      _buildDataRow('Situación', 'Empleado'),
                      _buildDataRow('Discapacidad', 'Sí'),
                      _buildDataRow('Tipo de discapacidad', 'Visual'),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Discapacidad Visual
                  _buildExpandableCard(
                    'Discapacidad Visual',
                    'Detalles sobre tu discapacidad visual',
                    [
                      _buildDataRow('Tipo', 'Ceguera'),
                      _buildDataRow('Grado', '65%'),
                      _buildDataRow('Permanente', 'Sí'),
                      _buildDataRow('Severidad', 'Moderada'),
                      _buildDataRow('Lector de pantalla', 'Soportado'),
                      _buildDataRow('Braille', 'Requerido'),
                      _buildDataRow('Guía de audio', 'Activada'),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Blockchain
                  _buildExpandableCard(
                    'Blockchain',
                    'Verificación en cadena de bloques',
                    [
                      _buildDataRowWithBadge('Verificado por', 'ONCE'),
                      _buildDataRow('Hash BSV', '94AEF9C2A9'),
                      _buildDataRow('Firma ONCE', 'Válida'),
                      const SizedBox(height: 12),
                      // WCAG 2.2: Estado verificado con semántica
                      Semantics(
                        label: 'Estado: Verificado en Blockchain',
                        readOnly: true,
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.green.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.green.withValues(alpha: 0.3),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.check_circle,
                                color: Colors.green[400],
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              const Expanded(
                                child: Text(
                                  'Verificado en Blockchain',
                                  style: TextStyle(
                                    color: Color(0xFF86EFAC),
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpandableCard(
    String title,
    String description,
    List<Widget> children,
  ) {
    return Semantics(
      label: '$title, $description',
      child: Theme(
        data: ThemeData(
          dividerColor: Colors.transparent,
          // WCAG 2.2: Colores del expansion tile
          unselectedWidgetColor: const Color(0xFF9CA3AF),
        ),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1A1F3A),
            borderRadius: BorderRadius.circular(12),
            // WCAG 2.2: Borde sutil
            border: Border.all(color: Colors.white.withValues(alpha: 0.05), width: 1),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: ExpansionTile(
              // WCAG 2.2: Área táctil adecuada
              tilePadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 4,
              ),
              title: Semantics(
                header: true,
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              // WCAG 2.2: Subtítulo descriptivo
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  description,
                  style: const TextStyle(
                    color: Color(0xFF9CA3AF),
                    fontSize: 12,
                  ),
                ),
              ),
              // WCAG 2.2: Iconos con contraste mejorado
              iconColor: Colors.white,
              collapsedIconColor: const Color(0xFF9CA3AF),
              // WCAG 2.2: Color de fondo al expandir
              backgroundColor: const Color(0xFF1A1F3A),
              collapsedBackgroundColor: const Color(0xFF1A1F3A),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Column(children: children),
                ),
              ],
              // WCAG 2.2: Feedback al expandir/colapsar
              onExpansionChanged: (expanded) {
                HapticFeedback.selectionClick();
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDataRow(String label, String value) {
    return Semantics(
      label: '$label: $value',
      readOnly: true,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Text(
                '$label:',
                style: const TextStyle(
                  // WCAG 2.2: Mejorado de grey[400] a grey[300]
                  color: Color(0xFFD1D5DB),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 3,
              child: Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.right,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDataRowWithBadge(String label, String value) {
    return Semantics(
      label: '$label: $value (certificado)',
      readOnly: true,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Text(
                '$label:',
                style: const TextStyle(
                  color: Color(0xFFD1D5DB),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 3,
              child: Align(
                alignment: Alignment.centerRight,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    // WCAG 2.2: Color dorado con mejor contraste
                    color: const Color(0xFFFBBF24),
                    borderRadius: BorderRadius.circular(6),
                    // WCAG 2.2: Sombra para profundidad
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFBBF24).withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.verified,
                        size: 14,
                        color: Color(0xFF78350F),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        value,
                        style: const TextStyle(
                          // WCAG 2.2: Contraste mejorado sobre amarillo
                          color: Color(0xFF78350F),
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
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
