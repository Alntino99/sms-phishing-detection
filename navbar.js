const showBtn = document.getElementById("showBtn");
const hideBtn = document.getElementById("hideBtn");
const navList = document.getElementById("nav-list");

// Only add event listeners if elements exist
if (showBtn && hideBtn && navList) {
  showBtn.addEventListener("click", function(){
    showBtn.classList.add("active");
    navList.classList.add("active");
    hideBtn.classList.add("active");
  });

  hideBtn.addEventListener("click", function(){
    showBtn.classList.remove("active");
    navList.classList.remove("active");
    hideBtn.classList.remove("active");
  });
}