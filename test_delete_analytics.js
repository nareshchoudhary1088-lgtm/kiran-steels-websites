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
  const { data, error } = await supabase.from('analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Delete Error:', error);
  console.log('Delete Data:', data);
}
run();
