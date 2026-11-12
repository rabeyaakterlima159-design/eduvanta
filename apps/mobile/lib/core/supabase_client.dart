import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

const String supabaseUrl = String.fromEnvironment(
  'SUPABASE_URL',
  defaultValue: 'https://mock.supabase.co',
);

const String supabaseAnonKey = String.fromEnvironment(
  'SUPABASE_ANON_KEY',
  defaultValue: 'mock-anon-key',
);

final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

final currentSessionProvider = StateProvider<Session?>((ref) {
  try {
    return Supabase.instance.client.auth.currentSession;
  } catch (_) {
    return null;
  }
});

class CurrentUserContext {
  final String userId;
  final String schoolId;
  final String schoolName;
  final String role; // student, teacher, parent, staff, school_admin
  final String fullName;

  CurrentUserContext({
    required this.userId,
    required this.schoolId,
    required this.schoolName,
    required this.role,
    required this.fullName,
  });
}

final userContextProvider = StateProvider<CurrentUserContext>((ref) {
  return CurrentUserContext(
    userId: 'student-tanvir-01',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    role: 'student',
    fullName: 'Tanvir Ahmed',
  );
});
