const botonTurnos = document.getElementById("botonTurnos");
const dropdown = document.getElementById("medicos-dropdown");
const turnoSubmit = document.getElementById("turno-submit");
const success = document.getElementById("success")
const tablaTurnosBody = document.querySelector("#tablaTurnos tbody") 

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

    if (!turnoMedico) {
        alert("Por favor, selecciona un médico.");
        return;
    }
    
    const turnoData = {
        turnoMedico,
        turnoFechaHora,
        turnoNombre,
        turnoEmail,
    }

    
    turnosExistentes.push(turnoData);
    localStorage.setItem("turnos", JSON.stringify(turnosExistentes))

    success.innerHTML = `Turno guardado con exito: ${turnoMedico}, ${turnoFechaHora}, ${turnoNombre}, ${turnoEmail}`
    turnoSubmit.reset();
    renderTurnos()
})

function renderTurnos(){
    tablaTurnosBody.innerHTML = ''; 

    if(turnosExistentes.length > 0){
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
                tablaTurnosBody.appendChild(row) 
            })
    }
}

nombres()
renderTurnos()