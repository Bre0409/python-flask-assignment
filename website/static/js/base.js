document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbar');

  if (toggler && navbarCollapse) {
    const toggleNav = () => {
      navbarCollapse.classList.toggle('show');
    };

    toggler.addEventListener('click', toggleNav);
    toggler.addEventListener('touchstart', (e) => {
      e.preventDefault(); // prevent double firing on some touch devices
      toggleNav();
    });
  }
});
