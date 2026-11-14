import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/supabase_client.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Login form controllers
  final _loginEmailController = TextEditingController(text: 'student@dpis.edu.bd');
  final _loginPasswordController = TextEditingController(text: 'password123');
  String _selectedRole = 'student';
  String _selectedSchool = 'Dhaka Premier International School';
  bool _obscurePassword = true;

  // Registration form controllers
  final _regFullNameController = TextEditingController();
  final _regEmailController = TextEditingController();
  final _regPhoneController = TextEditingController();
  final _regGuardianNameController = TextEditingController();
  final _regGuardianPhoneController = TextEditingController();
  final _regRollController = TextEditingController();
  final _regPasswordController = TextEditingController();
  String _regClass = 'Class 10';
  String _regSection = 'Section A';
  String _regSchool = 'Dhaka Premier International School';
  bool _regAgreeTerms = true;

  final List<String> _schools = [
    'Dhaka Premier International School',
    'Chittagong Model College',
    'Sylhet Global Academy',
  ];

  final List<String> _classes = [
    'Class 10',
    'Class 9',
    'Class 8',
    'Class 7',
    'Class 6',
  ];

  final List<String> _sections = ['Section A', 'Section B', 'Section C'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _regFullNameController.dispose();
    _regEmailController.dispose();
    _regPhoneController.dispose();
    _regGuardianNameController.dispose();
    _regGuardianPhoneController.dispose();
    _regRollController.dispose();
    _regPasswordController.dispose();
    super.dispose();
  }

  void _onRoleSelected(String role) {
    setState(() {
      _selectedRole = role;
      switch (role) {
        case 'student':
          _loginEmailController.text = 'student@dpis.edu.bd';
          break;
        case 'teacher':
          _loginEmailController.text = 'teacher@dpis.edu.bd';
          break;
        case 'parent':
          _loginEmailController.text = 'parent@dpis.edu.bd';
          break;
        case 'school_admin':
          _loginEmailController.text = 'admin@dpis.edu.bd';
          break;
      }
    });
  }

  Future<void> _handleLogin() async {
    final email = _loginEmailController.text.trim();
    final password = _loginPasswordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter email and password'),
          backgroundColor: EduvantaColors.danger,
        ),
      );
      return;
    }

    final success = await ref.read(authStateProvider.notifier).loginWithCredentials(
          email: email,
          password: password,
          role: _selectedRole,
          schoolName: _selectedSchool,
        );

    if (!mounted) return;

    if (!success) {
      final error = ref.read(authStateProvider).errorMessage ?? 'Invalid login credentials';
      _showPendingOrErrorDialog(error);
    }
  }

  void _showPendingOrErrorDialog(String message) {
    final isPending = message.contains('Pending Approval');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(
              isPending ? Icons.hourglass_top_rounded : Icons.error_outline_rounded,
              color: isPending ? EduvantaColors.goldAccent : EduvantaColors.danger,
              size: 28,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isPending ? 'Admission Pending' : 'Login Notice',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              message,
              style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF334155)),
            ),
            if (isPending) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: EduvantaColors.goldAccent.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: EduvantaColors.goldAccent.withValues(alpha: 0.4)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, size: 18, color: Color(0xFFB45309)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'School Administrator review required before access is unlocked.',
                        style: TextStyle(fontSize: 11, color: Color(0xFF92400E)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }

  void _handleRegistrationSubmit() {
    final fullName = _regFullNameController.text.trim();
    final email = _regEmailController.text.trim();
    final phone = _regPhoneController.text.trim();
    final roll = _regRollController.text.trim();
    final guardianName = _regGuardianNameController.text.trim();
    final guardianPhone = _regGuardianPhoneController.text.trim();
    final password = _regPasswordController.text;

    if (fullName.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill out all required student registration fields'),
          backgroundColor: EduvantaColors.danger,
        ),
      );
      return;
    }

    final applicationId = ref.read(registrationApplicationsProvider.notifier).submitApplication(
          fullName: fullName,
          email: email,
          phone: phone,
          schoolId: '22222222-2222-2222-2222-222222222201',
          schoolName: _regSchool,
          className: _regClass,
          section: _regSection,
          desiredRoll: roll.isNotEmpty ? roll : '10${10 + DateTime.now().second}',
          guardianName: guardianName.isNotEmpty ? guardianName : 'Guardian',
          guardianPhone: guardianPhone.isNotEmpty ? guardianPhone : phone,
          password: password,
        );

    _showRegistrationSuccessDialog(applicationId, fullName, email, _regClass, _regSection);
  }

  void _showRegistrationSuccessDialog(
    String appId,
    String studentName,
    String email,
    String className,
    String section,
  ) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: EduvantaColors.success.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, color: EduvantaColors.success, size: 28),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Registration Submitted!',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Your student admission application has been submitted to your campus administration for approval.',
              style: TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF334155)),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Application ID:', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text(appId, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: EduvantaColors.primaryNavy)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Student:', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text(studentName, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Class & Section:', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('$className - $section', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const Divider(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Approval Status:', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: EduvantaColors.goldAccent.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'PENDING APPROVAL',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              '💡 Tip: The School Admin can approve this application directly from the Dashboard or Admin Hub.',
              style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Color(0xFF64748B)),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: EduvantaColors.royalBlue,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              // Switch back to Login tab and populate email
              _loginEmailController.text = email;
              _onRoleSelected('student');
              _tabController.animateTo(0);
            },
            child: const Text('Back to Login', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    return Scaffold(
      backgroundColor: EduvantaColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Top Branded Hero Banner
              _buildHeaderBanner(),

              // Segmented Tab Selector
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      color: EduvantaColors.primaryNavy,
                      boxShadow: [
                        BoxShadow(
                          color: EduvantaColors.primaryNavy.withValues(alpha: 0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    labelColor: Colors.white,
                    unselectedLabelColor: const Color(0xFF475569),
                    labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    indicatorSize: TabBarIndicatorSize.tab,
                    tabs: const [
                      Tab(text: 'Sign In'),
                      Tab(text: 'Create Account'),
                    ],
                  ),
                ),
              ),

              // Tab Views
              SizedBox(
                height: 640,
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildSignInTab(authState),
                    _buildCreateAccountTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
      decoration: const BoxDecoration(
        color: EduvantaColors.primaryNavy,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 1.5),
                ),
                child: const Icon(
                  Icons.school_rounded,
                  color: EduvantaColors.goldAccent,
                  size: 32,
                ),
              ),
              const SizedBox(width: 14),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'EDUVANTA',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2.0,
                    ),
                  ),
                  Text(
                    'Smart Campus Management Ecosystem',
                    style: TextStyle(
                      color: Color(0xFF94A3B8),
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'One Platform. Every Campus. Smarter Education.',
              style: TextStyle(
                color: Color(0xFFE2E8F0),
                fontSize: 11,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==============================================================================
  // TAB 1: SIGN IN
  // ==============================================================================

  Widget _buildSignInTab(AuthState authState) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        // Role Selector Pills
        const Text(
          'Select Portal Role:',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            _buildRolePill('student', '🎓 Student', EduvantaColors.royalBlue),
            const SizedBox(width: 6),
            _buildRolePill('teacher', '👨‍🏫 Teacher', const Color(0xFF0D9488)),
            const SizedBox(width: 6),
            _buildRolePill('parent', '👨‍👩‍👦 Parent', const Color(0xFF7C3AED)),
            const SizedBox(width: 6),
            _buildRolePill('school_admin', '🛡️ Admin', EduvantaColors.primaryNavy),
          ],
        ),
        const SizedBox(height: 16),

        // School Selector Dropdown
        const Text(
          'Campus / School:',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFCBD5E1)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              isExpanded: true,
              value: _selectedSchool,
              icon: const Icon(Icons.arrow_drop_down, color: EduvantaColors.royalBlue),
              items: _schools.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)))).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedSchool = val);
              },
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Email / Roll No Input
        const Text(
          'Email or Admission ID:',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _loginEmailController,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            hintText: 'e.g. student@dpis.edu.bd',
            prefixIcon: const Icon(Icons.alternate_email, size: 20, color: Color(0xFF64748B)),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
          ),
        ),
        const SizedBox(height: 14),

        // Password Input
        const Text(
          'Password:',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _loginPasswordController,
          obscureText: _obscurePassword,
          decoration: InputDecoration(
            hintText: 'Enter account password',
            prefixIcon: const Icon(Icons.lock_outline, size: 20, color: Color(0xFF64748B)),
            suffixIcon: IconButton(
              icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, size: 20, color: const Color(0xFF64748B)),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
          ),
        ),
        const SizedBox(height: 20),

        // Sign In Button
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: EduvantaColors.primaryNavy,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 2,
          ),
          onPressed: authState.isLoading ? null : _handleLogin,
          child: authState.isLoading
              ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : Text(
                  'Sign In as ${_selectedRole.replaceAll('_', ' ').toUpperCase()}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
        ),
        const SizedBox(height: 20),

        // 1-Tap Quick Demo Credentials Card (For testing)
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.flash_on, size: 16, color: EduvantaColors.goldAccent),
                  SizedBox(width: 6),
                  Text(
                    'Quick 1-Tap Test Accounts (Instant Access)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: EduvantaColors.primaryNavy),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _buildQuickLoginButton('student', '🎓 Student', EduvantaColors.royalBlue),
                  _buildQuickLoginButton('teacher', '👨‍🏫 Teacher', const Color(0xFF0D9488)),
                  _buildQuickLoginButton('parent', '👨‍👩‍👦 Parent', const Color(0xFF7C3AED)),
                  _buildQuickLoginButton('school_admin', '🛡️ Admin', EduvantaColors.primaryNavy),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildRolePill(String role, String label, Color color) {
    final isSelected = _selectedRole == role;
    return Expanded(
      child: InkWell(
        onTap: () => _onRoleSelected(role),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? color : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? color : const Color(0xFFCBD5E1)),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : const Color(0xFF475569),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickLoginButton(String role, String label, Color color) {
    return InkWell(
      onTap: () => ref.read(authStateProvider.notifier).loginDemo(role),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(width: 4),
            Icon(Icons.arrow_forward_rounded, size: 12, color: color),
          ],
        ),
      ),
    );
  }

  // ==============================================================================
  // TAB 2: CREATE ACCOUNT / STUDENT ADMISSION
  // ==============================================================================

  Widget _buildCreateAccountTab() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: EduvantaColors.royalBlue.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: EduvantaColors.royalBlue.withValues(alpha: 0.2)),
          ),
          child: const Row(
            children: [
              Icon(Icons.info_outline, size: 20, color: EduvantaColors.royalBlue),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Student Self-Registration: Submit your admission details. Once approved by the school admin, you will receive full portal access.',
                  style: TextStyle(fontSize: 11, color: Color(0xFF1E3A8A), height: 1.3),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Full Name
        const Text('Student Full Name *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
        const SizedBox(height: 4),
        TextField(
          controller: _regFullNameController,
          decoration: InputDecoration(
            hintText: 'e.g. Sumon Das',
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
          ),
        ),
        const SizedBox(height: 10),

        // Email & Phone Row
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Email Address *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  TextField(
                    controller: _regEmailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      hintText: 'sumon@gmail.com',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Phone Number *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  TextField(
                    controller: _regPhoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      hintText: '017xxxxxxxx',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // School Selector
        const Text('Target Campus *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFFCBD5E1)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              isExpanded: true,
              value: _regSchool,
              items: _schools.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 11)))).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _regSchool = val);
              },
            ),
          ),
        ),
        const SizedBox(height: 10),

        // Class, Section & Roll
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Class *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _regClass,
                        items: _classes.map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 11)))).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _regClass = val);
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Section *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _regSection,
                        items: _sections.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 11)))).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _regSection = val);
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Desired Roll', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  TextField(
                    controller: _regRollController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: 'e.g. 1045',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Guardian Details
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Guardian Name', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  TextField(
                    controller: _regGuardianNameController,
                    decoration: InputDecoration(
                      hintText: 'Father/Mother Name',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Guardian Phone', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  const SizedBox(height: 4),
                  TextField(
                    controller: _regGuardianPhoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      hintText: '018xxxxxxxx',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Password
        const Text('Create Account Password *', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
        const SizedBox(height: 4),
        TextField(
          controller: _regPasswordController,
          obscureText: true,
          decoration: InputDecoration(
            hintText: 'Minimum 6 characters',
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
          ),
        ),
        const SizedBox(height: 12),

        // Agreement Checkbox
        Row(
          children: [
            Checkbox(
              value: _regAgreeTerms,
              activeColor: EduvantaColors.primaryNavy,
              onChanged: (v) => setState(() => _regAgreeTerms = v ?? true),
            ),
            const Expanded(
              child: Text(
                'I confirm that all admission details are accurate and submit for administration verification.',
                style: TextStyle(fontSize: 10, color: Color(0xFF64748B)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Submit Button
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: EduvantaColors.royalBlue,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 2,
          ),
          onPressed: _regAgreeTerms ? _handleRegistrationSubmit : null,
          child: const Text(
            'Submit Admission Request',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
