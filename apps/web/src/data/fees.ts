import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockInvoices } from './mockData';
import type { FeeInvoice } from '@gyansthali/api-types';

export interface FeeSummary {
  totalBilled: number;
  totalPaid: number;
  balanceDue: number;
  invoices: FeeInvoice[];
}

export async function getStudentFees(studentId: string): Promise<FeeSummary> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('fee_invoices')
      .select('*')
      .eq('student_id', studentId);
    if (data && data.length > 0) {
      const totalBilled = (data as any[]).reduce((acc: number, inv: any) => acc + Number(inv.total_amount), 0);
      const totalPaid = (data as any[]).reduce((acc: number, inv: any) => acc + Number(inv.paid_amount), 0);
      return {
        totalBilled,
        totalPaid,
        balanceDue: totalBilled - totalPaid,
        invoices: data as FeeInvoice[],
      };
    }
  }

  const invoices = mockInvoices.filter((inv) => inv.student_id === studentId || inv.student_id === 'std00000-0000-0000-0000-000000000001');
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.total_amount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paid_amount, 0);
  return {
    totalBilled,
    totalPaid,
    balanceDue: totalBilled - totalPaid,
    invoices,
  };
}
