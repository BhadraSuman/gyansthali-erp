import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface InAppNotification {
  id: string;
  userId?: string;
  title: string;
  titleHi?: string;
  body: string;
  bodyHi?: string;
  category: 'absence_alert' | 'new_homework' | 'new_notice' | 'fee_due';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const mockNotifications: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'Urgent Circular: Half-Yearly Exam Schedule',
    titleHi: 'अति आवश्यक परिपत्र: अर्धवार्षिक परीक्षा समय-सारणी',
    body: 'CBSE Term-1 examinations commence from October 15, 2026. Hall tickets available on fee clearance.',
    bodyHi: 'सीबीएसई प्रथम सत्र परीक्षाएं 15 अक्टूबर 2026 से प्रारंभ होंगी।',
    category: 'new_notice',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    actionUrl: '/portal/notices',
  },
  {
    id: 'notif-2',
    title: 'New Homework: Mathematics NCERT Ex 6.3',
    titleHi: 'नया गृहकार्य: गणित एनसीईआरटी अभ्यास 6.3',
    body: 'Class 5-A homework assigned by Sunita Mishra. Due on October 6, 2026.',
    bodyHi: 'कक्षा 5-A गृहकार्य सुनीता मिश्रा द्वारा जारी किया गया।',
    category: 'new_homework',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    actionUrl: '/portal/homework',
  },
  {
    id: 'notif-3',
    title: 'Attendance Confirmation: Aarav Sharma Present',
    titleHi: 'उपस्थिति पुष्टि: आरव शर्मा उपस्थित',
    body: 'Daily roll-call recorded for today at 08:35 AM.',
    bodyHi: 'आज प्रातः 08:35 बजे उपस्थिति दर्ज की गई।',
    category: 'absence_alert',
    read: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    actionUrl: '/portal/attendance',
  },
];

export async function getNotifications(): Promise<InAppNotification[]> {
  return mockNotifications;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const notif = mockNotifications.find((n) => n.id === id);
  if (notif) notif.read = true;
}

export async function dispatchAbsenceAlert(studentName: string, date: string, remarks?: string): Promise<InAppNotification> {
  const newNotif: InAppNotification = {
    id: `notif-${Date.now()}`,
    title: `Absence Alert: ${studentName}`,
    titleHi: `अनुपस्थिति सूचना: ${studentName}`,
    body: `${studentName} was marked absent on ${date}.${remarks ? ` Reason: ${remarks}` : ''} Please contact class teacher if unintentional.`,
    bodyHi: `${studentName} को ${date} को अनुपस्थित दर्ज किया गया है।`,
    category: 'absence_alert',
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/portal/attendance',
  };
  mockNotifications.unshift(newNotif);
  return newNotif;
}
