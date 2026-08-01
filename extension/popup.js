document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('serverStatus');
  try {
    const res = await fetch('http://localhost:4000/api/tracks', { method: 'GET' });
    if (res.ok) {
      statusEl.className = 'status-badge status-online';
      statusEl.innerText = 'متصل ✅';
    } else {
      statusEl.className = 'status-badge status-offline';
      statusEl.innerText = 'خطأ بالسيرفر';
    }
  } catch (err) {
    statusEl.className = 'status-badge status-offline';
    statusEl.innerText = 'غير متصل ❌';
  }
});
