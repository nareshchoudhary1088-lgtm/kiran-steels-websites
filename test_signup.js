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
  console.log("Attempting sign up...");
  const { data, error } = await supabase.auth.signUp({
    email: 'nareshchoudhary1088@gmail.com',
    password: 'Pataram9898&@'
  });
  console.log('Signup error:', error);
  console.log('Signup data:', data);

  if (!error && data.session) {
     console.log("Successfully got session! Email confirmation must be off.");
  }
}
run();
