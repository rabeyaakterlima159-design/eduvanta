import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme.dart';
import 'core/supabase_client.dart';
import 'features/student/student_dashboard.dart';
import 'features/teacher/teacher_dashboard.dart';
import 'features/parent/parent_dashboard.dart';

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
    final userContext = ref.watch(userContextProvider);

    return MaterialApp(
      title: 'EDUVANTA',
      debugShowCheckedModeBanner: false,
      theme: EduvantaTheme.lightTheme,
      darkTheme: EduvantaTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: _resolveRoleScreen(userContext.role),
    );
  }

  Widget _resolveRoleScreen(String role) {
    switch (role) {
      case 'teacher':
        return const TeacherDashboardScreen();
      case 'parent':
        return const ParentDashboardScreen();
      case 'student':
      default:
        return const StudentDashboardScreen();
    }
  }
}
