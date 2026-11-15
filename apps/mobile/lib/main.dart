import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme.dart';
import 'core/supabase_client.dart';
import 'features/auth/auth_screen.dart';
import 'features/student/student_dashboard.dart';
import 'features/teacher/teacher_dashboard.dart';
import 'features/parent/parent_dashboard.dart';
import 'features/admin/admin_dashboard.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: EduvantaMobileApp(),
    ),
  );
}

class EduvantaMobileApp extends ConsumerWidget {
  const EduvantaMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return MaterialApp(
      title: 'EDUVANTA',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {
          PointerDeviceKind.touch,
          PointerDeviceKind.mouse,
          PointerDeviceKind.trackpad,
          PointerDeviceKind.stylus,
        },
      ),
      theme: EduvantaTheme.lightTheme,
      darkTheme: EduvantaTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: authState.isLoggedIn
          ? _resolveRoleScreen(authState.user?.role ?? 'student')
          : const AuthScreen(),
    );
  }

  Widget _resolveRoleScreen(String role) {
    switch (role) {
      case 'teacher':
        return const TeacherDashboardScreen();
      case 'parent':
        return const ParentDashboardScreen();
      case 'super_admin':
      case 'school_admin':
      case 'staff':
        return const SchoolAdminDashboardScreen();
      case 'student':
      default:
        return const StudentDashboardScreen();
    }
  }
}
