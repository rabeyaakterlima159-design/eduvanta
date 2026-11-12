// ==============================================================================
// EDUVANTA API CONTRACTS & ZOD VALIDATION SCHEMAS
// ==============================================================================

import { z } from 'zod';

// 1. School Management Schemas
export const CreateSchoolSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters'),
  code: z.string().min(3, 'School code must be at least 3 characters').regex(/^[A-Z0-9-]+$/, 'Code must be alphanumeric with hyphens'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('Bangladesh'),
  subscriptionPlanId: z.string().uuid().optional(),
});

export const UpdateSchoolBrandingSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  motto: z.string().max(255).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

// 2. Attendance Schemas
export const BulkAttendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late', 'half_day', 'excused']),
  remarks: z.string().max(255).optional(),
});

export const SubmitBulkAttendanceSchema = z.object({
  schoolId: z.string().uuid(),
  sessionId: z.string().uuid(),
  classId: z.string().uuid(),
  sectionId: z.string().uuid(),
  subjectId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  entries: z.array(BulkAttendanceEntrySchema).min(1, 'At least one student record is required'),
});

// 3. Examination Marks Schemas
export const MarkEntrySchema = z.object({
  studentId: z.string().uuid(),
  obtainedMarks: z.number().min(0, 'Marks cannot be negative'),
  letterGrade: z.string().max(10).optional(),
  gpa: z.number().min(0).max(5.0).optional(),
  remarks: z.string().max(255).optional(),
});

export const SubmitExamMarksSchema = z.object({
  schoolId: z.string().uuid(),
  examSubjectId: z.string().uuid(),
  marks: z.array(MarkEntrySchema).min(1, 'At least one mark entry required'),
});

// 4. Assignment Schemas
export const CreateAssignmentSchema = z.object({
  schoolId: z.string().uuid(),
  sessionId: z.string().uuid(),
  classId: z.string().uuid(),
  sectionId: z.string().uuid(),
  subjectId: z.string().uuid(),
  title: z.string().min(3, 'Title is required').max(255),
  description: z.string().min(5, 'Description is required'),
  dueDate: z.string().datetime({ message: 'Due date must be a valid ISO datetime' }),
  totalPoints: z.number().positive().default(100),
  allowLateSubmission: z.boolean().default(true),
  attachmentUrls: z.array(z.string().url()).optional(),
});

export const SubmitAssignmentSchema = z.object({
  schoolId: z.string().uuid(),
  assignmentId: z.string().uuid(),
  submissionText: z.string().optional(),
  attachmentUrls: z.array(z.string().url()).optional(),
});

// 5. Payment Schemas (bKash / Nagad / SSLCommerz)
export const InitiatePaymentSchema = z.object({
  schoolId: z.string().uuid(),
  studentFeeId: z.string().uuid(),
  gateway: z.enum(['bkash', 'nagad', 'sslcommerz', 'cash', 'bank_transfer']),
  amount: z.number().positive('Payment amount must be greater than zero'),
  callbackUrl: z.string().url().optional(),
});

export const VerifyPaymentSchema = z.object({
  gateway: z.enum(['bkash', 'nagad', 'sslcommerz']),
  merchantInvoiceNumber: z.string().min(1),
  paymentId: z.string().optional(),
  trxId: z.string().optional(),
  val_id: z.string().optional(),
});

// 6. Server-Driven UI Schemas
export const PublishSDUISchema = z.object({
  schoolId: z.string().uuid().optional(),
  roleTarget: z.string().optional(),
  layout: z.object({
    theme: z.object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      accentColor: z.string(),
      backgroundColor: z.string(),
      appBarTitle: z.string(),
      logoUrl: z.string().nullable().optional(),
    }),
    navigation: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        route: z.string(),
        icon: z.string(),
        order: z.number(),
        rolesAllowed: z.array(z.string()),
      })
    ),
    widgets: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.string().optional(),
        visible: z.boolean(),
        order: z.number(),
        rolesAllowed: z.array(z.string()),
        props: z.record(z.any()),
      })
    ),
  }),
  changeSummary: z.string().optional(),
});

export type CreateSchoolInput = z.infer<typeof CreateSchoolSchema>;
export type UpdateSchoolBrandingInput = z.infer<typeof UpdateSchoolBrandingSchema>;
export type SubmitBulkAttendanceInput = z.infer<typeof SubmitBulkAttendanceSchema>;
export type SubmitExamMarksInput = z.infer<typeof SubmitExamMarksSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof SubmitAssignmentSchema>;
export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export type PublishSDUIInput = z.infer<typeof PublishSDUISchema>;
