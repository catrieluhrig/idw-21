const botonTurnos = document.getElementById("botonTurnos");
const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success")
let medicos = JSON.parse(localStorage.getItem('medicos')) || [];

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

    const turnosExistentes = JSON.parse(localStorage.getItem("turnos")) || [];
    turnosExistentes.push(turnoData);
    localStorage.setItem("turnos", JSON.stringify(turnosExistentes))

    success.innerHTML = `Turno guardado con exito: ${turnoMedico}, ${turnoFechaHora}, ${turnoNombre}, ${turnoEmail}`
}
)

nombres()