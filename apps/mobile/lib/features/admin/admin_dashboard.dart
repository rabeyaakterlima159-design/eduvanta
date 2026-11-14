import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/supabase_client.dart';

class SchoolAdminDashboardScreen extends ConsumerStatefulWidget {
  const SchoolAdminDashboardScreen({super.key});

  @override
  ConsumerState<SchoolAdminDashboardScreen> createState() => _SchoolAdminDashboardScreenState();
}

class _SchoolAdminDashboardScreenState extends ConsumerState<SchoolAdminDashboardScreen> {
  String _filterStatus = 'all'; // 'all', 'pending', 'approved', 'rejected'

  @override
  Widget build(BuildContext context) {
    final userContext = ref.watch(userContextProvider);
    final allApplications = ref.watch(registrationApplicationsProvider);

    final pendingCount = allApplications.where((a) => a.status == 'pending').length;
    final approvedCount = allApplications.where((a) => a.status == 'approved').length;

    final filteredApplications = allApplications.where((a) {
      if (_filterStatus == 'pending') return a.status == 'pending';
      if (_filterStatus == 'approved') return a.status == 'approved';
      if (_filterStatus == 'rejected') return a.status == 'rejected';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: EduvantaColors.background,
      appBar: AppBar(
        backgroundColor: EduvantaColors.primaryNavy,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'School Admin Portal',
              style: TextStyle(fontSize: 11, color: Colors.white70),
            ),
            Text(
              userContext.fullName,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
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
          // Campus Overview Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [EduvantaColors.primaryNavy, Color(0xFF1E3A8A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: EduvantaColors.primaryNavy.withValues(alpha: 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      userContext.schoolName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: EduvantaColors.goldAccent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'MAIN CAMPUS',
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: EduvantaColors.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildMetricItem('Students', '420', Icons.people_outline),
                    _buildMetricItem('Faculty', '32', Icons.badge_outlined),
                    _buildMetricItem('Pending', '$pendingCount', Icons.pending_actions_outlined, highlight: pendingCount > 0),
                    _buildMetricItem('Attendance', '94.8%', Icons.check_circle_outline),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Student Admissions Management Card Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.how_to_reg, size: 20, color: EduvantaColors.primaryNavy),
                  SizedBox(width: 8),
                  Text(
                    'Student Registration Approvals',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: EduvantaColors.primaryNavy),
                  ),
                ],
              ),
              if (pendingCount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: EduvantaColors.goldAccent.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: EduvantaColors.goldAccent),
                  ),
                  child: Text(
                    '$pendingCount NEW',
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),

          // Filter Pills
          Row(
            children: [
              _buildFilterChip('all', 'All (${allApplications.length})'),
              const SizedBox(width: 6),
              _buildFilterChip('pending', 'Pending ($pendingCount)'),
              const SizedBox(width: 6),
              _buildFilterChip('approved', 'Approved ($approvedCount)'),
            ],
          ),
          const SizedBox(height: 12),

          // Applications List
          if (filteredApplications.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Center(
                child: Text(
                  'No student registrations matching this filter.',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                ),
              ),
            )
          else
            ...filteredApplications.map((app) => _buildApplicationCard(app)),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildMetricItem(String label, String value, IconData icon, {bool highlight = false}) {
    return Column(
      children: [
        Icon(icon, size: 18, color: highlight ? EduvantaColors.goldAccent : Colors.white70),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: highlight ? EduvantaColors.goldAccent : Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
        ),
      ],
    );
  }

  Widget _buildFilterChip(String status, String label) {
    final isSelected = _filterStatus == status;
    return InkWell(
      onTap: () => setState(() => _filterStatus = status),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? EduvantaColors.primaryNavy : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? EduvantaColors.primaryNavy : const Color(0xFFCBD5E1)),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildApplicationCard(RegistrationApplication app) {
    final isPending = app.status == 'pending';
    final isApproved = app.status == 'approved';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPending ? EduvantaColors.goldAccent.withValues(alpha: 0.5) : const Color(0xFFE2E8F0),
          width: isPending ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: EduvantaColors.royalBlue.withValues(alpha: 0.1),
                    child: Text(
                      app.fullName.substring(0, 2).toUpperCase(),
                      style: const TextStyle(
                        color: EduvantaColors.royalBlue,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        app.fullName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        '${app.className} - ${app.section} • Roll: ${app.desiredRoll}',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ],
              ),
              _buildStatusBadge(app.status),
            ],
          ),
          const Divider(height: 18),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Email: ${app.email}', style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                  const SizedBox(height: 2),
                  Text('Phone: ${app.phone}', style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('Guardian: ${app.guardianName}', style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                  const SizedBox(height: 2),
                  Text('Tel: ${app.guardianPhone}', style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                ],
              ),
            ],
          ),
          if (isPending) ...[
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: EduvantaColors.danger,
                      side: const BorderSide(color: EduvantaColors.danger),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      ref.read(registrationApplicationsProvider.notifier).rejectApplication(app.id, 'Information verification incomplete');
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Application for ${app.fullName} rejected')),
                      );
                    },
                    icon: const Icon(Icons.close, size: 16),
                    label: const Text('Reject', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EduvantaColors.success,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                    onPressed: () {
                      ref.read(registrationApplicationsProvider.notifier).approveApplication(app.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: EduvantaColors.success,
                          content: Text('🟢 ${app.fullName} approved and enrolled into ${app.className}! Student can now sign in.'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.check, size: 16),
                    label: const Text('Approve & Enroll', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ] else if (isApproved) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: EduvantaColors.success.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  Icon(Icons.verified, size: 14, color: EduvantaColors.success),
                  SizedBox(width: 6),
                  Text(
                    'Enrolled Student • Account active for mobile login',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EduvantaColors.success),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bg;
    Color text;
    String label;

    switch (status) {
      case 'approved':
        bg = EduvantaColors.success.withValues(alpha: 0.15);
        text = EduvantaColors.success;
        label = 'APPROVED';
        break;
      case 'rejected':
        bg = EduvantaColors.danger.withValues(alpha: 0.15);
        text = EduvantaColors.danger;
        label = 'REJECTED';
        break;
      case 'pending':
      default:
        bg = EduvantaColors.goldAccent.withValues(alpha: 0.2);
        text = const Color(0xFFB45309);
        label = 'PENDING APPROVAL';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: text),
      ),
    );
  }
}
