const form = document.getElementById('formAlumno');
const lista = document.getElementById('listaAlumnos');
let modoEdicion = false;
let idEditando = null;

const API_URL = '/api/alumnos'; // Cambia esto si usas un dominio completo

async function cargarAlumnos() {
  const res = await fetch(API_URL);
  const alumnos = await res.json();
  lista.innerHTML = '';
  alumnos.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${a.nombre} (${a.correo})
      <button onclick="eliminar(${a.id})">Eliminar</button>
      <button onclick="activarEdicion(${a.id}, '${a.nombre}', '${a.correo}')">Editar</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();

  if (!nombre || !correo) return alert('Completa ambos campos');

  if (modoEdicion && idEditando !== null) {
    // Editar
    await fetch(`${API_URL}/${idEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo })
    });
    modoEdicion = false;
    idEditando = null;
  } else {
    // Agregar
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo })
    });
  }

  form.reset();
  cargarAlumnos();
});

const buscarAlumnos = async () => {
  const query = document.getElementById('buscar').value.toLowerCase();
  
  // Fetch de alumnos
  const res = await fetch(API_URL);
  const alumnos = await res.json();

  // Filtrar los alumnos que coinciden con la búsqueda
  const alumnosFiltrados = alumnos.filter(a => {
    return a.nombre.toLowerCase().includes(query) || a.correo.toLowerCase().includes(query);
  });

  // Renderizar la lista filtrada
  lista.innerHTML = '';
  alumnosFiltrados.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${a.nombre} (${a.correo})
      <button onclick="eliminar(${a.id})">Eliminar</button>
      <button onclick="activarEdicion(${a.id}, '${a.nombre}', '${a.correo}')">Editar</button>
    `;
    lista.appendChild(li);
  });
};


async function eliminar(id) {
  if (!confirm('¿Seguro que deseas eliminar este alumno?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cargarAlumnos();
}

function activarEdicion(id, nombre, correo) {
  document.getElementById('nombre').value = nombre;
  document.getElementById('correo').value = correo;
  modoEdicion = true;
  idEditando = id;
}

cargarAlumnos();
