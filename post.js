document.getElementById('commentForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const commentInput = document.getElementById('commentInput').value;
  const commentList = document.getElementById('commentList');
  
  if (commentInput.trim()) {
    const newComment = document.createElement('p');
    newComment.textContent = commentInput;
    commentList.appendChild(newComment);

    document.getElementById('commentInput').value = ''; // Clear the input field
  }
});
let likeCount = 0;

document.getElementById('likeButton').addEventListener('click', () => {
  likeCount += 1;
  document.getElementById('likeCount').textContent = `Likes: ${likeCount}`;
});

document.getElementById('toggleContentButton').addEventListener('click', () => {
  const contentDiv = document.getElementById('fullContent');
  if (contentDiv.style.display === 'none') {
    contentDiv.style.display = 'block';
    document.getElementById('toggleContentButton').textContent = 'Hide Content';
  } else {
    contentDiv.style.display = 'none';
    document.getElementById('toggleContentButton').textContent = 'Show Content';
  }
});
