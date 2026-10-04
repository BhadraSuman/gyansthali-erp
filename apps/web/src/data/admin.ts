import { mockStudents } from './mockData';
import type { StudentWithClass } from '@gyansthali/api-types';

export interface AcademicYearConfig {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ClassConfig {
  id: string;
  name: string;
  orderIndex: number;
  sections: { id: string; name: string; roomNumber: string; classTeacher?: string }[];
  subjects: { id: string; name: string; code: string; teacher?: string }[];
}

export interface StaffMember {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  assignedClass?: string;
}

export const mockAcademicYears: AcademicYearConfig[] = [
  { id: 'ay-2024-25', name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', isCurrent: true },
  { id: 'ay-2025-26', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isCurrent: false },
];

export const mockClasses: ClassConfig[] = [
  {
    id: 'c-lkg',
    name: 'Class LKG',
    orderIndex: 0,
    sections: [{ id: 'sec-lkg-a', name: 'A', roomNumber: 'Room 101', classTeacher: 'Kiran Sharma' }],
    subjects: [
      { id: 'sub-lkg-1', name: 'English Rhymes', code: 'ENG-LKG', teacher: 'Kiran Sharma' },
      { id: 'sub-lkg-2', name: 'Hindi Bal Geet', code: 'HIN-LKG', teacher: 'Kiran Sharma' },
      { id: 'sub-lkg-3', name: 'Numbers & Shapes', code: 'MATH-LKG', teacher: 'Kiran Sharma' },
    ],
  },
  {
    id: 'c-5',
    name: 'Class 5',
    orderIndex: 5,
    sections: [
      { id: 'sec-5-a', name: 'A', roomNumber: 'Room 204', classTeacher: 'Sunita Mishra' },
      { id: 'sec-5-b', name: 'B', roomNumber: 'Room 205', classTeacher: 'Rajesh Verma' },
    ],
    subjects: [
      { id: 'sub-5-math', name: 'Mathematics', code: 'MATH-5', teacher: 'Sunita Mishra' },
      { id: 'sub-5-hin', name: 'Hindi Vyakaran', code: 'HIN-5', teacher: 'Pooja Pandey' },
      { id: 'sub-5-eng', name: 'English Reader', code: 'ENG-5', teacher: 'Sunita Mishra' },
      { id: 'sub-5-evs', name: 'Environmental Studies', code: 'EVS-5', teacher: 'Rajesh Verma' },
    ],
  },
  {
    id: 'c-6',
    name: 'Class 6',
    orderIndex: 6,
    sections: [
      { id: 'sec-6-a', name: 'A', roomNumber: 'Room 206', classTeacher: 'Rajesh Verma' },
    ],
    subjects: [
      { id: 'sub-6-math', name: 'Mathematics', code: 'MATH-6', teacher: 'Sunita Mishra' },
      { id: 'sub-6-sci', name: 'General Science', code: 'SCI-6', teacher: 'Rajesh Verma' },
      { id: 'sub-6-hin', name: 'Hindi Literature', code: 'HIN-6', teacher: 'Pooja Pandey' },
    ],
  },
];

export const mockStaffList: StaffMember[] = [
  {
    id: 'st-01',
    employeeId: 'GSPS-T01',
    fullName: 'Sunita Mishra',
    email: 'sunita.mishra@gyansthali.edu',
    phone: '+91 98000 00002',
    designation: 'Senior Teacher • Math In-charge',
    assignedClass: 'Class 5-A',
  },
  {
    id: 'st-02',
    employeeId: 'GSPS-T02',
    fullName: 'Rajesh Verma',
    email: 'rajesh.verma@gyansthali.edu',
    phone: '+91 98000 00003',
    designation: 'Science & Computer Faculty',
    assignedClass: 'Class 6-A',
  },
  {
    id: 'st-03',
    employeeId: 'GSPS-T03',
    fullName: 'Pooja Pandey',
    email: 'pooja.pandey@gyansthali.edu',
    phone: '+91 98000 00004',
    designation: 'Hindi & Sanskrit Faculty',
    assignedClass: 'Class 5-B',
  },
  {
    id: 'st-04',
    employeeId: 'GSPS-T04',
    fullName: 'Kiran Sharma',
    email: 'kiran.sharma@gyansthali.edu',
    phone: '+91 98000 00005',
    designation: 'Pre-Primary Co-ordinator',
    assignedClass: 'Class LKG-A',
  },
];

export async function addStudentAdmission(newStudent: Omit<StudentWithClass, 'id' | 'created_at' | 'updated_at'>): Promise<StudentWithClass> {
  const created: StudentWithClass = {
    ...newStudent,
    id: `std-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockStudents.push(created);
  return created;
}

export interface CSVParseResult {
  successful: StudentWithClass[];
  errors: { row: number; error: string }[];
}

export function parseStudentsCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.trim().split('\n');
  if (lines.length <= 1) {
    return { successful: [], errors: [{ row: 1, error: 'Empty CSV or header only' }] };
  }

  const results: StudentWithClass[] = [];
  const errors: { row: number; error: string }[] = [];

  // Header format: admission_number,first_name,last_name,roll_number,gender,category,is_rte,guardian_name,guardian_phone,emergency_phone
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 6) {
      errors.push({ row: i + 1, error: `Invalid column count: expected at least 6, got ${cols.length}` });
      continue;
    }

    const [admNo, firstName, lastName, rollStr, gender, category, isRteStr, guardianName, guardianPhone, emergencyPhone] = cols;
    const roll = parseInt(rollStr, 10);
    if (isNaN(roll)) {
      errors.push({ row: i + 1, error: `Invalid roll number: "${rollStr}"` });
      continue;
    }

    const student: StudentWithClass = {
      id: `std-csv-${Date.now()}-${i}`,
      profile_id: null,
      admission_number: admNo,
      first_name: firstName,
      last_name: lastName,
      first_name_hi: null,
      last_name_hi: null,
      roll_number: roll,
      section_id: 's0000000-0000-0000-0000-00000000005a',
      className: 'Class 5',
      sectionName: 'A',
      academic_year_id: 'a0000000-0000-0000-0000-000000000001',
      date_of_birth: '2014-01-01',
      gender: (gender.toLowerCase() === 'female' ? 'female' : 'male') as any,
      blood_group: 'O+',
      category: category || 'GEN',
      is_rte: isRteStr?.toLowerCase() === 'true' || isRteStr === '1',
      bus_route: 'Local',
      emergency_phone: emergencyPhone || guardianPhone || '+91 98765 00000',
      guardianName: guardianName || 'Guardian',
      guardianPhone: guardianPhone || emergencyPhone || '+91 98765 00000',
      attendancePct: 100,
      totalFeeDue: 0,
      address: 'Kalajharia, Jamtara',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    results.push(student);
    mockStudents.push(student);
  }

  return { successful: results, errors };
}
