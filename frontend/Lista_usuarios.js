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

function obtenerUsuarioPorId(usuarioId) {
    fetch(`http://localhost:4000/usuario/${usuarioId}`) // Llama al endpoint con el ID del usuario
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuario encontrado:', data);
            mostrarUsuario(data); // Función para mostrar el usuario en la pantalla
        })
        .catch(error => {
            console.error('Error al cargar el usuario:', error);
            alert('El usuario con el ID proporcionado no existe.');
        });
}


function mostrarUsuario(usuario) {
    const listaUsuariosDiv = document.getElementById('lista-usuarios');
    listaUsuariosDiv.innerHTML = ''; // Limpiar el contenedor antes de mostrar el usuario

    const usuarioDiv = document.createElement('div');
    usuarioDiv.classList.add('item-usuario');

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
}

function mostrarTodosUsuarios() {
    fetch('http://localhost:4000/usuario') // Este endpoint debe devolver todos los usuarios
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron cargar los usuarios');
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuarios encontrados:', data);
            mostrarUsuarios(data); // Función para mostrar todos los usuarios en la pantalla
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
}

function buscarUsuario() {
    const usuarioId = document.getElementById('usuario-id').value;
    if (usuarioId) {
        obtenerUsuarioPorId(usuarioId);
    } else {
        alert('Por favor, ingresa un ID válido.');
    }
}

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