const medicoForm = document.getElementById('medicoForm');
const tablaBody = document.querySelector('#tablaMedicos tbody');
const cancelarBtn = document.getElementById('cancelarEdicion');

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
]

let medicos = JSON.parse(localStorage.getItem('medicos')) || medicosPrecargados; 
let editando = false;

function guardarEnLocalStorage() {
    localStorage.setItem('medicos', JSON.stringify(medicos));
}

function renderMedicos() {
    tablaBody.innerHTML = '';
    
    medicos.forEach((medico, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${medico.imagen ? `<img src="${medico.imagen}" alt="Foto" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">` : ''}
            </td>
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.obrasSociales}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarMedico(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarMedico(${index})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(row);
    });
}

window.renderizarCards = function() {
    const contenedorMedicos = document.getElementById('listaMedicos');
    contenedorMedicos.innerHTML = '';

    medicos.forEach(medico => {
        const col = document.createElement('div');
        col.className = 'card-container col-12 col-md-6 col-lg-3 mx-auto mt-5 p-2 rounded-3';

        col.innerHTML = `
            <div class="card h-100 p-2">
                <img src="${medico.imagen || 'img/equipo-medico.png'}" 
                        alt="Foto de ${medico.nombre}" 
                        class="card-img-top w-75 h-50 rounded-3 mb-3 mx-auto">
                <div class="card-body">
                    <h3 class="card-title">${medico.nombre}</h3>
                    <p>Especialidad: ${medico.especialidad}</p>
                    <p>Obras Sociales: ${medico.obrasSociales}</p>
                </div>
            </div>
        `;
        contenedorMedicos.appendChild(col);
    });
}

medicoForm.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const especialidad = document.getElementById('especialidad').value;
    const obrasSociales = document.getElementById('obrasSociales').value;
    const imagenInput = document.getElementById('imagen');

    const saveMedico = (imgBase64) => {
        const medicoData = {
            nombre,
            especialidad,
            obrasSociales,
            imagen: imgBase64 || null
        };

        if (editando) {
            const id = document.getElementById('medicoId').value;
            medicos[id] = medicoData; //Ahora se pueden editar todos los medicos
            editando = false;
            cancelarBtn.classList.add('d-none');
        } else {
            medicos.push(medicoData);
        }

        guardarEnLocalStorage()
        medicoForm.reset();
        renderMedicos();
    };

    if (imagenInput.files && imagenInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveMedico(e.target.result);
        };
        reader.readAsDataURL(imagenInput.files[0]);
    } else {
        const id = document.getElementById('medicoId').value;
        const currentMedico = medicos[id];
        saveMedico(editando ? currentMedico.imagen : null);
    }
});

window.editarMedico = function(index) {
    const medico = medicos[index]; 
    document.getElementById('medicoId').value = index;
    document.getElementById('nombre').value = medico.nombre;
    document.getElementById('especialidad').value = medico.especialidad;
    document.getElementById('obrasSociales').value = medico.obrasSociales;
    document.getElementById('imagen').value = ""; 
    editando = true;
    cancelarBtn.classList.remove('d-none');
};

window.eliminarMedico = function(index) {
    if (confirm('¿Estás seguro de eliminar este médico?')) {
        medicos.splice(index, 1); 
        guardarEnLocalStorage();
        renderMedicos();
    }
};

cancelarBtn.addEventListener('click', () => {
    medicoForm.reset();
    editando = false;
    cancelarBtn.classList.add('d-none');
});

if (medicos.length === 0) {
    medicos = medicosPrecargados;
    guardarEnLocalStorage();
}

renderMedicos();