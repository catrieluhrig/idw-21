const botonTurnos = document.getElementById("botonTurnos");
const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success")
const tablaTurnosBody = document.getElementById("#tablaTurnos tbody")
let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
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
}
)

if(turnosExistentes){
    turnosExistentes.forEach((turno, index) => {
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

nombres()