class SDUIWidgetConfig {
  final String id;
  final String type;
  final String? title;
  final bool visible;
  final int order;
  final Map<String, dynamic> props;

  SDUIWidgetConfig({
    required this.id,
    required this.type,
    this.title,
    required this.visible,
    required this.order,
    required this.props,
  });

  factory SDUIWidgetConfig.fromJson(Map<String, dynamic> json) {
    return SDUIWidgetConfig(
      id: json['id'] as String? ?? '',
      type: json['type'] as String? ?? '',
      title: json['title'] as String?,
      visible: json['visible'] as bool? ?? true,
      order: json['order'] as int? ?? 1,
      props: json['props'] as Map<String, dynamic>? ?? {},
    );
  }
}

class SDUIThemeConfig {
  final String primaryColor;
  final String secondaryColor;
  final String accentColor;
  final String backgroundColor;
  final String appBarTitle;
  final String? logoUrl;

  SDUIThemeConfig({
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentColor,
    required this.backgroundColor,
    required this.appBarTitle,
    this.logoUrl,
  });

  factory SDUIThemeConfig.fromJson(Map<String, dynamic> json) {
    return SDUIThemeConfig(
      primaryColor: json['primaryColor'] as String? ?? '#102A56',
      secondaryColor: json['secondaryColor'] as String? ?? '#2563EB',
      accentColor: json['accentColor'] as String? ?? '#F5B82E',
      backgroundColor: json['backgroundColor'] as String? ?? '#F5F8FC',
      appBarTitle: json['appBarTitle'] as String? ?? 'EDUVANTA',
      logoUrl: json['logoUrl'] as String?,
    );
  }
}

class SDUIHomeScreenLayout {
  final int version;
  final bool maintenanceMode;
  final String? maintenanceMessage;
  final String minSupportedAppVersion;
  final SDUIThemeConfig theme;
  final List<SDUIWidgetConfig> widgets;

  SDUIHomeScreenLayout({
    required this.version,
    required this.maintenanceMode,
    this.maintenanceMessage,
    required this.minSupportedAppVersion,
    required this.theme,
    required this.widgets,
  });

  factory SDUIHomeScreenLayout.fallback() {
    return SDUIHomeScreenLayout(
      version: 1,
      maintenanceMode: false,
      minSupportedAppVersion: '1.0.0',
      theme: SDUIThemeConfig(
        primaryColor: '#102A56',
        secondaryColor: '#2563EB',
        accentColor: '#F5B82E',
        backgroundColor: '#F5F8FC',
        appBarTitle: 'EDUVANTA',
      ),
      widgets: [
        SDUIWidgetConfig(
          id: 'hero_banner',
          type: 'HeroBanner',
          title: 'Welcome to Eduvanta',
          visible: true,
          order: 1,
          props: {
            'tagline': 'Learn • Grow • Excel',
            'ctaLabel': 'Explore More',
          },
        ),
        SDUIWidgetConfig(
          id: 'quick_stats',
          type: 'QuickStats',
          title: 'Overview',
          visible: true,
          order: 2,
          props: {
            'attendance': '95%',
            'assignments': '12 Due',
            'results': '88% GPA 5.0',
            'feesDue': '৳12,500',
          },
        ),
        SDUIWidgetConfig(
          id: 'action_grid',
          type: 'ActionGrid',
          title: 'Quick Actions',
          visible: true,
          order: 3,
          props: {'columns': 4},
        ),
        SDUIWidgetConfig(
          id: 'upcoming_events',
          type: 'AnnouncementFeed',
          title: 'Upcoming Events',
          visible: true,
          order: 4,
          props: {
            'notices': [
              {'title': 'Annual Sports Day 2026', 'date': 'Nov 20, 2026'},
              {'title': 'Mid-Term Exam Schedule', 'date': 'Nov 18, 2026'},
            ],
          },
        ),
      ],
    );
  }
}
