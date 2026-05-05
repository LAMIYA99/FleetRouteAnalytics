async function testLogin() {
  const url = 'https://dev-app.geekbro.ai/be-service/api/auth/login';
  const passwords = [
    '9884QZOGlogB',
    '9884QZOGIogB',
    '9884QZ0GlogB',
    '9884QZ0GIogB',
    '9884QZOG1ogB'
  ];
  for (const p of passwords) {
    try {
      console.log(`Trying password ${p}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: 'lamiyealizade',
          password: p
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Success! Token:', data);
        return;
      } else {
        const text = await res.text();
        console.log(`Failed ${p}: ${res.status}`, text);
      }
    } catch (e) {
      console.error(`Error with ${p}:`, e.message);
    }
  }
}
testLogin();
