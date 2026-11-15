import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
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
  subtitle?: string;
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

function getDbFilePath(): string {
  // Check root data folder first
  const candidates = [
    path.resolve(process.cwd(), 'data', 'eduvanta_db.json'),
    path.resolve(process.cwd(), '..', '..', 'data', 'eduvanta_db.json'),
    path.resolve(process.cwd(), '..', 'data', 'eduvanta_db.json'),
    'C:\\Users\\UESR\\.gemini\\antigravity\\scratch\\eduvanta\\data\\eduvanta_db.json',
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) || fs.existsSync(path.dirname(c))) {
      return c;
    }
  }
  return candidates[0];
}

const INITIAL_DB: DatabaseState = {
  users: [
    {
      id: 'usr-super-admin-01',
      email: 'rabeyaakterlima159@gmail.com',
      password: 'Australia515#',
      fullName: 'Rabeya Akter Lima',
      subtitle: 'Principal Super Administrator & Platform Owner',
      role: 'super_admin',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'SIS Digital Ecosystem (Central Platform) (SIS-GLOBAL)',
      status: 'active',
      phone: '+880 1712-000000',
      createdAt: '2026-11-01T00:00:00Z',
    },
    {
      id: 'usr-super-admin-02',
      email: 'Sohel229229@gmail.com',
      password: 'shariar123',
      fullName: 'Sohel Shariar',
      subtitle: 'Platform Founder & Co-Administrator',
      role: 'super_admin',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'SIS Digital Ecosystem (Central Platform) (SIS-GLOBAL)',
      status: 'active',
      phone: '+880 1712-000000',
      createdAt: '2026-11-01T00:00:00Z',
    },
    {
      id: 'usr-admin-karim',
      email: 'principal@greenhill.edu.bd',
      password: 'password123',
      fullName: 'Principal M. A. Karim',
      subtitle: 'Headmaster & Principal',
      role: 'school_admin',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      department: 'Administration',
      status: 'active',
      phone: '+8801711000001',
      createdAt: '2026-11-01T08:00:00Z',
    },
    {
      id: 'usr-teacher-jannatul',
      email: 'jannatul@greenhill.edu.bd',
      password: 'password123',
      fullName: 'Jannatul Ferdous',
      subtitle: 'Senior Teacher',
      role: 'teacher',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      department: 'Science (Physics)',
      status: 'active',
      phone: '+8801812345678',
      createdAt: '2026-11-02T11:00:00Z',
    },
    {
      id: 'usr-student-arif',
      email: 'arif.hossain@greenhill.edu.bd',
      password: 'password123',
      fullName: 'Arif Hossain',
      subtitle: 'Verified Enrolled Student',
      role: 'student',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      status: 'active',
      studentClass: 'Class 10',
      studentSection: 'Section A',
      rollNumber: '01',
      guardianName: 'Mohammad Kamal',
      guardianPhone: '+880 1711-223344',
      phone: '+8801712987654',
      createdAt: '2026-11-02T10:00:00Z',
    },
    {
      id: 'usr-student-tasnim',
      email: 'tasnim@greenhill.edu.bd',
      password: 'password123',
      fullName: 'Tasnim Akter',
      subtitle: 'Verified Enrolled Student',
      role: 'student',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      status: 'active',
      studentClass: 'Class 10',
      studentSection: 'Section A',
      rollNumber: '02',
      guardianName: 'Mohammad Kamal',
      guardianPhone: '+880 1711-223344',
      phone: '+8801712987654',
      createdAt: '2026-11-02T10:00:00Z',
    },
    {
      id: 'usr-parent-kamal',
      email: 'parent@greenhill.edu.bd',
      password: 'password123',
      fullName: 'Mohammad Kamal',
      subtitle: 'Guardian of Arif & Tanvir',
      role: 'parent',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      status: 'active',
      phone: '+8801711223344',
      createdAt: '2026-11-02T12:00:00Z',
    },
  ],
  admissions: [
    {
      id: 'EDV-REG-2026-001',
      fullName: 'Sumon Das',
      email: 'sumon.das@gmail.com',
      phone: '+880 1719-112233',
      schoolId: '22222222-2222-2222-2222-222222222201',
      schoolName: 'Green Hill International School (GHIS-BD)',
      className: 'Class 10',
      section: 'Section A',
      desiredRoll: '03',
      guardianName: 'Subir Das',
      guardianPhone: '+880 1819-334455',
      password: 'password123',
      status: 'pending',
      submittedAt: '2026-11-14T07:15:00Z',
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
        title: 'Mid Term Examination 2025 Schedule',
        date: 'Nov 20, 2026',
        type: 'event',
        priority: 'high',
      },
      {
        id: 'ann-2',
        title: 'Digital bKash Fee Payment Gateway Active',
        date: 'Nov 18, 2026',
        type: 'academic',
        priority: 'high',
      },
    ],
    quickStats: {
      attendance: '98.5%',
      assignments: '12 Active',
      results: '88% GPA 5.0',
      feeDue: '৳0 Due',
    },
  },
};

export function getDatabase(): DatabaseState {
  try {
    const filePath = getDbFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      saveDatabase(INITIAL_DB);
      return INITIAL_DB;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseState;

    // Ensure Super Admin exists
    const hasRabeya = parsed.users.some(
      (u) => u.email.toLowerCase() === 'rabeyaakterlima159@gmail.com'
    );
    if (!hasRabeya) {
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
    const filePath = getDbFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}
