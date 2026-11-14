import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/supabase_client.dart';

class ParentDashboardScreen extends ConsumerStatefulWidget {
  const ParentDashboardScreen({super.key});

  @override
  ConsumerState<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends ConsumerState<ParentDashboardScreen> {
  int _selectedChildIndex = 0;

  final List<Map<String, dynamic>> _children = [
    {
      'name': 'Tanvir Ahmed',
      'initials': 'TA',
      'class': 'Class 10 - Section A',
      'roll': '1001',
      'status': 'Present Today',
      'attendance': '95% (114/120)',
      'gpa': 'GPA 5.0 (A+ Outstanding)',
      'feeDue': '৳12,500',
    },
    {
      'name': 'Sadia Ahmed',
      'initials': 'SA',
      'class': 'Class 7 - Section B',
      'roll': '7015',
      'status': 'Present Today',
      'attendance': '98% (118/120)',
      'gpa': 'GPA 4.90 (A+ Excellent)',
      'feeDue': '৳0 (Fully Paid)',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final userContext = ref.watch(userContextProvider);
    final child = _children[_selectedChildIndex];

    return Scaffold(
      backgroundColor: EduvantaColors.background,
      appBar: AppBar(
        backgroundColor: const Color(0xFF7C3AED),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Parent Portal', style: TextStyle(fontSize: 11, color: Colors.white70)),
            Text(userContext.fullName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign Out',
            onPressed: () {
              ref.read(authStateProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Child Selector Tabs
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Switch Active Child:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF475569)),
                ),
                const SizedBox(height: 10),
                Row(
                  children: List.generate(_children.length, (index) {
                    final isSelected = _selectedChildIndex == index;
                    final c = _children[index];
                    return Expanded(
                      child: Container(
                        margin: EdgeInsets.only(right: index < _children.length - 1 ? 8 : 0),
                        child: InkWell(
                          onTap: () => setState(() => _selectedChildIndex = index),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFF7C3AED).withValues(alpha: 0.1) : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected ? const Color(0xFF7C3AED) : const Color(0xFFCBD5E1),
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 14,
                                  backgroundColor: isSelected ? const Color(0xFF7C3AED) : const Color(0xFF94A3B8),
                                  child: Text(
                                    c['initials'] as String,
                                    style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        c['name'] as String,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: isSelected ? const Color(0xFF7C3AED) : const Color(0xFF1E293B),
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        (c['class'] as String).split(' - ').first,
                                        style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Selected Child Detail Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFF7C3AED),
                    child: Text(
                      child['initials'] as String,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ),
                  title: Text(child['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  subtitle: Text('${child['class']} • Roll: ${child['roll']}'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF16A34A).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      child['status'] as String,
                      style: const TextStyle(color: Color(0xFF16A34A), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Attendance Rate:', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    Text(child['attendance'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF16A34A))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Latest Examination:', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    Text(child['gpa'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2563EB))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Outstanding Tuition Fee:', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                    Text(
                      child['feeDue'] as String,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: (child['feeDue'] as String).contains('৳0') ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Quick Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF7C3AED),
                          side: const BorderSide(color: Color(0xFF7C3AED)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Chat opened with ${child['name']}\'s Class Teacher')),
                          );
                        },
                        icon: const Icon(Icons.chat_bubble_outline, size: 16),
                        label: const Text('Contact Teacher', style: TextStyle(fontSize: 11)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF7C3AED),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              backgroundColor: const Color(0xFF16A34A),
                              content: Text('Receipt downloaded for ${child['name']}'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.receipt_long, size: 16),
                        label: const Text('Fee Receipts', style: TextStyle(fontSize: 11)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // School Notices for Parent
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.campaign, size: 20, color: Color(0xFF7C3AED)),
                    SizedBox(width: 8),
                    Text(
                      'Campus Parent Circulars',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                Text('• Annual Sports Day: Scheduled for Nov 20, 2026. Parents welcome.', style: TextStyle(fontSize: 12, color: Color(0xFF475569))),
                SizedBox(height: 6),
                Text('• Mid-Term Result Publication: Report cards will be issued online on Nov 25.', style: TextStyle(fontSize: 12, color: Color(0xFF475569))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
