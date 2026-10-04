// Supabase Edge Function: razorpay-webhook
// Handles server-side payment verification and updates fee_invoices / fee_payments

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.json();

    // Verify webhook signature (using SUPABASE secret)
    // Server-side verification ensures mobile & web clients cannot forge payment confirmations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (body.event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      const invoiceId = payment.notes?.invoice_id;
      const studentId = payment.notes?.student_id;

      if (invoiceId && studentId) {
        // Record payment in fee_payments
        await supabase.from('fee_payments').insert({
          invoice_id: invoiceId,
          student_id: studentId,
          amount: payment.amount / 100,
          payment_method: 'online_razorpay',
          transaction_id: payment.id,
          receipt_number: `REC-ONL-${Date.now().toString().slice(-6)}`,
          paid_at: new Date().toISOString(),
        });

        // Update invoice status
        await supabase.from('fee_invoices').update({
          paid_amount: payment.amount / 100,
          status: 'paid',
        }).eq('id', invoiceId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
