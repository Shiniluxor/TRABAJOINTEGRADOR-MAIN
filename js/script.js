window.onscroll = function() {cambiarColorNavbar()};

function cambiarColorNavbar() {
  var navbar = document.getElementById("mi-nav");
  var anchors = document.querySelectorAll(".navbar .navbar-brand");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navbar.style.backgroundColor = "#94007A";
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].style.color = "#fffff";
    }
  } else {
    navbar.style.backgroundColor = "transparent";
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].style.color = "#ebe8e8f1";
    }
  }
}