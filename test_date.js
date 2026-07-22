import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if(parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/['"]/g, '');
    env[k] = v;
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_PUBLISHABLE_KEY']);
async function run() {
  const { data, error } = await supabase.from('analytics').select('*').order('created_at', { ascending: false });
  console.log('Error:', error);
  console.log('Total count:', data?.length);

  const now = new Date();
  const today = new Date(now.setHours(0,0,0,0));
  const todayAnalytics = data.filter(a => a && a.created_at && new Date(a.created_at) >= today);
  
  console.log('Today analytics count:', todayAnalytics.length);
  if (todayAnalytics.length > 0) {
    console.log('Today first:', todayAnalytics[0]);
  }
}
run();
