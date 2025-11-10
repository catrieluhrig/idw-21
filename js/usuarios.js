document.addEventListener("DOMContentLoaded", async () => {
  const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody");

  try {
    const response = await fetch("https://dummyjson.com/users");

    if (response.ok) {
      const data = await response.json();
      const usuarios = data.users;

      usuarios.forEach((element, index) => {
        const fila = document.createElement("tr");

        // Crear un id único para cada input de contraseña
        const inputId = `password-${index}`;
        const eyeId = `eye-${index}`;

        fila.innerHTML = `
          <td>${element.firstName} ${element.lastName}</td>
          <td>${element.username}</td>
          <td>
            <div class="password-container">
              <input type="password" value="${element.password}" id="${inputId}" class="password-field" readonly>
              <button class="btn-eye" type="button" onclick="togglePassword('${inputId}', '${eyeId}')">
                <i class="bi bi-eye-slash" id="${eyeId}"></i>
              </button>
            </div>
          </td>
          <td>${element.email}</td>
          <td>${element.phone}</td>
        `;
        tablaUsuariosBody.appendChild(fila);
      });
    } else {
      console.error("Error HTTP:", response.status);
      throw new Error("No se pudieron obtener los usuarios");
    }

  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    alert("Ocurrió un error al cargar la lista de usuarios");
  }
});

//Función para mostrar/ocultar la contraseña
function togglePassword(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(eyeId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  } else {
    input.type = "password";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  }
}
