import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent' | 'staff';
  schoolId: string;
  schoolName: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  studentClass?: string;
  studentSection?: string;
  rollNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  department?: string;
  phone?: string;
}

export interface AdmissionApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  className: string;
  section: string;
  desiredRoll: string;
  guardianName: string;
  guardianPhone: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface SDUIConfig {
  version: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  heroBanner: {
    title: string;
    subtitle: string;
    badge: string;
    actionText: string;
    actionUrl: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    type: 'event' | 'academic' | 'notice';
    priority: 'low' | 'normal' | 'high';
  }>;
  quickStats: {
    attendance: string;
    assignments: string;
    results: string;
    feeDue: string;
  };
}

export interface DatabaseState {
  users: UserRecord[];
  admissions: AdmissionApplication[];
  sdui: SDUIConfig;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'eduvanta_db.json');

const INITIAL_DB: DatabaseState = {
  users: [
    {
      id: 'usr-super-admin-01',
      email: 'Sohel229229@gmail.com',
      password: 'shariar123',
      fullName: 'Sohel Shariar',
      role: 'super_admin',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Platform Global Executive Hub',
      status: 'active',
      phone: '+880 1712-000000',
      createdAt: '2026-11-01T00:00:00Z',
    },
    {
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
      guardianName: 'Mohammad Kamal',
      guardianPhone: '+880 1711-234567',
      phone: '+880 1812-345678',
      createdAt: '2026-11-02T10:00:00Z',
    },
    {
      id: 'usr-teacher-rahim',
      email: 'teacher@dpis.edu.bd',
      password: 'password123',
      fullName: 'Prof. Abdur Rahim',
      role: 'teacher',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Dhaka Premier International School',
      department: 'Mathematics & Science',
      status: 'active',
      phone: '+880 1715-998877',
      createdAt: '2026-11-02T11:00:00Z',
    },
    {
      id: 'usr-parent-kamal',
      email: 'parent@dpis.edu.bd',
      password: 'password123',
      fullName: 'Mohammad Kamal',
      role: 'parent',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Dhaka Premier International School',
      status: 'active',
      phone: '+880 1711-234567',
      createdAt: '2026-11-02T12:00:00Z',
    },
    {
      id: 'usr-admin-tariq',
      email: 'admin@dpis.edu.bd',
      password: 'password123',
      fullName: 'Dr. Tariqul Islam',
      role: 'school_admin',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Dhaka Premier International School',
      status: 'active',
      phone: '+880 1719-876543',
      createdAt: '2026-11-01T08:00:00Z',
    },
  ],
  admissions: [
    {
      id: 'APP-2026-001',
      fullName: 'Nafis Chowdhury',
      email: 'nafis.chowdhury@dpis.edu.bd',
      phone: '+880 1812-998877',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Dhaka Premier International School',
      className: 'Class 9',
      section: 'Section B',
      desiredRoll: '9045',
      guardianName: 'Rafiqul Chowdhury',
      guardianPhone: '+880 1712-445566',
      password: 'password123',
      status: 'pending',
      submittedAt: '2026-11-13T09:30:00Z',
    },
    {
      id: 'APP-2026-002',
      fullName: 'Anika Tabassum',
      email: 'anika.tabassum@dpis.edu.bd',
      phone: '+880 1719-332211',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Dhaka Premier International School',
      className: 'Class 8',
      section: 'Section A',
      desiredRoll: '8012',
      guardianName: 'Dr. Nasir Uddin',
      guardianPhone: '+880 1819-776655',
      password: 'password123',
      status: 'pending',
      submittedAt: '2026-11-13T11:15:00Z',
    },
  ],
  sdui: {
    version: 1,
    maintenanceMode: false,
    maintenanceMessage: 'System undergoing routine optimization.',
    theme: {
      primaryColor: '#102A56',
      secondaryColor: '#2563EB',
      accentColor: '#F5B82E',
      backgroundColor: '#F5F8FC',
    },
    heroBanner: {
      title: 'Welcome to Eduvanta',
      subtitle: 'One Platform. Every Campus. Smarter Education.',
      badge: 'Academic Term 2026-27',
      actionText: 'Explore More',
      actionUrl: '/academic/explore',
    },
    announcements: [
      {
        id: 'ann-1',
        title: 'Annual Sports Day 2026',
        date: 'Nov 20, 2026',
        type: 'event',
        priority: 'high',
      },
      {
        id: 'ann-2',
        title: 'Mid-Term Exam Schedule Published',
        date: 'Nov 18, 2026',
        type: 'academic',
        priority: 'high',
      },
      {
        id: 'ann-3',
        title: 'Campus Science Fair Registration Open',
        date: 'Dec 05, 2026',
        type: 'notice',
        priority: 'normal',
      },
    ],
    quickStats: {
      attendance: '95%',
      assignments: '12 Active',
      results: '88% GPA 4.8',
      feeDue: '৳12,500',
    },
  },
};

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDatabase(): DatabaseState {
  try {
    ensureDbDirectory();
    if (!fs.existsSync(DB_FILE_PATH)) {
      saveDatabase(INITIAL_DB);
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseState;

    // Ensure Super Admin exists
    const hasSuperAdmin = parsed.users.some(
      (u) => u.email.toLowerCase() === 'sohel229229@gmail.com'
    );
    if (!hasSuperAdmin) {
      parsed.users.unshift(INITIAL_DB.users[0]);
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return INITIAL_DB;
  }
}

export function saveDatabase(data: DatabaseState): void {
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}
