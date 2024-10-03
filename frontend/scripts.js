document.getElementById('imagen-producto').addEventListener('change', function(event) {
    const fileInput = event.target;
    const imagePlaceholder = document.querySelector('.imagen-placeholder');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePlaceholder.style.backgroundImage = `url(${e.target.result})`;
            imagePlaceholder.textContent = '';
        }
        reader.readAsDataURL(file);
    } else {
        imagePlaceholder.style.backgroundImage = '';
        imagePlaceholder.textContent = '+';
    }
});

let editando = false;
let productoEditando = null;

// Cargar productos al iniciar la página
window.onload = function() {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    productosGuardados.forEach(producto => {
        mostrarProductoEnLista(producto);
    });
}

function guardarProducto() {
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenProducto = document.getElementById('imagen-producto').files[0];

    if (!categoria || !cantidad || !nombre || !precio || !descripcion || (!imagenProducto && !editando)) { 
        alert('Por favor, complete todos los campos.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const producto = {
            imagenUrl: e.target.result,
            categoria,
            cantidad,
            nombre,
            precio,
            descripcion,
            activo: true // Estado inicial del producto
        };

        // Almacenar producto en localStorage
        const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
        
        // Si se está editando, reemplazar el producto en lugar de agregar uno nuevo
        if (editando && productoEditando) {
            const index = productosGuardados.indexOf(productoEditando);
            if (index !== -1) {
                productosGuardados[index] = producto; // Reemplazar el producto editado
            }
        } else {
            productosGuardados.push(producto);
        }

        localStorage.setItem('productos', JSON.stringify(productosGuardados));

        // Crear nuevo producto en la vista
        mostrarProductoEnLista(producto);
        limpiarFormulario();
    };
    if (imagenProducto) {
        reader.readAsDataURL(imagenProducto);
    }
}

function mostrarProductoEnLista(producto) {
    const productoHTML = `
        <div class="item-producto">
            <div class="item-izquierda">
                <div class="imagen-placeholder" style="background-image: url(${producto.imagenUrl})">${producto.imagenUrl ? '' : '+'}</div>
                <p>${producto.nombre}</p>
            </div>
            <div class="item-derecha">
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad} Unidades</p>
                <p><strong>Precio: $</strong> ${producto.precio} Pesos</p>
                <p><strong>Descripción:</strong> ${producto.descripcion}</p>
            </div>
            <div class="icono-editar">
                <button onclick="editarProducto(this)">Editar</button>
            </div>
            <div class="icono-eliminar">
                <button onclick="eliminarProducto(this)">Eliminar</button>
            </div>
            <div class="switch-activar">
                <label class="switch">
                    <input type="checkbox" onchange="toggleProductoActivo(this)" ${producto.activo ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;
    document.querySelector('.lista-productos').insertAdjacentHTML('beforeend', productoHTML);
}

function eliminarProducto(element) {
    const nombreProducto = element.closest('.item-producto').querySelector('.item-derecha p:nth-child(3)').textContent.split(': ')[1];

    // Eliminar producto de localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const nuevosProductos = productos.filter(prod => prod.nombre !== nombreProducto);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));

    element.closest('.item-producto').remove();
}

function editarProducto(element) {
    const producto = element.closest('.item-producto');
    productoEditando = producto;
    editando = true;
    document.getElementById('categoria').value = producto.querySelector('.item-derecha p:nth-child(1)').textContent.split(': ')[1];
    document.getElementById('cantidad').value = producto.querySelector('.item-derecha p:nth-child(2)').textContent.split(': ')[1];
    document.getElementById('nombre').value = producto.querySelector('.item-derecha p:nth-child(3)').textContent.split(': ')[1];
    document.getElementById('precio').value = producto.querySelector('.item-derecha p:nth-child(4)').textContent.split(': ')[1];
    document.getElementById('descripcion').value = producto.querySelector('.item-derecha p:nth-child(5)').textContent.split(': ')[1];

    const imagePlaceholder = document.querySelector('.imagen-placeholder');
    imagePlaceholder.style.backgroundImage = `url(${producto.querySelector('.imagen-placeholder').style.backgroundImage.slice(5, -2)})`;
    imagePlaceholder.textContent = '';

    // Cambiar texto del botón guardar
    const btnGuardar = document.querySelector('.btn-guardar');
    btnGuardar.textContent = 'GUARDAR CAMBIOS';
}

function limpiarFormulario() {
    editando = false;
    productoEditando = null;
    document.getElementById('categoria').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('imagen-producto').value = '';
    const imagePlaceholder = document.querySelector('.imagen-placeholder');
    imagePlaceholder.style.backgroundImage = '';
    imagePlaceholder.textContent = '+';

    // Cambiar texto del botón guardar a su estado inicial
    const btnGuardar = document.querySelector('.btn-guardar');
    btnGuardar.textContent = 'GUARDAR';
}

function descartarProducto() {
    limpiarFormulario();
}

function toggleProductoActivo(checkbox) {
    const itemProducto = checkbox.closest('.item-producto');
    const nombreProducto = itemProducto.querySelector('.item-derecha p:nth-child(3)').textContent.split(': ')[1];

    // Actualizar estado en localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(prod => prod.nombre === nombreProducto);
    if (producto) {
        producto.activo = checkbox.checked;
    }
    localStorage.setItem('productos', JSON.stringify(productos));
}