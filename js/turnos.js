const botonTurnos = document.getElementById("botonTurnos");
const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success")
const tablaTurnosBody = document.getElementById("#tablaTurnos tbody")
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

const medicos = [...medicosPrecargados, ...(JSON.parse(localStorage.getItem('medicos')) || [])];

const turnosExistentes = JSON.parse(localStorage.getItem("turnos")) || [];

function nombres(){
    medicos.forEach((medico) => {
        const option = document.createElement("option");
        option.textContent = `${medico.nombre} - ${medico.especialidad}`;
        option.value = medico.nombre;
        dropdown.appendChild(option);
})
}

turnoSubmit.addEventListener("submit", e => {
    e.preventDefault();

    const turnoMedico = document.getElementById("medicos-dropdown").value;
    const turnoFechaHora = document.getElementById("turno-fechahora").value;
    const turnoNombre= document.getElementById("turno-nombre").value;
    const turnoEmail = document.getElementById("turno-email").value;

    const turnoData = {
        turnoMedico,
        turnoFechaHora,
        turnoNombre,
        turnoEmail,
    }

    
    turnosExistentes.push(turnoData);
    localStorage.setItem("turnos", JSON.stringify(turnosExistentes))

    success.innerHTML = `Turno guardado con exito: ${turnoMedico}, ${turnoFechaHora}, ${turnoNombre}, ${turnoEmail}`
    renderTurnos()
}
)

function renderTurnos(){
if(turnosExistentes){
    turnosExistentes.forEach((turno) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>
            ${turno.turnoMedico}
            </td>
            <td>
            ${turno.turnoFechaHora}
            </td>
            <td>
            ${turno.turnoNombre}
            </td>
            <td>
            ${turno.turnoEmail}
            </td>`
            tablaTurnos.appendChild(row)
        })
    }
}
nombres()

const PRECIOS_POR_ESPECIALIDAD = {
  "Cardiología": 2500,
  "Neumonólogo": 2200,
  "Radióloga": 2000,
  "Medicina General": 1500,
};

const PORCENTAJE_PAGO_CON_OS = 0.60; // Paciente paga el 60% si tiene obra social

function obtenerPrecioPorEspecialidad(especialidad) {
  return PRECIOS_POR_ESPECIALIDAD[especialidad] ?? 1500;
}

function obtenerEspecialidadPorMedico(nombreMedico) {
  const doctor = medicosPrecargados.find(m => m.nombre === nombreMedico);
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
      <div class="card mx-auto" style="max-width:520px;">
        <div class="card-body">
          <h5 class="card-title text-center">Valor de la consulta</h5>
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

  if (!doctor) return alert("Debe seleccionar un médico.");
  if (!fecha) return alert("Debe seleccionar día y horario.");

  const tieneObraSocial = confirm("¿Tiene obra social?");

  mostrarValorConsultaEnPantalla(doctor, tieneObraSocial);

  const turno = {
    turnoMedico: doctor,
    turnoFecha: fecha,
    turnoNombre: nombre,
    turnoEmail: email,
    obraSocial: tieneObraSocial
  };

  let turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];
  turnosGuardados.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnosGuardados));

  e.target.reset();
  renderTurnos();
});

document.getElementById("medicos-dropdown").addEventListener("change", (e) => {
  const doctor = e.target.value;
  if (doctor !== "") {
    mostrarValorConsultaEnPantalla(doctor, false);
  } else {
    document.getElementById("consultaValor").innerHTML = "";
  }
});
