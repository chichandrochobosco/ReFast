window.onload = function () {
    fetch('http://localhost:4000/usuario') // Cambia esta URL si es necesario
        .then(response => response.json())
        .then(data => mostrarUsuarios(data))
        .catch(error => console.error('Error al cargar los usuarios:', error));
};

function mostrarUsuarios(usuarios) {
    const listaUsuariosDiv = document.getElementById('lista-usuarios');
    listaUsuariosDiv.innerHTML = ''; // Limpiar el contenedor

    usuarios.forEach(usuario => {
        console.log(usuario); // Verificar que el objeto contenga las propiedades correctas

        const usuarioDiv = document.createElement('div');
        usuarioDiv.classList.add('item-usuario');

        // Verifica que 'nombre' y 'email' existen
        const nombre = usuario.nombre || 'Desconocido';
        const email = usuario.email || 'No proporcionado';

        // Crear la estructura HTML del usuario
        usuarioDiv.innerHTML = `
            <div class="item-izquierda">
                <img src="https://www.gravatar.com/avatar/${usuario.emailHash}" alt="${nombre}">
            </div>
            <div class="item-derecha">
                <div><strong>Nombre:</strong> ${nombre}</div>
                <div><strong>Email:</strong> ${email}</div>
                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </div>
        `;

        listaUsuariosDiv.appendChild(usuarioDiv);
    });
}

// Función para eliminar un usuario
function eliminarUsuario(usuarioId) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?');

    if (confirmacion) {
        fetch(`http://localhost:4000/usuario/${usuarioId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Usuario eliminado correctamente.') {
                alert('Usuario eliminado correctamente.');
                location.reload();
            } else {
                alert('Error al eliminar el usuario.');
            }
        })
        .catch(error => console.error('Error al eliminar el usuario:', error));
    }
}