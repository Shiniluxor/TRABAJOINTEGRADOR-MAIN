window.onscroll = function() {cambiarColorNavbar()};
// window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', () => {
  // Variables
  const baseDeDatos = [
      {
          id: 1,
          nombre: 'Wireframe',
          precio: 912,
          imagen: 'https://jaejohns.com/wp-content/uploads/2019/07/free-wireframe-tool.jpg.webp'
      },
      {
          id: 2,
          nombre: 'Diseño Grafico',
          precio: 725,
          imagen: 'https://media.istockphoto.com/id/628814432/es/foto/dise%C3%B1ador-gr%C3%A1fico-en-el-trabajo-color-de-las-muestras.jpg?s=612x612&w=0&k=20&c=gaq7vcUoXDaPvmn_6QEi2FR9Y11BLY9_4tmrVWUVeLw='
      },
      {
          id: 3,
          nombre: 'Frontend',
          precio: 1000,
          imagen: 'https://kodus.io/wp-content/uploads/2020/07/16.jpg'
      },
      {
          id: 4,
          nombre: 'Javascript',
          precio: 278,
          imagen: 'https://www.adictosaltrabajo.com/wp-content/uploads/2018/05/el_remozado_javascript.imagen.jpg'
      },
      {
          id: 5,
          nombre: 'Backend',
          precio: 279,
          imagen: 'https://tuyendung.kfcvietnam.com.vn/Data/Sites/1/News/268/lap-trinh-back-end.jpg'
      },
      {
          id: 6,
          nombre: 'Sysadmin',
          precio: 275,
          imagen: 'https://www.computersciencedegreehub.com/wp-content/uploads/2020/06/What-is-a-Systems-Administrator-1024x576.jpg'
      }
  ];


  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const divisa = '$';
  const DOMitems = document.querySelector('#items');
  const DOMcarrito = document.querySelector('#carrito');
  const DOMtotal = document.querySelector('#total');
  const DOMbotonVaciar = document.querySelector('#boton-vaciar');

  // Funciones

  /**
  * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
  */
  function renderizarProductos() {
      baseDeDatos.forEach((info) => {
          // Estructura
          const miNodo = document.createElement('div');
          miNodo.classList.add('card', 'col-sm-4');
          // Body
          const miNodoCardBody = document.createElement('div');
          miNodoCardBody.classList.add('card-body');
          // Titulo
          const miNodoTitle = document.createElement('h5');
          miNodoTitle.classList.add('card-title');
          miNodoTitle.textContent = info.nombre;
          // Imagen
          const miNodoImagen = document.createElement('img');
          miNodoImagen.classList.add('img-fluid');
          miNodoImagen.setAttribute('src', info.imagen);
          // Precio
          const miNodoPrecio = document.createElement('p');
          miNodoPrecio.classList.add('card-text');
          miNodoPrecio.textContent = `${info.precio} ${divisa}`;
          // Boton 
          const miNodoBoton = document.createElement('button');
          miNodoBoton.classList.add('btn', 'btn-primary', 'btn-item-carrito');
          miNodoBoton.textContent = 'Agregar', '-';
          miNodoBoton.setAttribute('marcador', info.id);
          miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);


          /* Swal.fire({
              title: "Bienvenido Gracias Por Elegirnos",
              text: "Inicie su Compra",
              imageUrl: "https://revertia.com/wp-content/uploads/2014/01/1339221557612-10026808-icono-de-carrito-de-compras.jpg",
              imageWidth: 200,
              imageHeight: 200,
              icon: "Continuar",
              confirmBottonText: "Gracias",
              timer: 8000

          }) */
          // Insertamos
          miNodoCardBody.appendChild(miNodoImagen);
          miNodoCardBody.appendChild(miNodoTitle);
          miNodoCardBody.appendChild(miNodoPrecio);
          miNodoCardBody.appendChild(miNodoBoton);
          miNodo.appendChild(miNodoCardBody);
          DOMitems.appendChild(miNodo);
      });
  }

  /**
  * Evento para añadir un producto al carrito de la compra
  */
  function anyadirProductoAlCarrito(evento) {
      // Anyadimos el Nodo a nuestro carrito
      carrito.push(evento.target.getAttribute('marcador'))
      // Actualizamos el carrito 
      renderizarCarrito();
      saveLocal();
  }

  /**
  * Dibuja todos los productos guardados en el carrito
  */
  function renderizarCarrito() {
      // Vaciamos todo el html
      DOMcarrito.textContent = '';
      // Quitamos los duplicados
      const carritoSinDuplicados = [...new Set(carrito)];
      // Generamos los Nodos a partir de carrito
      carritoSinDuplicados.forEach((item) => {
          // Obtenemos el item que necesitamos de la variable base de datos
          const miItem = baseDeDatos.filter((itemBaseDatos) => {
              // ¿Coincide las id? Solo puede existir un caso
              return itemBaseDatos.id === parseInt(item);
          });
          // Cuenta el número de veces que se repite el producto
          const numeroUnidadesItem = carrito.reduce((total, itemId) => {
              // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
              return itemId === item ? total += 1 : total;
          }, 0);
          // Creamos el nodo del item del carrito
          const miNodo = document.createElement('li');
          miNodo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'text-right', 'mx-2');
          miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
          // Boton de borrar
          const miBoton = document.createElement('button');
          miBoton.classList.add('btn', 'btn-danger', 'mx-5');
          miBoton.textContent = 'X';
          miBoton.style.marginLeft = '1rem';
          miBoton.dataset.item = item;
          miBoton.addEventListener('click', borrarItemCarrito);
          // Mezclamos nodos
          miNodo.appendChild(miBoton);
          DOMcarrito.appendChild(miNodo);
      });
      // Renderizamos el precio total en el HTML
      DOMtotal.textContent = calcularTotal();
  }

  /**
  * Evento para borrar un elemento del carrito
  */
  function borrarItemCarrito(evento) {
      // Obtenemos el producto ID que hay en el boton pulsado
      const id = evento.target.dataset.item;
      // Borramos todos los productos
      carrito = carrito.filter((carritoId) => {
          return carritoId !== id;
      });
      // volvemos a renderizar
      renderizarCarrito();
      saveLocal();
  }

  /**
   * Calcula el precio total teniendo en cuenta los productos repetidos
   */
  function calcularTotal() {
      // Recorremos el array del carrito 
      return carrito.reduce((total, item) => {
          // De cada elemento obtenemos su precio
          const miItem = baseDeDatos.filter((itemBaseDatos) => {
              return itemBaseDatos.id === parseInt(item);
          });
          // Los sumamos al total
          return total + miItem[0].precio;
      }, 0).toFixed(2);
  }

  /**
  * Varia el carrito y vuelve a dibujarlo
  */
  function vaciarCarrito() {
      // Limpiamos los productos guardados
      carrito = [];
      // Renderizamos los cambios
      renderizarCarrito();
  }

  // Eventos
  DOMbotonVaciar.addEventListener('click', vaciarCarrito);

  // Inicio
  renderizarProductos();
  renderizarCarrito();

  //set item
  const saveLocal = () => {
      localStorage.setItem('carrito', JSON.stringify(carrito));
  };
  //get item 
  JSON.parse(localStorage.getItem('carrito'))
});

function cambiarColorNavbar() {
  var navbar = document.getElementById("mi-nav");
  var anchors = document.querySelectorAll(".navbar .navbar-brand");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navbar.style.backgroundColor = "#3535E3";
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


function validarFormulario() {
  var nombre = document.getElementById("nombres");
  var telefono = document.getElementById("telefono");
  var correo = document.getElementById("correo");
  var mensaje = document.getElementById("msn");
  var terminos = document.getElementById("mi-input");

  var nombreError = document.getElementById("nombreError");
  var telefonoError = document.getElementById("telefonoError");
  var correoError = document.getElementById("correoError");
  var mensajeError = document.getElementById("mensajeError");
  var terminosError = document.getElementById("terminosError");

  nombreError.innerHTML = "";
  telefonoError.innerHTML = "";
  correoError.innerHTML = "";
  mensajeError.innerHTML = "";
  terminosError.innerHTML = "";

  if (nombre.value.trim() == "") {
      nombreError.innerHTML = "Por favor, ingrese su nombre y apellido";
      return false;
  }

  if (telefono.value.trim() == "") {
      telefonoError.innerHTML = "Por favor, ingrese su número de teléfono";
      return false;
  }

  if (correo.value.trim() == "") {
      correoError.innerHTML = "Por favor, ingrese su dirección de correo electrónico";
      return false;
  }

  if (mensaje.value.trim() == "") {
      mensajeError.innerHTML = "Por favor, ingrese su mensaje";
      return false;
  }

  if (correo.value.indexOf("@") == -1) {
      correoError.innerHTML = "Por favor, ingrese una dirección de correo electrónico válida";
      return false;
  }

  if (!document.getElementById("check-terminos").checked) {
    document.getElementById("terminosError").innerHTML = "Debe aceptar los términos y condiciones";
    return false;
  }

  return true;
}

var form = document.getElementById("contactForm");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // previene que el formulario se envíe
  mostrarPrevisualizacion();
});

document.getElementById("btn-exportar-pdf").addEventListener("click", generarPDF);

function mostrarResumen() {
  // Obtener los valores de los campos del formulario
  var nombre = document.getElementById("nombres").value.trim();
  var telefono = document.getElementById("telefono").value.trim();
  var correo = document.getElementById("correo").value.trim();
  var mensaje = document.getElementById("msn").value.trim();

  // Validar que los campos no estén vacíos
  if (nombre === "" || telefono === "" || correo === "" || mensaje === "") {
      alert("Por favor, complete todos los campos antes de enviar el formulario.");
      return;
  }

  // Crear el resumen del formulario
  var resumen = "<h3 class='titulo-resumen'>Resumen del formulario</h3>" +
                "<div class='contenedor-resumen'>"+
                "<p><strong>Nombre y Apellido:</strong> " + nombre + "</p>" +
                "<p><strong>Teléfono:</strong> " + telefono + "</p>" +
                "<p><strong>Correo electrónico:</strong> " + correo + "</p>" +
                "<p><strong>Mensaje:</strong> " + mensaje + "</p> " +
                "<button class='boton' onclick='generarPDF()' id='btn-exportar-pdf'>Exportar a PDF</button> </div> <div id='elementH'></div>";

  // Mostrar el resumen en el elemento con el id "resumen"
  document.getElementById("resumen").innerHTML = resumen;

  // Agregar event listener al botón para exportar a PDF
  // document.getElementById("btn-exportar-pdf").addEventListener("click", generarPDF);  
  // document.getElementById("btn-generar-pdf").addEventListener("click", function() {
  //   generarPDF();
  // });
}


function generarPDF() {
  const { jsPDF } = window.jspdf;
  // Crear una instancia de jsPDF
  const doc = new jsPDF();
  // Obtener el elemento que contiene el resumen
  var resumen = document.getElementById("resumen").innerHTML;  
  // Generar el PDF
  // var elementHTML = $('#resumen').html();
  // var specialElementHandlers = {
  //     '#elementH': function (element, renderer) {
  //         return true;
  //     }
  // };
  // doc.fromHTML(elementHTML, 15, 15, {
  //     'width': 170,
  //     'elementHandlers': specialElementHandlers
  // });
  doc.fromHTML(resumen, 15, 15, {
      'width': 170
  });

  // Descargar el PDF con el nombre "formulario.pdf"
  doc.save("formulario.pdf");
}
