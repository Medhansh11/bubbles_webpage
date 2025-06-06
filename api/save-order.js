import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for backend only!
);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const {
    customer_name,
    customer_email,
    customer_address,
    customer_city,
    customer_zip,
    customer_country,
    cart,
    total,
    status,
    payment_id
  } = req.body;

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_name,
      customer_email,
      customer_address,
      customer_city,
      customer_zip,
      customer_country,
      cart,
      total,
      status: status || 'pending',
      payment_id: payment_id || null
    }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ success: true, data });
}; 