window.onload = function() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const listaProductos = document.getElementById('lista-productos');

    productos.forEach(producto => {
        if (producto.activo) { // Solo mostrar productos activos
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
                </div>
            `;
            listaProductos.insertAdjacentHTML('beforeend', productoHTML);
        }
    });
}