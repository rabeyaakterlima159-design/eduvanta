import 'dart:io' show Platform;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class BackendApiService {
  static final BackendApiService _instance = BackendApiService._internal();
  factory BackendApiService() => _instance;

  late final Dio _dio;
  late final List<String> _baseUrls;

  BackendApiService._internal() {
    _dio = Dio(
      BaseOptions(
        connectTimeout: const Duration(milliseconds: 3500),
        receiveTimeout: const Duration(milliseconds: 3500),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    if (kIsWeb) {
      _baseUrls = ['http://localhost:3000', 'http://localhost:3001'];
    } else if (Platform.isAndroid) {
      _baseUrls = [
        'http://10.0.2.2:3000',
        'http://192.168.50.81:3000',
        'http://127.0.0.1:3000',
        'http://10.0.2.2:3001',
        'http://192.168.50.81:3001',
        'http://127.0.0.1:3001',
      ];
    } else {
      _baseUrls = ['http://localhost:3000', 'http://localhost:3001'];
    }
  }

  Future<Response?> _tryPost(String path, Map<String, dynamic> data) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      return null;
    }
    for (final base in _baseUrls) {
      try {
        final res = await _dio.post('$base$path', data: data);
        print('BackendApiService: POST $base$path succeeded with ${res.statusCode}');
        return res;
      } catch (e) {
        print('BackendApiService: POST $base$path failed: $e');
      }
    }
    return null;
  }

  Future<Response?> _tryPatch(String path, Map<String, dynamic> data) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      return null;
    }
    for (final base in _baseUrls) {
      try {
        final res = await _dio.patch('$base$path', data: data);
        print('BackendApiService: PATCH $base$path succeeded with ${res.statusCode}');
        return res;
      } catch (e) {
        print('BackendApiService: PATCH $base$path failed: $e');
      }
    }
    return null;
  }

  Future<Response?> _tryGet(String path) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      return null;
    }
    for (final base in _baseUrls) {
      try {
        final res = await _dio.get('$base$path');
        return res;
      } catch (e) {
        // try next
      }
    }
    return null;
  }

  /// Authenticate against the shared website database
  Future<Map<String, dynamic>?> login({
    required String email,
    required String password,
  }) async {
    final response = await _tryPost('/api/auth/login', {
      'email': email,
      'password': password,
    });

    if (response != null && response.data is Map<String, dynamic>) {
      return response.data as Map<String, dynamic>;
    }
    return null;
  }

  /// Submit student admission application to the shared website database
  Future<bool> submitAdmissionApplication(Map<String, dynamic> appData) async {
    final response = await _tryPost('/api/admissions', appData);
    if (response != null && (response.statusCode == 200 || response.statusCode == 201)) {
      return true;
    }
    return false;
  }

  /// Update admission status (approve/reject) in shared database
  Future<bool> updateAdmissionStatus(String id, String action, [String? notes]) async {
    final response = await _tryPatch('/api/admissions', {
      'id': id,
      'action': action,
      'reviewNotes': notes,
    });
    return response != null && response.statusCode == 200;
  }

  /// Fetch all admissions from shared database
  Future<List<Map<String, dynamic>>?> fetchAdmissions() async {
    final response = await _tryGet('/api/admissions');
    if (response != null && response.data is Map<String, dynamic>) {
      final list = response.data['applications'] as List?;
      if (list != null) {
        return list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
      }
    }
    return null;
  }

  /// Fetch all users from shared database
  Future<List<Map<String, dynamic>>?> fetchUsers() async {
    final response = await _tryGet('/api/users');
    if (response != null && response.data is Map<String, dynamic>) {
      final list = response.data['users'] as List?;
      if (list != null) {
        return list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
      }
    }
    return null;
  }

  /// Fetch remote SDUI configuration
  Future<Map<String, dynamic>?> fetchSDUIConfig() async {
    final response = await _tryGet('/api/sdui/config');
    if (response != null && response.data is Map<String, dynamic>) {
      return response.data as Map<String, dynamic>;
    }
    return null;
  }
}
