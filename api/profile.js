import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.slice(7);

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, has_paid_access, is_admin')
      .eq('id', user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Profile not found' });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}
