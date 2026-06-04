import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://texfwazdriqnqavoloqt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleGZ3YXpkcmlxbnFhdm9sb3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Nzc2MDgsImV4cCI6MjA4NzM1MzYwOH0.F1rvBnba0JqyDsDZ5DxsWOlrUoPkMfFEBJSYFe7MH4Y'
);

async function run() {
  // 1. Try signup
  console.log('=== Signup admin@solutionsfortier.com ===');
  const r1 = await sb.auth.signUp({ email: 'admin@solutionsfortier.com', password: 'Fortier@Admin2026!' });
  console.log(r1.error ? `ERR: ${r1.error.message}` : `OK user=${r1.data.user?.id} session=${!!r1.data.session}`);

  // 2. Try login existing accounts
  const accounts = [
    { email: 'leaudouce0@gmail.com', password: 'Fortier@Admin2026!' },
    { email: 'leaudouce0@gmail.com', password: 'Honore@Admin2026!' },
    { email: 'info@solutionsfortier.com', password: 'Fortier@Admin2026!' },
    { email: 'info@solutionsfortier.com', password: 'Honore@Admin2026!' },
  ];

  for (const { email, password } of accounts) {
    console.log(`\n=== Login ${email} / ${password.slice(0,8)}... ===`);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      console.log(`ERR: ${error.message}`);
    } else {
      console.log(`OK! User: ${data.user.id}, Email confirmed: ${!!data.user.email_confirmed_at}`);
      await sb.auth.signOut();
    }
  }

  // 3. Send password resets
  console.log('\n=== Envoi reset passwords ===');
  for (const email of ['leaudouce0@gmail.com', 'info@solutionsfortier.com']) {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.solutionsfortier.com/admin'
    });
    console.log(`${email}: ${error ? error.message : 'Email envoyé ✓'}`);
  }
}

run();
