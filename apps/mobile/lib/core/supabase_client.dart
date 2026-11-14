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

// ==============================================================================
// Models
// ==============================================================================

class CurrentUserContext {
  final String userId;
  final String schoolId;
  final String schoolName;
  final String role; // 'student', 'teacher', 'parent', 'school_admin', 'staff'
  final String fullName;
  final String email;
  final String status; // 'active', 'pending', 'suspended'
  final String? studentClass;
  final String? studentSection;
  final String? rollNumber;

  CurrentUserContext({
    required this.userId,
    required this.schoolId,
    required this.schoolName,
    required this.role,
    required this.fullName,
    required this.email,
    this.status = 'active',
    this.studentClass,
    this.studentSection,
    this.rollNumber,
  });

  CurrentUserContext copyWith({
    String? userId,
    String? schoolId,
    String? schoolName,
    String? role,
    String? fullName,
    String? email,
    String? status,
    String? studentClass,
    String? studentSection,
    String? rollNumber,
  }) {
    return CurrentUserContext(
      userId: userId ?? this.userId,
      schoolId: schoolId ?? this.schoolId,
      schoolName: schoolName ?? this.schoolName,
      role: role ?? this.role,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      status: status ?? this.status,
      studentClass: studentClass ?? this.studentClass,
      studentSection: studentSection ?? this.studentSection,
      rollNumber: rollNumber ?? this.rollNumber,
    );
  }
}

class RegistrationApplication {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String schoolId;
  final String schoolName;
  final String className;
  final String section;
  final String desiredRoll;
  final String guardianName;
  final String guardianPhone;
  final String password;
  final String status; // 'pending', 'approved', 'rejected'
  final DateTime submittedAt;
  final String? reviewNotes;

  RegistrationApplication({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.schoolId,
    required this.schoolName,
    required this.className,
    required this.section,
    required this.desiredRoll,
    required this.guardianName,
    required this.guardianPhone,
    required this.password,
    this.status = 'pending',
    required this.submittedAt,
    this.reviewNotes,
  });

  RegistrationApplication copyWith({
    String? id,
    String? fullName,
    String? email,
    String? phone,
    String? schoolId,
    String? schoolName,
    String? className,
    String? section,
    String? desiredRoll,
    String? guardianName,
    String? guardianPhone,
    String? password,
    String? status,
    DateTime? submittedAt,
    String? reviewNotes,
  }) {
    return RegistrationApplication(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      schoolId: schoolId ?? this.schoolId,
      schoolName: schoolName ?? this.schoolName,
      className: className ?? this.className,
      section: section ?? this.section,
      desiredRoll: desiredRoll ?? this.desiredRoll,
      guardianName: guardianName ?? this.guardianName,
      guardianPhone: guardianPhone ?? this.guardianPhone,
      password: password ?? this.password,
      status: status ?? this.status,
      submittedAt: submittedAt ?? this.submittedAt,
      reviewNotes: reviewNotes ?? this.reviewNotes,
    );
  }
}

// ==============================================================================
// Predefined Demo Accounts
// ==============================================================================

final Map<String, CurrentUserContext> kDemoAccounts = {
  'student': CurrentUserContext(
    userId: 'student-tanvir-01',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    role: 'student',
    fullName: 'Tanvir Ahmed',
    email: 'student@dpis.edu.bd',
    status: 'active',
    studentClass: 'Class 10',
    studentSection: 'Section A',
    rollNumber: '1001',
  ),
  'teacher': CurrentUserContext(
    userId: 'teacher-rahim-01',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    role: 'teacher',
    fullName: 'Prof. Abdur Rahim',
    email: 'teacher@dpis.edu.bd',
    status: 'active',
  ),
  'parent': CurrentUserContext(
    userId: 'parent-kamal-01',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    role: 'parent',
    fullName: 'Mohammad Kamal',
    email: 'parent@dpis.edu.bd',
    status: 'active',
  ),
  'school_admin': CurrentUserContext(
    userId: 'admin-tariq-01',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    role: 'school_admin',
    fullName: 'Dr. Tariqul Islam',
    email: 'admin@dpis.edu.bd',
    status: 'active',
  ),
};

// ==============================================================================
// Registrations State Notifier (Approvals & Management)
// ==============================================================================

class RegistrationNotifier extends StateNotifier<List<RegistrationApplication>> {
  RegistrationNotifier()
      : super([
          RegistrationApplication(
            id: 'EDV-REG-2026-001',
            fullName: 'Sumon Das',
            email: 'sumon.das@gmail.com',
            phone: '+8801711223344',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            className: 'Class 10',
            section: 'Section B',
            desiredRoll: '1045',
            guardianName: 'Subir Das',
            guardianPhone: '+8801819334455',
            password: 'password123',
            status: 'pending',
            submittedAt: DateTime.now().subtract(const Duration(hours: 2)),
          ),
          RegistrationApplication(
            id: 'EDV-REG-2026-002',
            fullName: 'Nafisa Tabassum',
            email: 'nafisa.tabassum@gmail.com',
            phone: '+8801911556677',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            className: 'Class 9',
            section: 'Section A',
            desiredRoll: '9012',
            guardianName: 'Dr. Anwar Hossain',
            guardianPhone: '+8801712998877',
            password: 'password123',
            status: 'pending',
            submittedAt: DateTime.now().subtract(const Duration(hours: 5)),
          ),
        ]);

  String submitApplication({
    required String fullName,
    required String email,
    required String phone,
    required String schoolId,
    required String schoolName,
    required String className,
    required String section,
    required String desiredRoll,
    required String guardianName,
    required String guardianPhone,
    required String password,
  }) {
    final newId = 'EDV-REG-2026-${(100 + state.length + 1).toString().padLeft(3, '0')}';
    final application = RegistrationApplication(
      id: newId,
      fullName: fullName,
      email: email.trim().toLowerCase(),
      phone: phone,
      schoolId: schoolId,
      schoolName: schoolName,
      className: className,
      section: section,
      desiredRoll: desiredRoll,
      guardianName: guardianName,
      guardianPhone: guardianPhone,
      password: password,
      status: 'pending',
      submittedAt: DateTime.now(),
    );

    state = [application, ...state];
    return newId;
  }

  void approveApplication(String id) {
    state = [
      for (final app in state)
        if (app.id == id)
          app.copyWith(status: 'approved', reviewNotes: 'Approved by School Administration')
        else
          app,
    ];
  }

  void rejectApplication(String id, String reason) {
    state = [
      for (final app in state)
        if (app.id == id)
          app.copyWith(status: 'rejected', reviewNotes: reason)
        else
          app,
    ];
  }
}

final registrationApplicationsProvider =
    StateNotifierProvider<RegistrationNotifier, List<RegistrationApplication>>((ref) {
  return RegistrationNotifier();
});

// ==============================================================================
// Auth State & Controller
// ==============================================================================

class AuthState {
  final bool isLoggedIn;
  final CurrentUserContext? user;
  final String? errorMessage;
  final bool isLoading;

  const AuthState({
    this.isLoggedIn = false,
    this.user,
    this.errorMessage,
    this.isLoading = false,
  });

  AuthState copyWith({
    bool? isLoggedIn,
    CurrentUserContext? user,
    String? errorMessage,
    bool? isLoading,
  }) {
    return AuthState(
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      user: user ?? this.user,
      errorMessage: errorMessage,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthController extends StateNotifier<AuthState> {
  final Ref ref;

  AuthController(this.ref) : super(const AuthState());

  void loginDemo(String role) {
    final account = kDemoAccounts[role];
    if (account != null) {
      state = AuthState(isLoggedIn: true, user: account);
    }
  }

  Future<bool> loginWithCredentials({
    required String email,
    required String password,
    required String role,
    String? schoolId,
    String? schoolName,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    // Short simulated network delay
    await Future.delayed(const Duration(milliseconds: 300));

    final normalizedEmail = email.trim().toLowerCase();

    // Check if matching any registered application
    final applications = ref.read(registrationApplicationsProvider);
    final matchedApplication = applications.cast<RegistrationApplication?>().firstWhere(
          (a) => a?.email == normalizedEmail,
          orElse: () => null,
        );

    if (matchedApplication != null) {
      if (matchedApplication.status == 'pending') {
        state = state.copyWith(
          isLoading: false,
          errorMessage:
              'Account Pending Approval! Your registration application has been received by ${matchedApplication.schoolName}. Please wait for school administration approval.',
        );
        return false;
      } else if (matchedApplication.status == 'rejected') {
        state = state.copyWith(
          isLoading: false,
          errorMessage:
              'Registration Rejected: ${matchedApplication.reviewNotes ?? "Your admission request was declined. Contact campus office."}',
        );
        return false;
      } else if (matchedApplication.status == 'approved') {
        // Log in as approved student
        final newUser = CurrentUserContext(
          userId: 'usr-${matchedApplication.id}',
          schoolId: matchedApplication.schoolId,
          schoolName: matchedApplication.schoolName,
          role: 'student',
          fullName: matchedApplication.fullName,
          email: matchedApplication.email,
          status: 'active',
          studentClass: matchedApplication.className,
          studentSection: matchedApplication.section,
          rollNumber: matchedApplication.desiredRoll,
        );

        state = AuthState(isLoggedIn: true, user: newUser);
        return true;
      }
    }

    // Check predefined accounts
    for (final demo in kDemoAccounts.values) {
      if (demo.email.toLowerCase() == normalizedEmail ||
          (role == demo.role && normalizedEmail.contains(role))) {
        state = AuthState(isLoggedIn: true, user: demo);
        return true;
      }
    }

    // Allow flexible login with valid credentials
    final user = CurrentUserContext(
      userId: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      schoolId: schoolId ?? '22222222-2222-2222-2222-222222222201',
      schoolName: schoolName ?? 'Dhaka Premier International School',
      role: role,
      fullName: normalizedEmail.split('@').first.replaceAll('.', ' ').toUpperCase(),
      email: normalizedEmail,
      status: 'active',
      studentClass: role == 'student' ? 'Class 10' : null,
      studentSection: role == 'student' ? 'Section A' : null,
      rollNumber: role == 'student' ? '1099' : null,
    );

    state = AuthState(isLoggedIn: true, user: user);
    return true;
  }

  void logout() {
    state = const AuthState(isLoggedIn: false, user: null);
  }
}

final authStateProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref);
});

// Backward-compatible userContextProvider for widgets that read userContextProvider
final userContextProvider = Provider<CurrentUserContext>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.user ?? kDemoAccounts['student']!;
});
