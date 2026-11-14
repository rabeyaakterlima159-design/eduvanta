import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/supabase_client.dart';
import '../sdui/sdui_models.dart';
import '../sdui/sdui_renderer.dart';

class StudentDashboardScreen extends ConsumerStatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  ConsumerState<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends ConsumerState<StudentDashboardScreen> {
  int _currentBottomNavIndex = 0;
  bool _feePaid = false;

  late SDUIHomeScreenLayout _layout;

  @override
  void initState() {
    super.initState();
    _layout = SDUIHomeScreenLayout.fallback();
  }

  void _showPaymentBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _PaymentBottomSheet(
        onSuccess: () {
          setState(() {
            _feePaid = true;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final userContext = ref.watch(userContextProvider);
    final primaryColor = parseHexColor(_layout.theme.primaryColor);

    return Scaffold(
      backgroundColor: EduvantaColors.background,
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              child: const Text(
                'TA',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Hello, Student 👋',
                  style: TextStyle(fontSize: 11, color: Colors.white70),
                ),
                Text(
                  userContext.fullName,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No unread push notifications')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign Out',
            onPressed: () {
              ref.read(authStateProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: _buildCurrentTabBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentBottomNavIndex,
        onTap: (index) {
          setState(() {
            _currentBottomNavIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: EduvantaColors.royalBlue,
        unselectedItemColor: const Color(0xFF94A3B8),
        selectedFontSize: 11,
        unselectedFontSize: 11,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Timetable'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notices'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildCurrentTabBody() {
    switch (_currentBottomNavIndex) {
      case 0:
        return _buildHomeTab();
      case 1:
        return _buildTimetableTab();
      case 2:
        return _buildNoticesTab();
      case 3:
        return _buildProfileTab();
      default:
        return _buildHomeTab();
    }
  }

  Widget _buildHomeTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final widget in _layout.widgets)
            SDUIRenderer(
              config: widget,
              theme: _layout.theme,
              onPaymentRequested: _feePaid ? null : _showPaymentBottomSheet,
            ),
        ],
      ),
    );
  }

  Widget _buildTimetableTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Class 10 - Section A (Science)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const Text(
                'Full Week Academic Timetable',
                style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
              ),
              const Divider(height: 24),
              _buildTimetablePeriod('Period 1 (08:30 - 09:20)', 'Higher Mathematics', 'Prof. Nasreen Sultana', 'Room 301'),
              _buildTimetablePeriod('Period 2 (09:25 - 10:15)', 'Physics', 'Dr. Rafiqul Hassan', 'Lab 2'),
              _buildTimetablePeriod('Period 3 (10:20 - 11:10)', 'Chemistry', 'Dr. Kamal Hossain', 'Lab 1'),
              _buildTimetablePeriod('Period 4 (11:15 - 12:00)', 'English Literature', 'Ms. Sharmin Akter', 'Room 301'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTimetablePeriod(String time, String subject, String teacher, String room) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              time,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text('$teacher • $room', style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoticesTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildNoticeFullCard(
          'Annual Sports Day 2026',
          'Track and field events scheduled for next Friday at the main campus ground. Participation forms due this Wednesday.',
          'Nov 20, 2026',
        ),
        const SizedBox(height: 12),
        _buildNoticeFullCard(
          'Mid-Term Examination Schedule',
          'Admit cards will be available in the portal after tuition fee clearance. Examination commences December 1st.',
          'Nov 18, 2026',
        ),
      ],
    );
  }

  Widget _buildNoticeFullCard(String title, String body, String date) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              Text(date, style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
            ],
          ),
          const SizedBox(height: 8),
          Text(body, style: const TextStyle(color: Color(0xFF17243A), fontSize: 12, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildProfileTab() {
    final userContext = ref.watch(userContextProvider);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            children: [
              const CircleAvatar(
                radius: 36,
                backgroundColor: EduvantaColors.primaryNavy,
                child: Text('TA', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 12),
              Text(userContext.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              Text(userContext.schoolName, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
              const Divider(height: 32),
              _buildProfileRow('Student ID / Roll', userContext.rollNumber ?? '1001'),
              _buildProfileRow('Class & Section', '${userContext.studentClass ?? "Class 10"} - ${userContext.studentSection ?? "Section A"}'),
              _buildProfileRow('Email', userContext.email),
              _buildProfileRow('Blood Group', 'O+ (Positive)'),
              const Divider(height: 24),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: EduvantaColors.danger,
                    side: const BorderSide(color: EduvantaColors.danger),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => ref.read(authStateProvider.notifier).logout(),
                  icon: const Icon(Icons.logout, size: 16),
                  label: const Text('Sign Out of Account'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildProfileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }
}

class _PaymentBottomSheet extends StatefulWidget {
  final VoidCallback onSuccess;
  const _PaymentBottomSheet({required this.onSuccess});

  @override
  State<_PaymentBottomSheet> createState() => _PaymentBottomSheetState();
}

class _PaymentBottomSheetState extends State<_PaymentBottomSheet> {
  String _selectedGateway = 'bkash';
  bool _processing = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Tuition Fee Payment',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F8FC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total Due (November):', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                Text('৳12,500', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF102A56))),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Select Bangladesh Payment Gateway', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildGatewayChoice('bkash', 'bKash', const Color(0xFFE2136E)),
              const SizedBox(width: 8),
              _buildGatewayChoice('nagad', 'Nagad', const Color(0xFFF7941D)),
              const SizedBox(width: 8),
              _buildGatewayChoice('sslcommerz', 'Cards / Net', const Color(0xFF0070BA)),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _processing
                  ? null
                  : () {
                      setState(() => _processing = true);
                      Future.delayed(const Duration(milliseconds: 1000), () {
                        if (!mounted) return;
                        widget.onSuccess();
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            backgroundColor: Color(0xFF16A34A),
                            content: Text('Payment verified via bKash! Digital receipt issued.'),
                          ),
                        );
                      });
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF102A56),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(
                _processing ? 'Verifying with $_selectedGateway...' : 'Authorize ৳12,500 Checkout',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  Widget _buildGatewayChoice(String id, String label, Color color) {
    final isSelected = _selectedGateway == id;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedGateway = id),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? color.withValues(alpha: 0.08) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? color : const Color(0xFFE2E8F0), width: isSelected ? 2 : 1),
          ),
          child: Column(
            children: [
              Text(
                label,
                style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 13),
              ),
              const SizedBox(height: 2),
              Text(
                id == 'bkash' ? 'Tokenized' : id == 'nagad' ? 'DFS API' : 'Gateway',
                style: const TextStyle(fontSize: 9, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
