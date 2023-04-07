window.onscroll = function() {cambiarColorNavbar()};

function cambiarColorNavbar() {
  var navbar = document.getElementById("mi-nav");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navbar.style.backgroundColor = "#94007A";
  } else {
    navbar.style.backgroundColor = "transparent";
  }
}