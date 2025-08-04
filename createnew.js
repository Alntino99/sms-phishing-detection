document.getElementById('postForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  // Generate a unique key for the post
  const postKey = `post_${Date.now()}`;

  // Save post in local storage
  localStorage.setItem(postKey, JSON.stringify({ title, content }));

  alert('Post saved locally!');
  document.getElementById('postForm').reset(); // Clear the form
});
