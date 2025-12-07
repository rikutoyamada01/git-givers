
const BASE_URL = 'http://localhost:3005/api/dev';

async function request(action, body = {}) {
  try {
    const res = await fetch(`${BASE_URL}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    console.log(`[${action}] Status: ${res.status}`);
    if (res.status >= 400) {
      console.error('  -> Error:', json);
      return null;
    }
    return json;
  } catch (err) {
    console.error(`[${action}] Network Error:`, err.message);
    process.exit(1);
  }
}

async function run() {
  console.log('--- Database Verification ---');

  // 1. Get Models
  const models = await request('models');
  if (models) console.log('  Models:', models.models);

  // 2. List Users (Should be empty or have existing users)
  const users = await request('list', { model: 'User' });
  if (users) {
      console.log(`  Users Found: ${users.data.length}`);
      if (users.data.length > 0) console.log('  First User:', users.data[0].id);
  }

  // 3. Create Dummy User
  const timestamp = Date.now();
  const dummy = await request('create', {
      model: 'User',
      data: {
          name: `DevTest ${timestamp}`,
          email: `devtest${timestamp}@example.com`
      }
  });

  if (dummy) {
      console.log('  Created User:', dummy.data);
      const newId = dummy.data.id;

      // 4. Update Dummy User
      const updated = await request('update', {
          model: 'User',
          id: newId,
          data: { karma: 9999 }
      });
      if (updated) console.log('  Updated Karma:', updated.data.karma);

      // 5. Delete Dummy User
      const deleted = await request('delete', {
          model: 'User',
          id: newId
      });
      if (deleted) console.log('  Deleted User:', deleted.data.id);
  } else {
      console.error('  Failed to create user, skipping update/delete tests.');
  }

  console.log('--- Done ---');
}

run();
