import { Database, UserRole, AttendanceStatus, FeeStatus } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Student = Database['public']['Tables']['students']['Row'];
export type Attendance = Database['public']['Tables']['attendance']['Row'];
export type Notice = Database['public']['Tables']['notices']['Row'];
export type Homework = Database['public']['Tables']['homework']['Row'];
export type TimetableEntry = Database['public']['Tables']['timetables']['Row'];
export type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
export type FeeInvoice = Database['public']['Tables']['fee_invoices']['Row'];

export interface StudentWithClass extends Student {
  className?: string;
  sectionName?: string;
  guardianName?: string;
  guardianPhone?: string;
  attendancePct?: number;
  totalFeeDue?: number;
}

export interface AttendanceRollCallItem {
  studentId: string;
  rollNumber: number;
  studentName: string;
  studentNameHi?: string | null;
  avatarUrl?: string | null;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSummary {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
  isExamEligible: boolean;
}

export interface TimetableSlot {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  roomNumber?: string;
  isRecess?: boolean;
}

export interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  periods: TimetableSlot[];
}
