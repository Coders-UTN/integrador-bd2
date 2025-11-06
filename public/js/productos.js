document.addEventListener("DOMContentLoaded", () => {
  // URLs de las APIs (ajusta el puerto si es necesario)
  const PRODUCTOS_API = "http://localhost:3000/api/productos";
  const CATEGORIAS_API = "http://localhost:3000/api/categorias";

  // Elementos del DOM
  const form = document.getElementById("form-crear-producto");
  const errorDiv = document.getElementById("producto-error");
  const listaProductosDiv = document.getElementById("lista-productos");
  const categoriaSelect = document.getElementById("producto-categoria");

  // --- 1. FUNCIÓN PARA CARGAR CATEGORÍAS EN EL <select> ---
  const cargarCategorias = async () => {
    try {
      // Asumimos que GET /api/categorias es público
      const respuesta = await fetch(CATEGORIAS_API);
      if (!respuesta.ok) throw new Error("No se pudo cargar las categorías");

      const categorias = await respuesta.json();

      categoriaSelect.innerHTML =
        '<option value="" disabled selected>Selecciona una categoría</option>';

      categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat._id; // Guardamos el ID
        option.textContent = cat.nombre; // Mostramos el nombre
        categoriaSelect.appendChild(option);
      });
    } catch (error) {
      console.error(error);
      categoriaSelect.innerHTML =
        '<option value="" disabled>Error al cargar categorías</option>';
    }
  };

  // --- 2. FUNCIÓN PARA CARGAR Y MOSTRAR PRODUCTOS (GET /productos) ---
  const cargarProductos = async () => {
    try {
      // Asumimos que GET /api/productos es público
      const respuesta = await fetch(PRODUCTOS_API);
      if (!respuesta.ok) throw new Error("No se pudieron cargar los productos");

      const objectResponse = await respuesta.json();
      const productos = objectResponse.data;
      console.log(productos);
      listaProductosDiv.innerHTML = ""; // Limpiar lista

      if (productos.length === 0) {
        listaProductosDiv.innerHTML =
          '<p class="text-muted">No hay productos creados.</p>';
        return;
      }

      productos.forEach((producto) => {
        // Verificamos que 'categoria' fue populado y es un objeto
        const categoriaNombre =
          producto.categoria && producto.categoria.nombre
            ? producto.categoria.nombre
            : "Sin Categoría";

        const cardHtml = `
          <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Categoría: ${categoriaNombre}</h6>
                <p class="card-text">
                  <strong>Precio:</strong> $${
                    producto.precio
                  } | <strong>Stock:</strong> ${producto.stock}
                </p>
                <p class="card-text small text-muted">
                  Marca: ${producto.marca || "N/A"}
                </p>
                <button class="btn btn-outline-danger btn-sm btn-borrar" data-id="${
                  producto._id
                }">
                Borrar (DELETE)
              </button>
                </div>
            </div>
          </div>`;
        listaProductosDiv.innerHTML += cardHtml;
      });
    } catch (error) {
      console.error(error);
      listaProductosDiv.innerHTML =
        '<p class="text-danger">Error al cargar productos.</p>';
    }
  };

  // --- 3. EVENTO SUBMIT DEL FORMULARIO (POST /productos) ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.classList.add("d-none"); // Ocultar error

    // Obtener el token de admin/usuario
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para crear un producto.");
      return;
    }

    // Recolectar datos del formulario
    const datosProducto = {
      nombre: document.getElementById("producto-nombre").value,
      categoria: document.getElementById("producto-categoria").value, // Esto envía el ID
      descripcion: document.getElementById("producto-descripcion").value,
      precio: Number(document.getElementById("producto-precio").value),
      stock: Number(document.getElementById("producto-stock").value),
      marca: document.getElementById("producto-marca").value,
    };

    // Validar que la categoría fue seleccionada
    if (!datosProducto.categoria) {
      errorDiv.textContent = "Por favor, selecciona una categoría.";
      errorDiv.classList.remove("d-none");
      return;
    }

    try {
      const respuesta = await fetch(PRODUCTOS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ¡Enviar el token!
        },
        body: JSON.stringify(datosProducto),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        // "data.error" o "data.message" depende de tu API
        throw new Error(
          data.error || data.message || "Error al crear el producto"
        );
      }

      // ¡Éxito!
      form.reset(); // Limpiar formulario
      await cargarProductos(); // Recargar la lista de productos
    } catch (error) {
      console.error(error);
      errorDiv.textContent = error.message;
      errorDiv.classList.remove("d-none");
    }
  });

  // --- 4. FUNCIÓN PARA BORRAR (DELETE /:id) ---
  const borrarProducto = async (id) => {
    // Pedir confirmación
    if (!confirm(`¿Estás seguro de que quieres borrar este producto?`)) {
      return;
    }

    // Obtener token (¡DELETE es una ruta privada!)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Necesitas estar logueado como admin");
      return;
    }

    try {
      const respuesta = await fetch(`${PRODUCTOS_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!respuesta.ok) {
        const data = await respuesta.json();
        throw new Error(data.error || "No se pudo borrar el producto");
      }

      // ¡Éxito! Recargar la lista de productos
      await cargarProductos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // --- 5. "OYENTE" GLOBAL PARA BOTONES BORRAR ---
  // (Delegación de eventos)
  listaProductosDiv.addEventListener("click", (e) => {
    // Verificamos si el clic fue en un botón con la clase 'btn-borrar'
    if (e.target.classList.contains("btn-borrar")) {
      const id = e.target.dataset.id; // Obtenemos el ID que guardamos
      borrarProducto(id);
    }
  });

  // --- 6. LÓGICA PARA CARGAR TOP RESEÑAS (GET /top) ---
  const btnTop = document.getElementById("btn-top-productos");
  const listaTopDiv = document.getElementById("lista-top");

  btnTop.addEventListener("click", async () => {
    try {
      // GET /top es pública, no necesita token
      const respuesta = await fetch(`${PRODUCTOS_API}/top`);
      if (!respuesta.ok) {
        const data = await respuesta.json();
        throw new Error(data.error || "No se pudo cargar el top");
      }

      const objectResponse = await respuesta.json();
      topProductos = objectResponse.data;

      // Limpiar y mostrar
      listaTopDiv.innerHTML = "<h4>Top 10 Productos por Reseñas:</h4>";

      if (topProductos.length === 0) {
        listaTopDiv.innerHTML +=
          '<p class="text-muted">No hay productos con reseñas.</p>';
      }

      topProductos.forEach((producto) => {
        const item = document.createElement("a");
        item.className = "list-group-item list-group-item-action";
        item.innerHTML = `
        <strong>${producto.nombre}</strong>
        <span class="badge bg-primary rounded-pill">
          ${producto.cantidadResenas || 0} reseñas
        </span>`;
        listaTopDiv.appendChild(item);
      });

      listaTopDiv.classList.remove("d-none"); // Mostrar la lista
    } catch (error) {
      console.error(error);
      listaTopDiv.innerHTML = `<p class="text-danger">${error.message}</p>`;
      listaTopDiv.classList.remove("d-none");
    }
  });

  // --- LLAMADAS INICIALES ---
  // Al cargar la página, llenamos todo
  cargarCategorias();
  cargarProductos();
});
