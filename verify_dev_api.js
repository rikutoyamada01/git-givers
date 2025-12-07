
const BASE_URL = 'http://localhost:3005/api/dev';

async function test(name, url, options, expectedStatus) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    console.log(`[${name}] Status: ${res.status} (Expected: ${expectedStatus})`);
    if (res.status !== expectedStatus) {
      console.error(`  -> FAIL. Body: ${text}`);
      process.exit(1);
    }
    console.log(`  -> PASS. Body: ${text.substring(0, 100)}...`);
  } catch (err) {
    console.error(`[${name}] Network Error:`, err.message);
    process.exit(1);
  }
}

async function run() {
  console.log('--- Starting Verification ---');
  
  // 1. Ping (Valid)
  await test('Ping Valid', `${BASE_URL}/ping`, { method: 'POST' }, 200);

  // 2. Proxy Attack (X-Forwarded-For)
  await test('Proxy Attack', `${BASE_URL}/ping`, { 
    method: 'POST', 
    headers: { 'X-Forwarded-For': '1.2.3.4' } 
  }, 403);

  // 3. Unknown Action
  await test('Unknown Action', `${BASE_URL}/unknown-action`, { method: 'POST' }, 400);

  console.log('--- All Tests Passed ---');
}

run();
