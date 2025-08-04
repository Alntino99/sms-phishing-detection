// Example: Replace 'post_12345' with the actual key to retrieve a specific post
const postKey = 'post_12345'; // Use dynamic keys for real use

// Retrieve post from local storage
const post = JSON.parse(localStorage.getItem(postKey));

if (post) {
  document.getElementById('postTitle').textContent = post.title;
  document.getElementById('postContent').textContent = post.content;
} else {
  alert('Post not found!');
}
