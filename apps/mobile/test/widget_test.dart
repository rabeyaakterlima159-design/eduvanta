import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:eduvanta_app/main.dart';
import 'package:eduvanta_app/core/supabase_client.dart';
import 'package:eduvanta_app/features/sdui/sdui_models.dart';
import 'package:eduvanta_app/features/sdui/sdui_renderer.dart';

void main() {
  group('SDUI Engine Tests', () {
    test('Fallback SDUI layout generates valid widgets and theme', () {
      final layout = SDUIHomeScreenLayout.fallback();
      expect(layout.version, 1);
      expect(layout.maintenanceMode, false);
      expect(layout.widgets.length, 4);
      expect(layout.widgets.first.type, 'HeroBanner');
      expect(layout.theme.primaryColor, '#102A56');
    });

    test('Hex color parser converts 6-char hex correctly', () {
      final color = parseHexColor('#102A56');
      expect(color.value, 0xFF102A56);

      final accent = parseHexColor('#F5B82E');
      expect(accent.value, 0xFFF5B82E);
    });
  });

  group('Eduvanta Mobile App Auth & Navigation Tests', () {
    testWidgets('App renders AuthScreen with Sign In and Create Account by default', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: EduvantaMobileApp(),
        ),
      );

      // Verify Eduvanta Brand & Tabs
      expect(find.text('EDUVANTA'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
      expect(find.text('Create Account'), findsOneWidget);
      expect(find.text('Select Portal Role:'), findsOneWidget);
    });

    testWidgets('App renders Student Dashboard when authenticated as student', (WidgetTester tester) async {
      final container = ProviderContainer();
      container.read(authStateProvider.notifier).loginDemo('student');

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const EduvantaMobileApp(),
        ),
      );

      // Verify Welcome greeting
      expect(find.text('Hello, Student 👋'), findsOneWidget);
      expect(find.text('Tanvir Ahmed'), findsOneWidget);

      // Verify SDUI Hero Banner title
      expect(find.text('Welcome to Eduvanta'), findsOneWidget);

      // Verify Quick Stats
      expect(find.text('Attendance'), findsWidgets);
      expect(find.text('95%'), findsOneWidget);
    });
  });
}
