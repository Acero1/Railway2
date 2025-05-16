document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const clave = document.getElementById('clave').value;

  if (usuario === 'admin' && clave === '1234') {
    window.location.href = 'home.html';
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});
