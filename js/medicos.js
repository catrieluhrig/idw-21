const medicoForm = document.getElementById('medicoForm');
const tablaBody = document.querySelector('#tablaMedicos tbody');
const cancelarBtn = document.getElementById('cancelarEdicion');

let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
let editando = false;

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
            medicos[id] = medicoData;
            editando = false;
            cancelarBtn.classList.add('d-none');
        } else {
            medicos.push(medicoData);
        }

        localStorage.setItem('medicos', JSON.stringify(medicos));
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
        saveMedico(null);
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
        localStorage.setItem('medicos', JSON.stringify(medicos));
        renderMedicos();
    }
};

cancelarBtn.addEventListener('click', () => {
    medicoForm.reset();
    editando = false;
    cancelarBtn.classList.add('d-none');
});

renderMedicos();
