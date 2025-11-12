document.addEventListener("DOMContentLoaded", async () => {
  const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody");
  const tablaTurnosBody = document.querySelector("#tablaTurnos tbody");

  async function renderUsuarios() {
    try {
      const response = await fetch("https://dummyjson.com/users");

      if (response.ok) {
        const data = await response.json();
        const usuarios = data.users;

        usuarios.forEach((element, index) => {
          const fila = document.createElement("tr");
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
        const errorDiv = document.createElement('tr');
        errorDiv.innerHTML = `<td colspan="4" class="text-danger text-center">Error al cargar la lista de usuarios. Intente más tarde.</td>`;
        tablaUsuariosBody.appendChild(errorDiv);
      }
    } catch (error) {
      const errorDiv = document.createElement('tr');
      errorDiv.innerHTML = `<td colspan="4" class="text-danger text-center">Error de conexión. No se pudieron obtener los usuarios.</td>`;
      tablaUsuariosBody.appendChild(errorDiv);
    }
  }

  function renderTurnosAdmin() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || []; 
    tablaTurnosBody.innerHTML = '';

    if (turnos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center text-muted">No hay turnos agendados.</td>`;
        tablaTurnosBody.appendChild(row);
        return;
    }

    turnos.forEach((turno, index) => {
      const fechaFormateada = turno.turnoFecha ? turno.turnoFecha.replace('T', ' ') : 'Fecha no definida';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${turno.turnoMedico}</td>
        <td>${fechaFormateada}</td>
        <td>${turno.turnoNombre}</td>
        <td>${turno.turnoEmail}</td>
        <td>${turno.obraSocial ? 'Sí' : 'No'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${index})">Eliminar</button>
        </td>
      `;
      tablaTurnosBody.appendChild(row);
    });
  }

  window.eliminarTurno = function(index) {
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      turnos.splice(index, 1);
      localStorage.setItem("turnos", JSON.stringify(turnos));
      renderTurnosAdmin();
    }
  };

  renderUsuarios();
  renderTurnosAdmin();
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