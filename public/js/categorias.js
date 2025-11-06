document.addEventListener("DOMContentLoaded", () => {
  // URL de la API de Categorías (ajusta el puerto si es necesario)
  const API_URL = "http://localhost:3000/api/categorias";

  // Elementos del DOM
  const form = document.getElementById("form-crear-categoria");
  const errorDiv = document.getElementById("categoria-error");
  const listaDiv = document.getElementById("lista-categorias");

  // --- 1. FUNCIÓN PARA CARGAR Y MOSTRAR CATEGORÍAS (GET) ---
  const cargarCategorias = async () => {
    try {
      // (Asumimos que GET /api/categorias es público, si no, debes enviar el token)
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error("Error al cargar la lista de categorías");
      }

      const categorias = await respuesta.json();

      listaDiv.innerHTML = ""; // Limpiar la lista antes de recargar

      if (categorias.length === 0) {
        listaDiv.innerHTML =
          '<p class="text-muted">No hay categorías creadas.</p>';
        return;
      }

      // Crear un item de lista por cada categoría
      categorias.forEach((cat) => {
        const item = document.createElement("div");
        item.className =
          "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
          <div>
            <h5 class="mb-1">${cat.nombre}</h5>
            <small class="text-muted">${
              cat.descripcion || "Sin descripción"
            }</small>
          </div>
          <span class="badge bg-secondary rounded-pill">ID: ${cat._id}</span>
        `;
        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn btn-danger btn-sm";
        btnBorrar.textContent = "Borrar";
        btnBorrar.dataset.id = cat._id; // <-- Guardamos el ID aquí

        // Añadir el listener de click
        btnBorrar.addEventListener("click", () => {
          borrarCategoria(cat._id, cat.nombre);
        });

        item.appendChild(btnBorrar); // Añadimos el botón al item
        listaDiv.appendChild(item); // Añadimos el item a la lista
        listaDiv.appendChild(item);
      });
    } catch (error) {
      console.error(error);
      listaDiv.innerHTML =
        '<p class="text-danger">Error al cargar categorías.</p>';
    }
  };

  // --- 2. EVENTO SUBMIT DEL FORMULARIO (POST) ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que la página se recargue
    errorDiv.classList.add("d-none"); // Ocultar errores previos

    // Obtener el token (¡necesario para crear!)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para crear una categoría.");
      return;
    }

    // Obtener datos del formulario
    const nombre = document.getElementById("categoria-nombre").value;
    const descripcion = document.getElementById("categoria-descripcion").value;

    try {
      // Llamar a la API para crear
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token
        },
        body: JSON.stringify({ nombre, descripcion }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        // Mostrar error (ej. "ya existe esa categoría")
        throw new Error(
          data.error || data.message || "Error al crear la categoría"
        );
      }

      // ¡Éxito!
      form.reset(); // Limpiar el formulario
      await cargarCategorias(); // ¡Recargar la lista dinámicamente!
    } catch (error) {
      console.error(error);
      errorDiv.textContent = error.message;
      errorDiv.classList.remove("d-none"); // Mostrar el div de error
    }
  });

  // --- 3. LLAMADA INICIAL ---

  // --- 4. LÓGICA PARA CARGAR ESTADÍSTICAS (GET /stats) ---
  const btnStats = document.getElementById("btn-cargar-stats");
  const statsDiv = document.getElementById("stats-resultado");

  btnStats.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Necesitas estar logueado como admin");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await respuesta.json();
      if (!respuesta.ok) throw new Error(data.error || "Error al cargar stats");

      // Formatear la respuesta (que es un array)
      let statsHtml = "<strong>Productos por Categoría:</strong><ul>";
      data.forEach((stat) => {
        statsHtml += `<li>${stat.nombre}: ${stat.cantidadProductos}</li>`;
      });
      statsHtml += "</ul>";

      statsDiv.innerHTML = statsHtml;
      statsDiv.classList.remove("d-none");
    } catch (error) {
      console.error(error);
      statsDiv.innerHTML = error.message;
      statsDiv.classList.add("alert-danger");
      statsDiv.classList.remove("d-none");
    }
  });

  // --- 5. FUNCIÓN PARA BORRAR (DELETE /:id) ---
const borrarCategoria = async (id, nombre) => {
  // Pedir confirmación
  if (!confirm(`¿Estás seguro de que quieres borrar la categoría "${nombre}"?`)) {
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Necesitas estar logueado como admin');
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!respuesta.ok) {
      const data = await respuesta.json();
      throw new Error(data.error || 'No se pudo borrar');
    }

    // ¡Éxito! Recargar la lista
    await cargarCategorias(); 

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  // Cargar las categorías en cuanto se abre la página

  cargarCategorias();
});
