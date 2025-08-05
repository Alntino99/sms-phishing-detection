// Check if postList element exists before trying to access it
const postList = document.getElementById('postList');

if (postList) {
  // Loop through all items in local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Check if the key belongs to a post
    if (key.startsWith('post_')) {
      const post = JSON.parse(localStorage.getItem(key));
      const postElement = document.createElement('div');
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content.substring(0, 50)}...</p>
      `;
      postList.appendChild(postElement);
    }
  }
}
