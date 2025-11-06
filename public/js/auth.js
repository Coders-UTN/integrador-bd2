document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const loginError = document.getElementById("login-error");

  const formRegistro = document.getElementById("form-registro");
  const registroError = document.getElementById("registro-error");

  // La URL base de tu API de usuarios
  // (Asegúrate que el puerto 3000 sea el correcto)
  const API_URL = "http://localhost:3000/api/usuarios";

  // --- LÓGICA DE LOGIN ---
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginError.classList.add("d-none"); // Ocultar error previo

      // 1. Capturar datos
      const email = document.getElementById("login-email").value;
      const contrasena = document.getElementById("login-contrasena").value;

      try {
        // 2. Llamar a la API (POST /api/usuarios/login)
        const respuesta = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena }),
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(data.error || "Falló el inicio de sesión");
        }
        // 3. ¡ÉXITO! Guardar el token
        localStorage.setItem("token", data.data.token);

        alert("¡Bienvenido! Has iniciado sesión.");
       window.location.href = "/productos.html"; // Redirigir
      } catch (error) {
        // 4. Mostrar error
        loginError.textContent = error.message;
        loginError.classList.remove("d-none");
      }
    });
  }

  // --- LÓGICA DE REGISTRO ---
  if (formRegistro) {
    formRegistro.addEventListener("submit", async (e) => {
      e.preventDefault();
      registroError.classList.add("d-none"); // Ocultar error previo

      // 1. Capturar datos
      const nombre = document.getElementById("reg-nombre").value;
      const apellido = document.getElementById("reg-apellido").value;
      const email = document.getElementById("reg-email").value;
      const direccion = document.getElementById("reg-direccion").value;
      const telefono = document.getElementById("reg-telefono").value;
      const dni = document.getElementById("reg-dni").value;
      const contrasena = document.getElementById("reg-contrasena").value;
      // (Añade 'apellido', 'direccion' si los pusiste en el HTML)

      try {
        // 2. Llamar a la API (POST /api/usuarios)
        const respuesta = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            email,
            contrasena,
            direccion,
            telefono,
            dni
          }),
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          // Ej: "El email ya está en uso"
          throw new Error(data.error || "Falló el registro");
        }

        // 3. ¡ÉXITO!
        alert("¡Registro exitoso! Por favor, inicia sesión.");
        formRegistro.reset(); // Limpiar el formulario

        // Opcional: hacer scroll hacia el login
        formLogin.scrollIntoView();
      } catch (error) {
        // 4. Mostrar error
        registroError.textContent = error.message;
        registroError.classList.remove("d-none");
      }
    });
  }
});
