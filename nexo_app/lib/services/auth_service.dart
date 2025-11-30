import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _keyIsLoggedIn = 'is_logged_in';
  static const String _keyHasCompletedOnboarding = 'has_completed_onboarding';
  static const String _keyUserDni = 'user_dni';

  // Verificar si el usuario ya tiene credencial (ya pasó onboarding)
  Future<bool> hasCredential(String dni) async {
    final prefs = await SharedPreferences.getInstance();
    final savedDni = prefs.getString(_keyUserDni);
    final hasCompleted = prefs.getBool(_keyHasCompletedOnboarding) ?? false;
    
    // Si el DNI guardado coincide y completó onboarding → Ya tiene credencial
    return savedDni == dni && hasCompleted;
  }

  // Marcar que el usuario completó el onboarding (primera vez)
  Future<void> completeOnboarding(String dni) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyHasCompletedOnboarding, true);
    await prefs.setString(_keyUserDni, dni);
    await prefs.setBool(_keyIsLoggedIn, true);
  }

  // Login simple (usuario que ya tiene credencial)
  Future<void> login(String dni) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsLoggedIn, true);
    await prefs.setString(_keyUserDni, dni);
  }

  // Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsLoggedIn, false);
  }

  // Verificar si está logueado
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyIsLoggedIn) ?? false;
  }

  // Obtener DNI guardado
  Future<String?> getSavedDni() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyUserDni);
  }

  // Limpiar todo (para testing)
  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}