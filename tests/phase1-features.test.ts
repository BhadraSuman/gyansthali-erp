import { describe, it, expect } from 'vitest';
import { parseStudentsCSV, mockStaffList, mockClasses } from '../apps/web/src/data/admin';
import { dispatchAbsenceAlert, getNotifications } from '../apps/web/src/data/notifications';

describe('Phase 1: MVP Feature Tests', () => {
  it('parses valid CSV rows into Student objects correctly', () => {
    const csv = `admission_number,first_name,last_name,roll_number,gender,category,is_rte,guardian_name,guardian_phone,emergency_phone
GSPS-2024-801,Amit,Kumar,21,male,GEN,false,Sunil Kumar,+91 98765 11111,+91 98765 11111
GSPS-2024-802,Pooja,Hembram,22,female,ST,true,Babu Hembram,+91 98765 22222,+91 98765 22222`;

    const result = parseStudentsCSV(csv);
    expect(result.errors.length).toBe(0);
    expect(result.successful.length).toBe(2);
    expect(result.successful[0].admission_number).toBe('GSPS-2024-801');
    expect(result.successful[0].first_name).toBe('Amit');
    expect(result.successful[1].is_rte).toBe(true);
    expect(result.successful[1].category).toBe('ST');
  });

  it('rejects malformed CSV rows with actionable line errors', () => {
    const malformedCsv = `admission_number,first_name,last_name,roll_number,gender,category
GSPS-BAD-01,Test`;

    const result = parseStudentsCSV(malformedCsv);
    expect(result.successful.length).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('dispatches absence alert notification when student is marked absent', async () => {
    const alert = await dispatchAbsenceAlert('Kavita Bauri', '2026-10-04', 'High Fever');
    expect(alert.category).toBe('absence_alert');
    expect(alert.title).toContain('Kavita Bauri');
    expect(alert.body).toContain('High Fever');

    const allNotifs = await getNotifications();
    expect(allNotifs.some((n) => n.id === alert.id)).toBe(true);
  });

  it('verifies academic class and staff allocation structures', () => {
    const class5 = mockClasses.find((c) => c.name === 'Class 5');
    expect(class5).toBeDefined();
    expect(class5?.sections.length).toBe(2);

    const class5Teacher = mockStaffList.find((s) => s.assignedClass === 'Class 5-A');
    expect(class5Teacher).toBeDefined();
    expect(class5Teacher?.fullName).toBe('Sunita Mishra');
  });
});
