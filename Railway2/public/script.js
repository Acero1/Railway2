const form = document.getElementById('formAlumno');
const lista = document.getElementById('listaAlumnos');

async function cargarAlumnos() {
  const res = await fetch('/api/alumnos');
  const alumnos = await res.json();
  lista.innerHTML = '';
  alumnos.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${a.nombre} (${a.correo})
      <button onclick="eliminar(${a.id})">Eliminar</button>
      <button onclick="editar(${a.id}, '${a.nombre}', '${a.correo}')">Editar</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  await fetch('/api/alumnos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo })
  });
  form.reset();
  cargarAlumnos();
});

async function eliminar(id) {
  await fetch(`/api/alumnos/${id}`, { method: 'DELETE' });
  cargarAlumnos();
}

function editar(id, nombre, correo) {
  document.getElementById('nombre').value = nombre;
  document.getElementById('correo').value = correo;

  form.onsubmit = async function(e) {
    e.preventDefault();
    const nuevoNombre = document.getElementById('nombre').value;
    const nuevoCorreo = document.getElementById('correo').value;
    await fetch(`/api/alumnos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, correo: nuevoCorreo })
    });
    form.reset();
    cargarAlumnos();
    form.onsubmit = defaultSubmit;
  }
}

const defaultSubmit = form.onsubmit;

cargarAlumnos();
