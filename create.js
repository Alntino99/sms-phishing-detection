document.getElementById('title').addEventListener('input', (e) => {
  document.getElementById('titleCount').textContent = `Characters: ${e.target.value.length}`;
});

document.getElementById('content').addEventListener('input', (e) => {
  document.getElementById('contentCount').textContent = `Characters: ${e.target.value.length}`;
});
document.getElementById('title').addEventListener('input', (e) => {
  document.getElementById('previewTitle').textContent = e.target.value || 'Your title will appear here';
});

document.getElementById('content').addEventListener('input', (e) => {
  document.getElementById('previewContent').textContent = e.target.value || 'Your content will appear here';
});
