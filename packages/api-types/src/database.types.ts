export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | 'accountant';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'excused';
export type NoticeCategory = 'academic' | 'exam' | 'holiday' | 'administrative' | 'sports';
export type NoticePriority = 'normal' | 'high' | 'urgent';
export type NoticeAudience = 'all' | 'parents' | 'teachers' | 'students' | 'class';
export type HomeworkStatus = 'pending' | 'submitted' | 'graded';
export type FeeStatus = 'paid' | 'partial' | 'pending' | 'overdue';
export type PaymentMethod = 'cash' | 'online_razorpay' | 'upi' | 'cheque';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      academic_years: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          start_date?: string;
          end_date?: string;
          is_current?: boolean;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          order_index?: number;
        };
      };
      sections: {
        Row: {
          id: string;
          class_id: string;
          name: string;
          room_number: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          name: string;
          room_number?: string | null;
          created_at?: string;
        };
        Update: {
          class_id?: string;
          name?: string;
          room_number?: string | null;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          class_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          class_id: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          class_id?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          profile_id: string;
          employee_id: string;
          designation: string;
          qualification: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          employee_id: string;
          designation: string;
          qualification?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          designation?: string;
          qualification?: string | null;
          is_active?: boolean;
        };
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          admission_number: string;
          first_name: string;
          last_name: string;
          first_name_hi: string | null;
          last_name_hi: string | null;
          roll_number: number;
          section_id: string;
          academic_year_id: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          blood_group: string | null;
          category: string;
          is_rte: boolean;
          bus_route: string | null;
          emergency_phone: string;
          address: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          admission_number: string;
          first_name: string;
          last_name: string;
          first_name_hi?: string | null;
          last_name_hi?: string | null;
          roll_number: number;
          section_id: string;
          academic_year_id: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          blood_group?: string | null;
          category?: string;
          is_rte?: boolean;
          bus_route?: string | null;
          emergency_phone: string;
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string | null;
          first_name?: string;
          last_name?: string;
          first_name_hi?: string | null;
          last_name_hi?: string | null;
          roll_number?: number;
          section_id?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          blood_group?: string | null;
          category?: string;
          is_rte?: boolean;
          bus_route?: string | null;
          emergency_phone?: string;
          address?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      guardians: {
        Row: {
          id: string;
          profile_id: string;
          first_name: string;
          last_name: string;
          relation: 'father' | 'mother' | 'guardian';
          phone: string;
          email: string | null;
          occupation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          first_name: string;
          last_name: string;
          relation: 'father' | 'mother' | 'guardian';
          phone: string;
          email?: string | null;
          occupation?: string | null;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          relation?: 'father' | 'mother' | 'guardian';
          phone?: string;
          email?: string | null;
          occupation?: string | null;
        };
      };
      student_guardians: {
        Row: {
          student_id: string;
          guardian_id: string;
          is_primary: boolean;
        };
        Insert: {
          student_id: string;
          guardian_id: string;
          is_primary?: boolean;
        };
        Update: {
          is_primary?: boolean;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: AttendanceStatus;
          remarks: string | null;
          marked_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          status: AttendanceStatus;
          remarks?: string | null;
          marked_by: string;
          created_at?: string;
        };
        Update: {
          status?: AttendanceStatus;
          remarks?: string | null;
          marked_by?: string;
        };
      };
      notices: {
        Row: {
          id: string;
          title: string;
          title_hi: string | null;
          content: string;
          content_hi: string | null;
          category: NoticeCategory;
          priority: NoticePriority;
          audience: NoticeAudience;
          target_class_id: string | null;
          attachment_url: string | null;
          published_by: string;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_hi?: string | null;
          content: string;
          content_hi?: string | null;
          category?: NoticeCategory;
          priority?: NoticePriority;
          audience?: NoticeAudience;
          target_class_id?: string | null;
          attachment_url?: string | null;
          published_by: string;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          title_hi?: string | null;
          content?: string;
          content_hi?: string | null;
          category?: NoticeCategory;
          priority?: NoticePriority;
          audience?: NoticeAudience;
          target_class_id?: string | null;
          attachment_url?: string | null;
        };
      };
      homework: {
        Row: {
          id: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          title: string;
          description: string;
          due_date: string;
          attachment_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          subject_id: string;
          teacher_id: string;
          title: string;
          description: string;
          due_date: string;
          attachment_url?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          due_date?: string;
          attachment_url?: string | null;
        };
      };
      timetables: {
        Row: {
          id: string;
          section_id: string;
          subject_id: string;
          staff_id: string;
          day_of_week: number;
          period_number: number;
          start_time: string;
          end_time: string;
          academic_year_id: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          subject_id: string;
          staff_id: string;
          day_of_week: number;
          period_number: number;
          start_time: string;
          end_time: string;
          academic_year_id: string;
        };
        Update: {
          subject_id?: string;
          staff_id?: string;
          start_time?: string;
          end_time?: string;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          title_hi: string | null;
          description: string | null;
          event_type: 'holiday' | 'exam' | 'celebration' | 'meeting' | 'sports';
          start_date: string;
          end_date: string;
          audience: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_hi?: string | null;
          description?: string | null;
          event_type: 'holiday' | 'exam' | 'celebration' | 'meeting' | 'sports';
          start_date: string;
          end_date: string;
          audience?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          title_hi?: string | null;
          description?: string | null;
          event_type?: 'holiday' | 'exam' | 'celebration' | 'meeting' | 'sports';
          start_date?: string;
          end_date?: string;
          audience?: string;
        };
      };
      fee_invoices: {
        Row: {
          id: string;
          student_id: string;
          quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
          academic_year_id: string;
          total_amount: number;
          paid_amount: number;
          due_date: string;
          status: FeeStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
          academic_year_id: string;
          total_amount: number;
          paid_amount?: number;
          due_date: string;
          status?: FeeStatus;
          created_at?: string;
        };
        Update: {
          total_amount?: number;
          paid_amount?: number;
          status?: FeeStatus;
        };
      };
    };
    Functions: {
      get_student_attendance_pct: {
        Args: { student_id_param: string; month_param?: number; year_param?: number };
        Returns: number;
      };
      calculate_fee_due: {
        Args: { student_id_param: string };
        Returns: number;
      };
    };
  };
}
