// ==============================================================================
// EDUVANTA ECOSYSTEM - UNIFIED TYPE DEFINITIONS
// ==============================================================================

export type UUID = string;
export type ISODateString = string;

// ------------------------------------------------------------------------------
// 1. PLATFORM & TENANT ROLES
// ------------------------------------------------------------------------------

export type PlatformRole = 'super_admin' | 'platform_admin' | 'support_agent';

export type SchoolRole =
  | 'school_owner'
  | 'school_admin'
  | 'principal'
  | 'accountant'
  | 'teacher'
  | 'class_teacher'
  | 'student'
  | 'parent'
  | 'librarian'
  | 'transport_manager'
  | 'receptionist'
  | 'staff';

export type UserRole = PlatformRole | SchoolRole;

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'manage';

export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'inactive';
export type SchoolStatus = 'pending' | 'active' | 'suspended' | 'archived';
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise' | 'custom';
export type SubscriptionBillingCycle = 'monthly' | 'quarterly' | 'annual';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';

// ------------------------------------------------------------------------------
// 2. TENANT & SCHOOL MODELS
// ------------------------------------------------------------------------------

export interface SchoolBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  customCss?: string;
  bannerUrl?: string;
  motto?: string;
}

export interface SchoolSettings {
  id: UUID;
  schoolId: UUID;
  timezone: string;
  currency: string;
  currencySymbol: string;
  academicYearStartMonth: number;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  enableOnlineAdmissions: boolean;
  enableOnlinePayments: boolean;
  enableSmsNotifications: boolean;
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  attendanceMode: 'daily' | 'subject_wise' | 'biometric';
  gradingSystem: 'letter_grade' | 'gpa_5' | 'percentage';
  branding: SchoolBranding;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface School {
  id: UUID;
  code: string; // Unique school identifier (e.g., SCH-001)
  name: string;
  slug: string;
  email: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  status: SchoolStatus;
  subscriptionPlanId?: UUID;
  subscriptionExpiresAt?: ISODateString;
  settings?: SchoolSettings;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SubscriptionPlan {
  id: UUID;
  name: string;
  tier: SubscriptionTier;
  description?: string;
  priceMonthly: number;
  priceAnnual: number;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGb: number;
  features: string[];
  isActive: boolean;
  createdAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 3. USER & MEMBERSHIP MODELS
// ------------------------------------------------------------------------------

export interface UserProfile {
  id: UUID; // Matches auth.users id
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  bloodGroup?: string;
  nationalId?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SchoolMembership {
  id: UUID;
  schoolId: UUID;
  userId: UUID;
  role: SchoolRole;
  status: MembershipStatus;
  designation?: string;
  department?: string;
  joinedAt: ISODateString;
  validUntil?: ISODateString;
  school?: School;
  profile?: UserProfile;
}

export interface ParentStudentLink {
  id: UUID;
  parentId: UUID;
  studentId: UUID;
  relationship: 'father' | 'mother' | 'guardian';
  isPrimaryContact: boolean;
  createdAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 4. ACADEMIC STRUCTURE
// ------------------------------------------------------------------------------

export interface AcademicSession {
  id: UUID;
  schoolId: UUID;
  name: string; // e.g. 2026-2027
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: ISODateString;
}

export interface SchoolClass {
  id: UUID;
  schoolId: UUID;
  name: string; // e.g., Grade 10, Class 8
  numericLevel?: number;
  description?: string;
  createdAt: ISODateString;
}

export interface Section {
  id: UUID;
  schoolId: UUID;
  classId: UUID;
  name: string; // e.g., Section A, Science
  capacity: number;
  classTeacherId?: UUID;
  className?: string;
  createdAt: ISODateString;
}

export interface Subject {
  id: UUID;
  schoolId: UUID;
  name: string; // e.g., Mathematics, Physics
  code: string; // e.g., MATH-101
  isElective: boolean;
  credits?: number;
  passMarks?: number;
  totalMarks?: number;
}

export interface StudentEnrollment {
  id: UUID;
  schoolId: UUID;
  studentId: UUID;
  sessionId: UUID;
  classId: UUID;
  sectionId: UUID;
  rollNumber: string;
  enrollmentDate: string;
  status: 'active' | 'promoted' | 'graduated' | 'transferred' | 'withdrawn';
  student?: UserProfile;
  className?: string;
  sectionName?: string;
}

export interface TimetableSlot {
  id: UUID;
  schoolId: UUID;
  sessionId: UUID;
  classId: UUID;
  sectionId: UUID;
  subjectId: UUID;
  teacherId: UUID;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday
  startTime: string; // HH:mm:ss
  endTime: string;
  roomNumber?: string;
  subjectName?: string;
  teacherName?: string;
}

// ------------------------------------------------------------------------------
// 5. ATTENDANCE & LEAVES
// ------------------------------------------------------------------------------

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'excused';

export interface AttendanceRecord {
  id: UUID;
  schoolId: UUID;
  sessionId: UUID;
  classId: UUID;
  sectionId: UUID;
  studentId: UUID;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: UUID;
  createdAt: ISODateString;
}

export interface LeaveRequest {
  id: UUID;
  schoolId: UUID;
  userId: UUID;
  leaveType: 'sick' | 'casual' | 'emergency' | 'vacation' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  reviewedBy?: UUID;
  reviewedAt?: ISODateString;
  reviewRemarks?: string;
  createdAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 6. EXAMINATIONS & RESULTS
// ------------------------------------------------------------------------------

export interface Examination {
  id: UUID;
  schoolId: UUID;
  sessionId: UUID;
  title: string; // e.g. Half-Yearly Exam 2026
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'published';
  createdAt: ISODateString;
}

export interface ExamMark {
  id: UUID;
  schoolId: UUID;
  examId: UUID;
  subjectId: UUID;
  studentId: UUID;
  obtainedMarks: number;
  maxMarks: number;
  letterGrade?: string;
  gpa?: number;
  remarks?: string;
  evaluatedBy: UUID;
}

// ------------------------------------------------------------------------------
// 7. ASSIGNMENTS & STUDY MATERIALS
// ------------------------------------------------------------------------------

export interface Assignment {
  id: UUID;
  schoolId: UUID;
  classId: UUID;
  sectionId: UUID;
  subjectId: UUID;
  teacherId: UUID;
  title: string;
  description: string;
  attachmentUrls?: string[];
  dueDate: ISODateString;
  totalPoints: number;
  allowLateSubmission: boolean;
  createdAt: ISODateString;
}

export interface AssignmentSubmission {
  id: UUID;
  schoolId: UUID;
  assignmentId: UUID;
  studentId: UUID;
  submissionText?: string;
  attachmentUrls?: string[];
  submittedAt: ISODateString;
  status: 'submitted' | 'late' | 'graded' | 'resubmit_requested';
  obtainedPoints?: number;
  feedback?: string;
  gradedBy?: UUID;
  gradedAt?: ISODateString;
}

export interface StudyMaterial {
  id: UUID;
  schoolId: UUID;
  classId: UUID;
  subjectId: UUID;
  teacherId: UUID;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  createdAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 8. FINANCE & PAYMENTS
// ------------------------------------------------------------------------------

export type PaymentMethod = 'bkash' | 'nagad' | 'sslcommerz' | 'cash' | 'bank_transfer' | 'manual';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface FeeCategory {
  id: UUID;
  schoolId: UUID;
  name: string; // e.g. Tuition Fee, Admission Fee, Transport, Library
  description?: string;
  isRecurring: boolean;
}

export interface StudentFeeInvoice {
  id: UUID;
  schoolId: UUID;
  studentId: UUID;
  feeCategoryId: UUID;
  invoiceNumber: string;
  amount: number;
  discount: number;
  fine: number;
  totalPayable: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'waived';
  categoryName?: string;
  createdAt: ISODateString;
}

export interface PaymentTransaction {
  id: UUID;
  schoolId: UUID;
  studentFeeId?: UUID;
  payerId: UUID;
  paymentGateway: PaymentMethod;
  gatewayTransactionId?: string;
  merchantInvoiceNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayRawResponse?: Record<string, unknown>;
  verifiedAt?: ISODateString;
  createdAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 9. LIBRARY & TRANSPORT
// ------------------------------------------------------------------------------

export interface LibraryBook {
  id: UUID;
  schoolId: UUID;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  publisher?: string;
  edition?: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string;
}

export interface Vehicle {
  id: UUID;
  schoolId: UUID;
  vehicleNumber: string;
  model: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface TransportRoute {
  id: UUID;
  schoolId: UUID;
  name: string;
  vehicleId?: UUID;
  startLocation: string;
  endLocation: string;
  stops: { name: string; time: string; feeMonthly: number }[];
  totalMonthlyFee: number;
}

// ------------------------------------------------------------------------------
// 10. SERVER-DRIVEN UI (SDUI) SPECIFICATIONS
// ------------------------------------------------------------------------------

export type SDUIComponentType =
  | 'HeroBanner'
  | 'QuickStats'
  | 'ActionGrid'
  | 'TimetableCard'
  | 'AnnouncementFeed'
  | 'FeeAlert'
  | 'ExamScheduleCard'
  | 'RecentAssignments';

export interface SDUIWidgetConfig {
  id: string;
  type: SDUIComponentType;
  title?: string;
  visible: boolean;
  order: number;
  rolesAllowed: SchoolRole[];
  props: Record<string, unknown>;
}

export interface SDUINavigationItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  rolesAllowed: SchoolRole[];
  badgeKey?: string;
  order: number;
}

export interface SDUIHomeScreenLayout {
  version: number;
  publishedAt: ISODateString;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  minSupportedAppVersion: string;
  forceUpdateUrl?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    appBarTitle: string;
    logoUrl: string;
  };
  navigation: SDUINavigationItem[];
  widgets: SDUIWidgetConfig[];
}

export interface RemoteAppConfiguration {
  id: UUID;
  schoolId?: UUID; // Null means global platform default
  roleTarget?: SchoolRole;
  layout: SDUIHomeScreenLayout;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ------------------------------------------------------------------------------
// 11. COMMUNICATION & AUDIT
// ------------------------------------------------------------------------------

export interface Announcement {
  id: UUID;
  schoolId: UUID;
  title: string;
  content: string;
  targetRoles: SchoolRole[];
  targetClassId?: UUID;
  targetSectionId?: UUID;
  publishedBy: UUID;
  isImportant: boolean;
  attachmentUrls?: string[];
  createdAt: ISODateString;
}

export interface AuditLog {
  id: UUID;
  schoolId?: UUID;
  userId?: UUID;
  action: string;
  entityName: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: ISODateString;
}
