async function testLogin() {
  const urls = [
    'https://dev-app.geekbro.ai/api/auth/login',
    'https://dev-app.geekbro.ai/api/v1/auth/login',
    'https://dev-app.geekbro.ai/auth/login'
  ];
  for (const url of urls) {
    try {
      console.log(`Trying ${url}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'lamiyealizade',
          password: '9884QZOGlogB'
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Success!', data);
        return;
      } else {
        console.log(`Failed ${url}: ${res.status}`, data);
      }
    } catch (e) {
      console.error(`Error ${url}:`, e.message);
    }
  }
}
testLogin();
