import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/supabase_client.dart';

class ParentDashboardScreen extends ConsumerWidget {
  const ParentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userContext = ref.watch(userContextProvider);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Parent Portal', style: TextStyle(fontSize: 11, color: Colors.white70)),
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
                const Text(
                  'Linked Children',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const CircleAvatar(
                    backgroundColor: EduvantaColors.primaryNavy,
                    child: Text('TA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                  title: const Text('Tanvir Ahmed', style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: const Text('Class 10 - Section A • Roll: 1001'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF16A34A).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Present Today',
                      style: TextStyle(color: Color(0xFF16A34A), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const Divider(height: 24),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Attendance Rate:', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    Text('95% (114/120)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF16A34A))),
                  ],
                ),
                const SizedBox(height: 6),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Latest Examination:', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    Text('GPA 5.0 (A+ Outstanding)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2563EB))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
