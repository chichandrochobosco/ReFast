const pedidos = [
    {
        id: 1,
        cliente: 'Lisandro Lobosco',
        productos: 'Sanguche de Milanesa',
        metodoPago: 'Mercado Pago',
        total: '3000',
        estado: 'Pendiente'
    },
    {
        id: 2,
        cliente: 'Eloy Tejero',
        productos: 'Pebete',
        metodoPago: 'Efectivo',
        total: 1500,
        estado: 'Aceptado'
    },
    {
        id: 3,
        cliente: 'Jeremias Leiva',
        productos: 'Medialuna de JyQ',
        metodoPago: 'Mercado Pago',
        total: 500,
        estado: 'Aceptado'
    },
    {
        id: 4,
        cliente: 'Julieta Corti',
        productos: 'Sanguche de Milanesa',
        metodoPago: 'Mercado Pago',
        total: 3000,
        estado: 'Rechazado'
    },
    {
        id: 5,
        cliente: 'Tomas Coch',
        productos: 'Gaseosa 500ml',
        metodoPago: 'Efectivo',
        total: 300,
        estado: 'Pendiente'
    }
];

// Función para cargar pedidos en la tabla
function cargarPedidos() {
    const tablaPedidos = document.querySelector('#tabla-pedidos tbody');
    tablaPedidos.innerHTML = '';

    // Ordenar pedidos por ID de menor a mayor
    pedidos.sort((a, b) => a.id - b.id);

    pedidos.forEach(pedido => {
        const fila = document.createElement('tr');

        fila.dataset.pedidoId = pedido.id; // Agregar el ID al dataset para el botón detalles

        fila.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.productos}</td>
            <td>${pedido.metodoPago}</td>
            <td class="estado estado-${pedido.estado.toLowerCase()}">${pedido.estado}</td>
            <td>
                <button class="aceptar">Aceptar</button>
                <button class="rechazar">Rechazar</button>
                <button class="detalles">Detalles</button>
                <button class="notificar">Notificar</button>
            </td>
        `;

        fila.querySelector('.aceptar').addEventListener('click', function() {
            actualizarEstadoPedido(pedido.id, 'Aceptado');
            marcarComoGrisado(this);
        });

        fila.querySelector('.rechazar').addEventListener('click', function() {
            actualizarEstadoPedido(pedido.id, 'Rechazado');
            marcarComoGrisado(this);
        });

        fila.querySelector('.detalles').addEventListener('click', function() {
            mostrarDetallesPedido(pedido.id);
        });

        fila.querySelector('.notificar').addEventListener('click', function() {
            mostrarVentanaNotificar();
        });

        tablaPedidos.appendChild(fila);
    });
}

// Función para actualizar el estado del pedido
function actualizarEstadoPedido(id, nuevoEstado) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        pedido.estado = nuevoEstado;
        cargarPedidos();
    }
}

// Función para mostrar detalles del pedido
function mostrarDetallesPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        document.getElementById('ventana-emergente-detalles').style.display = 'flex';
        document.getElementById('detalle-id').querySelector('span').textContent = pedido.id;
        document.getElementById('detalle-cliente').querySelector('span').textContent = pedido.cliente;
        document.getElementById('detalle-productos').querySelector('span').textContent = pedido.productos;
        document.getElementById('detalle-metodo-pago').querySelector('span').textContent = pedido.metodoPago;
        document.getElementById('detalle-total').querySelector('span').textContent = pedido.total;
    }
}



// Función para agregar un nuevo pedido
function agregarPedido(id, cliente, productos, metodoPago, total) {
    const idExistente = pedidos.some(p => p.id === id);
    if (idExistente) {
        document.getElementById('ventana-emergente-advertencia').style.display = 'flex';
    } else {
        pedidos.push({ id, cliente, productos, metodoPago, total, estado: 'Pendiente' });
        cargarPedidos();
        document.getElementById('ventana-emergente-crear').style.display = 'none';
    }
}

function mostrarVentanaNotificar() {
    document.getElementById('ventana-emergente-notificar').style.display = 'flex';
}

// Evento para cerrar la ventana emergente de notificación
document.querySelector('.btn-cerrar-ventana-notificar').addEventListener('click', function() {
    document.getElementById('ventana-emergente-notificar').style.display = 'none';
});

// Eventos para cerrar ventanas emergentes
document.querySelector('.btn-cerrar').addEventListener('click', function() {
    window.close();
});

document.querySelector('.btn-agregar').addEventListener('click', function() {
    document.getElementById('ventana-emergente-crear').style.display = 'flex';
});

document.querySelector('.btn-cerrar-ventana-detalles').addEventListener('click', function() {
    document.getElementById('ventana-emergente-detalles').style.display = 'none';
});

document.querySelector('.btn-cerrar-ventana-crear').addEventListener('click', function() {
    document.getElementById('ventana-emergente-crear').style.display = 'none';
});

document.querySelector('.btn-cerrar-ventana-advertencia').addEventListener('click', function() {
    document.getElementById('ventana-emergente-advertencia').style.display = 'none';
});



document.querySelector('#crear-pedido').addEventListener('click', function() {
    const id = parseInt(document.getElementById('input-id').value);
    const cliente = document.getElementById('input-cliente').value;
    const productos = document.getElementById('input-productos').value;
    const metodoPago = document.getElementById('input-metodo-pago').value; // Obtener valor del select
    const total = parseFloat(document.getElementById('input-total').value);

    agregarPedido(id, cliente, productos, metodoPago, total);
});

// Cargar los pedidos al iniciar
cargarPedidos();
