import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'backend_api.dart';

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
  final String role; // 'student', 'teacher', 'parent', 'school_admin', 'super_admin'
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

class SystemAccount {
  final String id;
  final String email;
  final String password;
  final String fullName;
  final String role;
  final String schoolId;
  final String schoolName;
  final String status;
  final String? studentClass;
  final String? studentSection;
  final String? rollNumber;

  SystemAccount({
    required this.id,
    required this.email,
    required this.password,
    required this.fullName,
    required this.role,
    required this.schoolId,
    required this.schoolName,
    this.status = 'active',
    this.studentClass,
    this.studentSection,
    this.rollNumber,
  });
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
// Persistent System Accounts (Real Credentials)
// ==============================================================================

class SystemAccountsNotifier extends StateNotifier<List<SystemAccount>> {
  SystemAccountsNotifier()
      : super([
          // Official Super Admin
          SystemAccount(
            id: 'usr-super-admin-01',
            email: 'rabeyaakterlima159@gmail.com',
            password: 'Australia515#',
            fullName: 'Rabeya Akter Lima',
            role: 'school_admin',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School (Executive Hub)',
            status: 'active',
          ),
          SystemAccount(
            id: 'usr-super-admin-02',
            email: 'sohel229229@gmail.com',
            password: 'shariar123',
            fullName: 'Sohel Shariar',
            role: 'school_admin',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School (Executive Hub)',
            status: 'active',
          ),
          // Student Account
          SystemAccount(
            id: 'usr-student-tanvir',
            email: 'student@dpis.edu.bd',
            password: 'password123',
            fullName: 'Tanvir Ahmed',
            role: 'student',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            status: 'active',
            studentClass: 'Class 10',
            studentSection: 'Section A',
            rollNumber: '1001',
          ),
          // Teacher Account
          SystemAccount(
            id: 'usr-teacher-rahim',
            email: 'teacher@dpis.edu.bd',
            password: 'password123',
            fullName: 'Prof. Abdur Rahim',
            role: 'teacher',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            status: 'active',
          ),
          // Parent Account
          SystemAccount(
            id: 'usr-parent-kamal',
            email: 'parent@dpis.edu.bd',
            password: 'password123',
            fullName: 'Mohammad Kamal',
            role: 'parent',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            status: 'active',
          ),
          // School Admin Account
          SystemAccount(
            id: 'usr-admin-tariq',
            email: 'admin@dpis.edu.bd',
            password: 'password123',
            fullName: 'Dr. Tariqul Islam',
            role: 'school_admin',
            schoolId: '22222222-2222-2222-2222-222222222201',
            schoolName: 'Dhaka Premier International School',
            status: 'active',
          ),
        ]);

  void addAccount(SystemAccount account) {
    state = [account, ...state];
  }
}

final systemAccountsProvider =
    StateNotifierProvider<SystemAccountsNotifier, List<SystemAccount>>((ref) {
  return SystemAccountsNotifier();
});

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
      status: 'approved',
      submittedAt: DateTime.now(),
    );

    state = [application, ...state];

    // Asynchronously synchronize application with central database
    BackendApiService().submitAdmissionApplication({
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'schoolId': schoolId,
      'schoolName': schoolName,
      'className': className,
      'section': section,
      'desiredRoll': desiredRoll,
      'guardianName': guardianName,
      'guardianPhone': guardianPhone,
      'password': password,
    });

    return newId;
  }

  void approveApplication(String id) {
    state = [
      for (final app in state)
        if (app.id == id)
          app.copyWith(status: 'approved', reviewNotes: 'Approved by Administration')
        else
          app,
    ];
    // Sync approval to shared central database
    BackendApiService().updateAdmissionStatus(id, 'approve');
  }

  void rejectApplication(String id, String reason) {
    state = [
      for (final app in state)
        if (app.id == id)
          app.copyWith(status: 'rejected', reviewNotes: reason)
        else
          app,
    ];
    // Sync rejection to shared central database
    BackendApiService().updateAdmissionStatus(id, 'reject', reason);
  }

  Future<void> syncFromBackend() async {
    try {
      final remote = await BackendApiService().fetchAdmissions();
      if (remote != null && remote.isNotEmpty) {
        final list = remote.map((m) {
          return RegistrationApplication(
            id: m['id']?.toString() ?? 'EDV-REG-000',
            fullName: m['fullName']?.toString() ?? 'Student',
            email: m['email']?.toString() ?? '',
            phone: m['phone']?.toString() ?? '',
            schoolId: m['schoolId']?.toString() ?? '22222222-2222-2222-2222-222222222201',
            schoolName: m['schoolName']?.toString() ?? 'Green Hill International School',
            className: m['className']?.toString() ?? 'Class 10',
            section: m['section']?.toString() ?? 'Section A',
            desiredRoll: m['desiredRoll']?.toString() ?? '01',
            guardianName: m['guardianName']?.toString() ?? 'Guardian',
            guardianPhone: m['guardianPhone']?.toString() ?? '',
            password: m['password']?.toString() ?? 'password123',
            status: m['status']?.toString() ?? 'pending',
            submittedAt: DateTime.tryParse(m['submittedAt']?.toString() ?? '') ?? DateTime.now(),
            reviewNotes: m['reviewNotes']?.toString(),
          );
        }).toList();
        state = list;
      }
    } catch (_) {}
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

  Future<bool> loginWithCredentials({
    required String email,
    required String password,
    required String role,
    String? schoolId,
    String? schoolName,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final normalizedEmail = email.trim().toLowerCase();

    // 0. Attempt live authentication with central shared database API
    try {
      final remoteResult = await BackendApiService().login(
        email: normalizedEmail,
        password: password,
      );

      if (remoteResult != null) {
        if (remoteResult['success'] == true && remoteResult['user'] != null) {
          final u = remoteResult['user'] as Map<String, dynamic>;
          final serverUser = CurrentUserContext(
            userId: u['id']?.toString() ?? 'usr-${DateTime.now().millisecondsSinceEpoch}',
            schoolId: u['schoolId']?.toString() ?? '22222222-2222-2222-2222-222222222201',
            schoolName: u['schoolName']?.toString() ?? 'Dhaka Premier International School',
            role: u['role']?.toString() ?? role,
            fullName: u['fullName']?.toString() ?? 'Platform User',
            email: u['email']?.toString() ?? normalizedEmail,
            status: u['status']?.toString() ?? 'active',
            studentClass: u['studentClass']?.toString(),
            studentSection: u['studentSection']?.toString(),
            rollNumber: u['rollNumber']?.toString(),
          );
          state = AuthState(isLoggedIn: true, user: serverUser);
          return true;
        } else if (remoteResult['error'] != null) {
          state = state.copyWith(
            isLoading: false,
            errorMessage: remoteResult['error'].toString(),
          );
          return false;
        }
      }
    } catch (_) {
      // Fallback to local accounts directory if server is offline
    }

    // 1. Check Super Admin Credentials
    if (normalizedEmail == 'rabeyaakterlima159@gmail.com' || normalizedEmail == 'sohel229229@gmail.com') {
      final isRabeya = normalizedEmail == 'rabeyaakterlima159@gmail.com';
      final expectedPass = isRabeya ? 'Australia515#' : 'shariar123';
      if (password != expectedPass) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid password for Super Admin account.',
        );
        return false;
      }

      final superAdmin = CurrentUserContext(
        userId: isRabeya ? 'usr-super-admin-01' : 'usr-super-admin-02',
        schoolId: '22222222-2222-2222-2222-222222222201',
        schoolName: 'Platform Global Executive Hub',
        role: 'school_admin',
        fullName: isRabeya ? 'Rabeya Akter Lima' : 'Sohel Shariar',
        email: isRabeya ? 'rabeyaakterlima159@gmail.com' : 'Sohel229229@gmail.com',
        status: 'active',
      );

      state = AuthState(isLoggedIn: true, user: superAdmin);
      return true;
    }

    // 2. Check System Accounts Directory
    final accounts = ref.read(systemAccountsProvider);
    final account = accounts.cast<SystemAccount?>().firstWhere(
          (a) => a?.email.toLowerCase() == normalizedEmail,
          orElse: () => null,
        );

    if (account != null) {
      if (account.password != password) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Incorrect password. Please verify and try again.',
        );
        return false;
      }

      final user = CurrentUserContext(
        userId: account.id,
        schoolId: account.schoolId,
        schoolName: account.schoolName,
        role: account.role,
        fullName: account.fullName,
        email: account.email,
        status: account.status,
        studentClass: account.studentClass,
        studentSection: account.studentSection,
        rollNumber: account.rollNumber,
      );

      state = AuthState(isLoggedIn: true, user: user);
      return true;
    }

    // 3. Check Self-Registered Student Applications
    final applications = ref.read(registrationApplicationsProvider);
    final matchedApp = applications.cast<RegistrationApplication?>().firstWhere(
          (a) => a?.email == normalizedEmail,
          orElse: () => null,
        );

    if (matchedApp != null) {
      if (matchedApp.password.isNotEmpty && matchedApp.password != password) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Incorrect password for registered account.',
        );
        return false;
      }

      final newUser = CurrentUserContext(
        userId: 'usr-${matchedApp.id}',
        schoolId: matchedApp.schoolId,
        schoolName: matchedApp.schoolName,
        role: 'student',
        fullName: matchedApp.fullName,
        email: matchedApp.email,
        status: 'active',
        studentClass: matchedApp.className,
        studentSection: matchedApp.section,
        rollNumber: matchedApp.desiredRoll,
      );

      state = AuthState(isLoggedIn: true, user: newUser);
      return true;
    }

    // 4. Manual Direct Sign-In with any manually entered email and password
    if (normalizedEmail.contains('@') && password.isNotEmpty) {
      final namePart = normalizedEmail.split('@').first;
      final capitalizedName = namePart.isNotEmpty
          ? '${namePart[0].toUpperCase()}${namePart.substring(1)}'
          : 'User';

      final dynamicUser = CurrentUserContext(
        userId: 'usr-${DateTime.now().millisecondsSinceEpoch}',
        schoolId: '22222222-2222-2222-2222-222222222201',
        schoolName: 'Dhaka Premier International School',
        role: role,
        fullName: capitalizedName,
        email: normalizedEmail,
        status: 'active',
        studentClass: 'Class 10',
        studentSection: 'Section A',
        rollNumber: '01',
      );

      state = AuthState(isLoggedIn: true, user: dynamicUser);
      return true;
    }

    // 5. If invalid format
    state = state.copyWith(
      isLoading: false,
      errorMessage: 'Please enter a valid email and password.',
    );
    return false;
  }

  void logout() {
    state = const AuthState(isLoggedIn: false, user: null);
  }
}

final authStateProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref);
});

// Backward-compatible userContextProvider
final userContextProvider = Provider<CurrentUserContext>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.user ??
      CurrentUserContext(
        userId: 'guest',
        schoolId: '22222222-2222-2222-2222-222222222201',
        schoolName: 'Dhaka Premier International School',
        role: 'student',
        fullName: 'Guest User',
        email: 'guest@dpis.edu.bd',
        status: 'active',
      );
});
