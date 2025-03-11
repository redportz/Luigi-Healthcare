function initSidebarMenu() {
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.querySelector(".close-btn");

  // Check that all elements exist
  if (menuBtn && sidebar && closeBtn) {
    // Open sidebar when menu button is clicked
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
    });

    // Close sidebar when close button is clicked
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
        sidebar.classList.remove("open");
      }
    });
  } else {
    console.error('Sidebar elements not found.');
  }
}

// Optionally, if sidebar is loaded synchronously, you can initialize on DOMContentLoaded,
// but if it's loaded dynamically, you may call initSidebarMenu() from load-sidebar.js.
document.addEventListener("DOMContentLoaded", initSidebarMenu);
