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
        const usuarioDiv = document.createElement('div');
        usuarioDiv.classList.add('item-usuario');
        
        usuarioDiv.innerHTML = `
            <div class="item-izquierda">
                <img src="https://www.gravatar.com/avatar/${usuario.emailHash}" alt="${usuario.nombre}">
            </div>
            <div class="item-derecha">
                <div><strong>Nombre:</strong> ${usuario.nombre}</div>
                <div><strong>Email:</strong> ${usuario.email}</div>
        `;

        listaUsuariosDiv.appendChild(usuarioDiv);
    });
}