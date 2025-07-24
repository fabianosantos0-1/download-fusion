import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  subscription_plan_id: string;
  email: string;
  amount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { subscription_plan_id, email, amount }: PaymentRequest = await req.json();

    // Get Mercado Pago access token from settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'mercado_pago_access_token')
      .single();

    const accessToken = settings?.setting_value;
    
    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured');
    }

    // Create payment preference in Mercado Pago
    const preferenceData = {
      items: [
        {
          title: "Gift Card Premium",
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL"
        }
      ],
      payer: {
        email: email
      },
      back_urls: {
        success: `${req.headers.get('origin')}/payment-success`,
        failure: `${req.headers.get('origin')}/payment-failure`,
        pending: `${req.headers.get('origin')}/payment-pending`
      },
      auto_return: "approved",
      external_reference: subscription_plan_id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-webhook`
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      throw new Error(`Mercado Pago API error: ${response.statusText}`);
    }

    const preference = await response.json();

    // Create transaction record
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .insert({
        mercado_pago_id: preference.id,
        subscription_plan_id,
        email,
        amount,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Payment preference created:', preference.id);

    return new Response(JSON.stringify({
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      transaction_id: transaction.id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in mercado-pago-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);