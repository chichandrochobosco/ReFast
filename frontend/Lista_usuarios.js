window.onload = function () {
    fetch('http://localhost:4000/usuarios') // Cambia esta URL si es necesario
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

        usuarioDiv.innerHTML = `
            <div class="item-izquierda">
                <img src="https://www.gravatar.com/avatar/${usuario.emailHash}" alt="${nombre}">
            </div>
            <div class="item-derecha">
                <div><strong>Nombre:</strong> ${nombre}</div>
                <div><strong>Email:</strong> ${email}</div>
            </div>
        `;

        listaUsuariosDiv.appendChild(usuarioDiv);
    });
}