const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success");
const tablaTurnosBody = document.querySelector("#tablaTurnos tbody");

const medicosPrecargados = [
    {
        nombre: "Dra. Susana Giménez",
        especialidad: "Cardiología",
        obrasSociales: "OSER - AMUPRO - MEDICUS",
        imagen: "img/susana.jpg"
    },
    {
        nombre: "Dr. Guillermo Francella",
        especialidad: "Neumonólogo",
        obrasSociales: "OSUNER - OSAPMER - Jerárquicos Salud",
        imagen: "img/francella.jpg"
    },
    {
        nombre: "Dra. Mirtha Legrand",
        especialidad: "Radióloga",
        obrasSociales: "Sancor Salud - OSDE - IOSPER",
        imagen: "img/mirta.jpg"
    }
];

const medicosAgregados = JSON.parse(localStorage.getItem('medicos')) || [];
const allMedicos = medicosAgregados.length > 0 ? medicosAgregados : medicosPrecargados;

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

function nombres(){
    allMedicos.forEach((medico) => {
        const option = document.createElement("option");
        option.textContent = `${medico.nombre} - ${medico.especialidad}`;
        option.value = medico.nombre;
        dropdown.appendChild(option);
    })
}

function renderTurnos(){
    tablaTurnosBody.innerHTML = ''; 

    turnos.forEach((turno) => {
        const fechaFormateada = turno.turnoFecha ? turno.turnoFecha.replace('T', ' ') : 'Fecha no definida';
        const row = document.createElement('tr');
        row.innerHTML = `<td>
        ${turno.turnoMedico}
        </td>
        <td>
        ${fechaFormateada}
        </td>
        <td>
        ${turno.turnoNombre}
        </td>
        <td>
        ${turno.turnoEmail}
        </td>`
        tablaTurnosBody.appendChild(row)
    })
}

const PRECIOS_POR_ESPECIALIDAD = {
  "Cardiología": 2500,
  "Neumonólogo": 2200,
  "Radióloga": 2000,
  "Medicina General": 1500,
};

const PORCENTAJE_PAGO_CON_OS = 0.60;

function obtenerPrecioPorEspecialidad(especialidad) {
  return PRECIOS_POR_ESPECIALIDAD[especialidad] ?? 1500;
}

function obtenerObrasSocialesDelMedico() {
  const obrasSociales = allMedicos.obrasSociales
}

function obtenerEspecialidadPorMedico(nombreMedico) {
  const doctor = allMedicos.find(m => m.nombre === nombreMedico);
  return doctor ? doctor.especialidad : "Medicina General";
}

function calcularValorConsulta(nombreMedico, tieneObraSocial) {
  const especialidad = obtenerEspecialidadPorMedico(nombreMedico);
  const precioBase = obtenerPrecioPorEspecialidad(especialidad);
  const precioFinal = Math.round(precioBase * (tieneObraSocial ? PORCENTAJE_PAGO_CON_OS : 1));

  return { especialidad, precioBase, precioFinal };
}

function mostrarValorConsultaEnPantalla(nombreMedico, tieneObraSocial = false) {
  const resultado = calcularValorConsulta(nombreMedico, tieneObraSocial);

  const contenedor = document.getElementById("consultaValor");
  contenedor.innerHTML = `
      <div class="card mx-auto p-3 shadow" style="max-width:520px; border: 1px solid #ccc;">
        <div class="card-body">
          <h5 class="card-title text-center mb-3">Valor de la consulta</h5>
          <p><strong>Médico:</strong> ${nombreMedico}</p>
          <p><strong>Especialidad:</strong> ${resultado.especialidad}</p>
          <p><strong>Precio base:</strong> $${resultado.precioBase}</p>
          <p><strong>A pagar:</strong> $${resultado.precioFinal} ${tieneObraSocial ? '(con obra social)' : ''}</p>
        </div>
      </div>
  `;
}

document.getElementById("turno-submit").addEventListener("submit", (e) => {
  e.preventDefault();

  const doctor = document.getElementById("medicos-dropdown").value;
  const fecha = document.getElementById("turno-fechahora").value;
  const nombre = document.getElementById("turno-nombre").value;
  const email = document.getElementById("turno-email").value;
  const tieneObraSocial = document.getElementById("tieneObraSocial")?.checked || false; 

  if (!doctor) {
    success.textContent = "Error: Debe seleccionar un médico.";
    success.classList.add('text-danger');
    return;
  }
  if (!fecha) {
    success.textContent = "Error: Debe seleccionar día y horario.";
    success.classList.add('text-danger');
    return;
  }
  
  const turno = {
    turnoMedico: doctor,
    turnoFecha: fecha,
    turnoNombre: nombre,
    turnoEmail: email,
    obraSocial: tieneObraSocial
  };

  turnos.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  const valorCalculado = calcularValorConsulta(doctor, tieneObraSocial);
  
  success.textContent = `Turno guardado con éxito. Doctor: ${doctor}. Costo final: $${valorCalculado.precioFinal}.`;
  success.classList.remove('text-danger');
  success.classList.add('text-success');

  mostrarValorConsultaEnPantalla(doctor, tieneObraSocial);

  e.target.reset();
  renderTurnos();
});

document.getElementById("medicos-dropdown").addEventListener("change", (e) => {
  const doctor = e.target.value;
  if (doctor !== "") {
    mostrarValorConsultaEnPantalla(doctor, document.getElementById("tieneObraSocial")?.checked || false);
  } else {
    document.getElementById("consultaValor").innerHTML = "";
  }
});

document.getElementById("tieneObraSocial").addEventListener("change", (e) => {
    const doctor = document.getElementById("medicos-dropdown").value;
    if (doctor !== "") {
        mostrarValorConsultaEnPantalla(doctor, e.target.checked);
    }
});

nombres();
renderTurnos();