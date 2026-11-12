import 'package:flutter/material.dart';
import 'sdui_models.dart';

Color parseHexColor(String hexString, {Color fallback = const Color(0xFF102A56)}) {
  try {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  } catch (_) {
    return fallback;
  }
}

class SDUIRenderer extends StatelessWidget {
  final SDUIWidgetConfig config;
  final SDUIThemeConfig theme;
  final VoidCallback? onPaymentRequested;

  const SDUIRenderer({
    super.key,
    required this.config,
    required this.theme,
    this.onPaymentRequested,
  });

  @override
  Widget build(BuildContext context) {
    if (!config.visible) return const SizedBox.shrink();

    switch (config.type) {
      case 'HeroBanner':
        return _buildHeroBanner(context);
      case 'QuickStats':
        return _buildQuickStats(context);
      case 'ActionGrid':
        return _buildActionGrid(context);
      case 'AnnouncementFeed':
        return _buildAnnouncementFeed(context);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildHeroBanner(BuildContext context) {
    final primary = parseHexColor(theme.primaryColor, fallback: const Color(0xFF102A56));
    final secondary = parseHexColor(theme.secondaryColor, fallback: const Color(0xFF2563EB));
    final accent = parseHexColor(theme.accentColor, fallback: const Color(0xFFF5B82E));
    final tagline = config.props['tagline'] as String? ?? 'Learn • Grow • Excel';
    final ctaLabel = config.props['ctaLabel'] as String? ?? 'Explore More';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [primary, secondary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: primary.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'Academic Session 2026-2027',
              style: TextStyle(
                color: accent,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            config.title ?? 'Welcome to Eduvanta',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            tagline,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.9),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Exploring Campus Academic Modules')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: accent,
              foregroundColor: const Color(0xFF102A56),
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: Text(
              ctaLabel,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStats(BuildContext context) {
    final attendance = config.props['attendance'] as String? ?? '95%';
    final assignments = config.props['assignments'] as String? ?? '12 Due';
    final results = config.props['results'] as String? ?? '88% GPA 5.0';
    final feesDue = config.props['feesDue'] as String? ?? '৳12,500';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _buildStatCard('Attendance', attendance, Icons.calendar_today, Colors.blue),
              const SizedBox(width: 10),
              _buildStatCard('Assignments', assignments, Icons.assignment, Colors.purple),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildStatCard('Results', results, Icons.emoji_events, Colors.green),
              const SizedBox(width: 10),
              _buildStatCard(
                'Tuition Fee',
                feesDue,
                Icons.credit_card,
                Colors.orange,
                onTap: onPaymentRequested,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String label,
    String value,
    IconData icon,
    Color color, {
    VoidCallback? onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 4,
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
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Icon(icon, size: 16, color: color),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF17243A),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionGrid(BuildContext context) {
    final items = [
      {'label': 'My Classes', 'icon': Icons.menu_book, 'color': const Color(0xFF2563EB)},
      {'label': 'Attendance', 'icon': Icons.calendar_month, 'color': const Color(0xFFF59E0B)},
      {'label': 'Results', 'icon': Icons.workspace_premium, 'color': const Color(0xFF3B82F6)},
      {'label': 'Assignments', 'icon': Icons.description, 'color': const Color(0xFFEC4899)},
      {'label': 'Library', 'icon': Icons.local_library, 'color': const Color(0xFF8B5CF6)},
      {'label': 'Fee Status', 'icon': Icons.payment, 'color': const Color(0xFF10B981)},
      {'label': 'Notices', 'icon': Icons.notifications_active, 'color': const Color(0xFFEF4444)},
      {'label': 'More', 'icon': Icons.grid_view, 'color': const Color(0xFF64748B)},
    ];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            config.title ?? 'Quick Actions',
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: Color(0xFF17243A),
            ),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              childAspectRatio: 0.85,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final it = items[index];
              return InkWell(
                onTap: () {
                  if (it['label'] == 'Fee Status' && onPaymentRequested != null) {
                    onPaymentRequested!();
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Opening ${it['label']} module')),
                    );
                  }
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: (it['color'] as Color).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          it['icon'] as IconData,
                          color: it['color'] as Color,
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        it['label'] as String,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF17243A),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAnnouncementFeed(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                config.title ?? 'Upcoming Events & Notices',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF17243A),
                ),
              ),
              Text(
                'See All',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: parseHexColor(theme.secondaryColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _buildNoticeCard('Annual Sports Day 2026', 'Nov 20, 2026', Icons.sports_tennis),
          const SizedBox(height: 8),
          _buildNoticeCard('Mid-Term Examination Schedule', 'Nov 18, 2026', Icons.fact_check),
        ],
      ),
    );
  }

  Widget _buildNoticeCard(String title, String date, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFF2563EB), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF17243A),
                  ),
                ),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Color(0xFF94A3B8), size: 20),
        ],
      ),
    );
  }
}
