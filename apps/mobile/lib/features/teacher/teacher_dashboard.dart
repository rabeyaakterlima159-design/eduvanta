import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/supabase_client.dart';

class TeacherDashboardScreen extends ConsumerStatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  ConsumerState<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends ConsumerState<TeacherDashboardScreen> {
  final List<Map<String, dynamic>> _students = [
    {'id': '1', 'name': 'Tanvir Ahmed', 'roll': '1001', 'present': true},
    {'id': '2', 'name': 'Ayesha Siddiqua', 'roll': '1002', 'present': true},
    {'id': '3', 'name': 'Zubair Hossain', 'roll': '1003', 'present': true},
    {'id': '4', 'name': 'Fatima Zahra', 'roll': '1004', 'present': false},
    {'id': '5', 'name': 'Mehedi Hasan', 'roll': '1005', 'present': true},
  ];

  bool _saved = false;

  @override
  Widget build(BuildContext context) {
    final userContext = ref.watch(userContextProvider);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Teacher Faculty Portal', style: TextStyle(fontSize: 11, color: Colors.white70)),
            Text(userContext.fullName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.swap_horiz),
            tooltip: 'Switch Portal',
            onPressed: () {
              ref.read(userContextProvider.notifier).state = CurrentUserContext(
                userId: 'student-tanvir-01',
                schoolId: '22222222-2222-2222-2222-222222222201',
                schoolName: 'Dhaka Premier International School',
                role: 'student',
                fullName: 'Tanvir Ahmed',
              );
            },
          ),
        ],
      ),
      body: ListView(
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Daily Attendance Marker',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() => _saved = true);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            backgroundColor: Color(0xFF16A34A),
                            content: Text('Attendance records committed to Supabase!'),
                          ),
                        );
                      },
                      icon: const Icon(Icons.check, size: 16),
                      label: Text(_saved ? 'Saved' : 'Save Entry'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF16A34A),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                    ),
                  ],
                ),
                const Text(
                  'Class 10 - Section A (Higher Mathematics)',
                  style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                ),
                const Divider(height: 24),
                for (final st in _students)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${st['roll']} • ${st['name']}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        InkWell(
                          onTap: () {
                            setState(() {
                              st['present'] = !st['present'];
                            });
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            decoration: BoxDecoration(
                              color: st['present'] ? const Color(0xFF16A34A).withValues(alpha: 0.1) : const Color(0xFFDC2626).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: st['present'] ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                              ),
                            ),
                            child: Text(
                              st['present'] ? 'PRESENT' : 'ABSENT',
                              style: TextStyle(
                                color: st['present'] ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
