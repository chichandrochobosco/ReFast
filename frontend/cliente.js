// script.js

let carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const totalPedido = document.getElementById('total-pedido');

document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', function() {
        const producto = this.parentElement;
        const id = producto.getAttribute('data-id');
        const nombre = producto.getAttribute('data-nombre');
        const precio = parseInt(producto.getAttribute('data-precio'));

        const itemCarrito = {
            id,
            nombre,
            precio,
            cantidad: 1
        };

        carrito.push(itemCarrito);
        actualizarCarrito();
    });
});

function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - $${producto.precio}`;
        listaCarrito.appendChild(li);

        total += producto.precio * producto.cantidad;
    });

    totalPedido.textContent = `$${total}`;
}

document.getElementById('realizar-pedido').addEventListener('click', function() {
    if (carrito.length > 0) {
        alert('Pedido realizado con éxito');
        // Aquí puedes enviar el pedido al servidor o almacenarlo en algún lugar
        carrito = [];
        actualizarCarrito();
    } else {
        alert('El carrito está vacío');
    }
});
