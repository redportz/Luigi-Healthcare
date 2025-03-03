// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.querySelector(".close-btn");
  
    // Open sidebar when menu button is clicked
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  
    // Close sidebar when close button is clicked
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  
    // Optionally, close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
      // If click is outside sidebar and outside menu button, close the sidebar
      if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
        sidebar.classList.remove("open");
      }
    });
  });
  