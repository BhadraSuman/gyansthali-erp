import { describe, it, expect } from 'vitest';
import en from '../packages/i18n/messages/en.json';
import hi from '../packages/i18n/messages/hi.json';

describe('Bilingual i18n Dictionary Parity Tests', () => {
  it('has identical top-level namespaces in English and Hindi', () => {
    const enKeys = Object.keys(en);
    const hiKeys = Object.keys(hi);
    expect(hiKeys).toEqual(expect.arrayContaining(enKeys));
  });

  it('contains translations for all 7 priority ERP features', () => {
    const requiredSections = [
      'common',
      'roles',
      'nav',
      'auth',
      'attendance',
      'notices',
      'homework',
      'timetable',
      'calendar',
      'student',
      'fees',
    ];

    for (const sec of requiredSections) {
      expect(en).toHaveProperty(sec);
      expect(hi).toHaveProperty(sec);
    }
  });

  it('provides verified school branding in both languages', () => {
    expect(en.common.schoolName).toBe('Gyan Sthali Public School');
    expect(hi.common.schoolName).toBe('ज्ञान स्थली पब्लिक स्कूल');
  });
});
