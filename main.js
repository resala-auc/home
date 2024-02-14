const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('clicked');
  navbarLinks.classList.toggle('active');
})
navbarLinks.addEventListener('click', ( ) => {
  console.log('item clicked');
  toggleButton.click();
});
