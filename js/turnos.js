const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success");
const tablaTurnosBody = document.querySelector("#tablaTurnos tbody");
const selectObraSocial = document.getElementById("tieneObraSocial")

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

function renderTurnos(){
    tablaTurnosBody.innerHTML = ''; 

    turnos.forEach((turno, index) => {
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
        </td>
        <td>
        ${turno.precioFinal}
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${index})">Eliminar</button>
        </td>`
        tablaTurnosBody.appendChild(row)
    })
}

window.eliminarTurno = function(index) {
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      turnos.splice(index, 1);
      localStorage.setItem("turnos", JSON.stringify(turnos));
      renderTurnos();
    }
  };

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

function obtenerEspecialidadPorMedico(nombreMedico) {
  const doctor = allMedicos.find(m => m.nombre === nombreMedico);
  return doctor ? doctor.especialidad : "Medicina General";
}

function calcularValorConsulta(nombreMedico) {
  const especialidad = obtenerEspecialidadPorMedico(nombreMedico);
  const precioBase = obtenerPrecioPorEspecialidad(especialidad);
  const precioFinal = Math.round(precioBase * (selectObraSocial.selectedIndex !== 0  ? PORCENTAJE_PAGO_CON_OS : 1));

  return { especialidad, precioBase, precioFinal };
}

function mostrarValorConsultaEnPantalla(nombreMedico, tieneObraSocial = false) {
  const resultado = calcularValorConsulta(nombreMedico, tieneObraSocial);

  const contenedor = document.getElementById("consultaValor");
  contenedor.innerHTML = `
      <div class="card mx-auto p-3 shadow consultaValorContainer">
        <div class="card-body">
          <h5 class="card-title text-center mb-3">Valor de la consulta</h5>
          <p><strong>Médico:</strong> ${nombreMedico}</p>
          <p><strong>Especialidad:</strong> ${resultado.especialidad}</p>
          <p><strong>Precio base:</strong> $${resultado.precioBase}</p>
          <p><strong>A pagar:</strong> $${resultado.precioFinal} ${selectObraSocial.selectedIndex !==0 ? '(con obra social)' : ''}</p>
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
  const obraSeleccionada = document.getElementById("tieneObraSocial")?.value || false;
  const valorCalc = calcularValorConsulta(doctor, obraSeleccionada)

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
    obraSocial: tieneObraSocial.value,
    precioFinal: valorCalc.precioFinal
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

document.getElementById("tieneObraSocial").addEventListener("change", (e) => {
    const doctor = document.getElementById("medicos-dropdown").value;
    if (doctor !== "") {
        mostrarValorConsultaEnPantalla(doctor, e.target.checked);
    }
});

function obtenerObrasSocialesDelMedico(nombreMedico) {
  tieneObraSocial.innerHTML = "" //Limpia las opciones anteriores
  opcionDefault = document.createElement("option");
  opcionDefault.textContent = "No tengo / Ninguna de las anteriores" //Establece esta opcion default cuando se cambie el medico
  tieneObraSocial.appendChild(opcionDefault)

  const medico = allMedicos.find(m => m && m.nombre === nombreMedico);
  const obras = medico.obrasSociales.split("-")
  obras.forEach(obra => {
    const opt = document.createElement("option");
    opt.value = obra;
    opt.textContent = obra;
    tieneObraSocial.appendChild(opt);
  });
  console.log(obras)
}

function nombres(){
    allMedicos.forEach((medico) => {
        const option = document.createElement("option");
        option.textContent = `${medico.nombre} - ${medico.especialidad}`;
        option.value = medico.nombre;
        dropdown.appendChild(option);
    })
}

document.getElementById("medicos-dropdown").addEventListener("change", (e) => {
  const doctor = e.target.value;
  if (doctor !== "") {
    mostrarValorConsultaEnPantalla(doctor, document.getElementById("tieneObraSocial")?.value || false);
    obtenerObrasSocialesDelMedico(doctor);
  } else {
    document.getElementById("consultaValor").innerHTML = "";
    obtenerObrasSocialesDelMedico("");
  }
});


nombres();
renderTurnos();
obtenerObrasSocialesDelMedico("")