import 'package:flutter/material.dart';

class EduvantaColors {
  // Brand Palette
  static const Color primaryNavy = Color(0xFF102A56);
  static const Color royalBlue = Color(0xFF2563EB);
  static const Color electricBlue = Color(0xFF3B82F6);
  static const Color goldAccent = Color(0xFFF5B82E);
  static const Color background = Color(0xFFF5F8FC);
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF17243A);
  static const Color textSecondary = Color(0xFF64748B);

  // Status
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFF59E0B);
  static const Color danger = Color(0xFFDC2626);
  static const Color info = Color(0xFF0284C7);
}

class EduvantaTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: EduvantaColors.primaryNavy,
        primary: EduvantaColors.primaryNavy,
        secondary: EduvantaColors.royalBlue,
        tertiary: EduvantaColors.goldAccent,
        surface: EduvantaColors.surface,
      ),
      scaffoldBackgroundColor: EduvantaColors.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: EduvantaColors.primaryNavy,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: EduvantaColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: EduvantaColors.primaryNavy,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: EduvantaColors.electricBlue,
        secondary: EduvantaColors.royalBlue,
        tertiary: EduvantaColors.goldAccent,
        surface: Color(0xFF131D38),
      ),
      scaffoldBackgroundColor: const Color(0xFF0B132B),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF131D38),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF1E293B)),
        ),
      ),
    );
  }
}
