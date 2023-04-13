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


document.addEventListener("DOMContentLoaded", function() {
  const formLogin = document.querySelector('.login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginButton = document.querySelector('.boton-login');
  // const form = document.querySelector('.login-form');
  const alertaError = document.querySelector('#alerta-error');



  // Selecciona el botón de inicio de sesión
  const loginBtn = document.getElementById('btn-login');  

  // Agrega un controlador de eventos de clic al botón
  loginBtn.addEventListener('click', () => {
    // Crea un nuevo elemento div para el modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Agrega el contenido del formulario de inicio de sesión al modal
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Iniciar sesión</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="login-form" action="#" method="get">
              <div class="input-group mb-4">
                <span class="input-group-text" id="basic-addon1">
                  <label for="username" class="form-label">User</label>
                </span>
                <input type="text" id="username" name="username" class="form-control" aria-describedby="basic-addon1" placeholder="Username" aria-label="Username" required>
              </div>
              <div class="input-group mb-4">
                <span class="input-group-text" id="basic-addon1">
                  <label for="password" class="form-label">Pass</label>
                </span>
                <input type="password" id="password" name="password" class="form-control" aria-describedby="basic-addon1" placeholder="Password" aria-label="Password" required>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="inlineFormCheck">
                <label class="form-check-label" for="inlineFormCheck">
                  Remember me
                </label>
              </div>
              <input type="submit" value="Iniciar sesión" class="boton-login">
              </form>
              <div class="alert alert-danger d-none" id="alerta-error" role="alert">
                  Usuario o contraseña incorrectos.
              </div>
          </div>
        </div>
      </div>
    `;

    // Agrega el modal al contenedor
    var modalContainer = document.getElementById("modal-container");

    if (modalContainer !== null) {
      modalContainer.appendChild(modal);
    }

    // const modalContainer = document.getElementById('modal-container');
    // modalContainer.appendChild(modal);

    // Muestra el modal utilizando la biblioteca de JavaScript Bootstrap
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  });

  loginButton.addEventListener('click', validarLogin);

  
});

function validarLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  fetch('../db/usuarios.json')
  .then(response => response.json())
  .then(data => {
    let usuarioEncontrado = false;
    data.usuarios.forEach(usuario => {
      if (usuario.nombre === username && usuario.contrasena === password) {
        usuarioEncontrado = true;
        alert(`¡Bienvenido, ${username}!`);
        window.location.href = "./index.html";
      }
    });
    if (!usuarioEncontrado) {
      alert('El usuario o la contraseña ingresados no son correctos.');
    }
  })
  .catch(error => console.error(error));
} 

function validarUsuario(event) {
  event.preventDefault();
  
  // Obtener los valores de usuario y contraseña ingresados por el usuario
  const username = usernameInput.value;
  const password = passwordInput.value;
  
  // Realizar la validación del usuario y contraseña contra la base de datos
  fetch('../db/usuarios.json')
  .then(response => response.json())
  .then(data => {
    const usuarios = data.usuarios;
    const usuarioEncontrado = usuarios.find(usuario => usuario.username === username && usuario.password === password);
    
    if (usuarioEncontrado) {
      alert(`Bienvenido, ${usuarioEncontrado.username}!`);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  })
  .catch(error => console.error(error));
}


form.addEventListener('submit', e => {
  e.preventDefault();
  
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  
  // Lógica para verificar si el usuario y la contraseña son correctos
  const usuarioCorrecto = true;
  const passwordCorrecto = false;
  
  if (usuarioCorrecto && passwordCorrecto) {
      // Inicio de sesión exitoso, redirigir al usuario a la página de inicio
      window.location.href = 'index.html';
  } else {
      // Mostrar la alerta de error
      alertaError.classList.remove('d-none');
  }
});