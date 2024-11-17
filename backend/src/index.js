const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const cors = require('cors');


//config inicial
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("escuchando al puerto :) " + app.get("port"));



//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // Para parsear JSON


// Middleware de autenticación y verificación de rol
function verificarAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Error al verificar el token.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).send({ message: 'No autorizado. Solo los administradores pueden realizar esta acción.' });
    }

    req.userId = decoded.id;
    next();
  });
}


//rutas
app.get('/ping', async (req, res) => {
  const connection = await database.getconnection();
  connection.query('SELECT 1', (error, results) => {
      if (error) {
          console.error('Error al hacer ping a la base de datos:', error);
          return res.status(500).send({ message: 'Error al hacer ping a la base de datos.' });
      }
      res.send({ message: 'Pong!', results });
  });
});

/*app.get('/usuario', async (req, res) => {
  const connection = await database.getconnection();
  connection.query('call sp_leer_usuarios()', (error, results) => {
      if (error) {
          console.error('Error al obtener usuarios:', error);
          return res.status(500).send({ message: 'Error al obtener usuarios.' });
      }
      res.send(results); // Enviar los resultados como respuesta
  });
});*/

//PRODUCTOS

app.get("/menu", async (req, res) => {
  const connection = await database.getconnection();
  const result = await connection.query("call sp_leer_productos()");
  console.log(result);
})

/*app.get("/producto/:id", async (req, res) =>{
   const productId = req.params.id;
   const connection = await database.getconnection();
   const result = await connection.query("SELECT * from producto where id=;");
   console.log(result); 
} )*/


//ya esta el sp_leer_producto_por_id();
app.get('/producto/:id', (req, res) => {
  const productId = req.params.id;

  connection.query('sp_leer_producto_por_id(?)', [productId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al obtener el producto' });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.send(results[0]);
  });
});


app.delete('/producto/:id', verificarAdmin, (req, res) => {
  const productId = req.params.id;

  connection.query('call sp_eliminar_producto(?)', [productId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al eliminar el producto.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Producto no encontrado.' });
    }

    res.send({ message: 'Producto eliminado correctamente.' });
  });
});

app.put('/producto/:id', verificarAdmin, (req, res) => {
  const productId = req.params.id;
  const { nombre, descripcion, precio, stock } = req.body;

  // Consulta para actualizar el producto
  const query = `call sp_actualizar_producto(?, ?, ?, ?, ?)`;

  connection.query(query, [productId, precio, nombre, stock, descripcion], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al actualizar el producto.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Producto no encontrado.' });
    }

    res.send({ message: 'Producto actualizado correctamente.' });
  });
});

app.post('/producto', verificarAdmin, (req, res) => {
  const { nombre, fecha_ingreso, categoria, cantidad, precio, descripcion, imagen } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!nombre || !fecha_ingreso || !categoria || !cantidad || !precio || !descripcion || !imagen) {
    return res.status(400).send({ message: 'Todos los campos son obligatorios.' });
  }

  // Consulta para insertar el nuevo producto
  const query = `call sp_crear_producto(?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [nombre, fecha_ingreso, categoria, cantidad, precio, descripcion, imagen], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al agregar el producto.' });
    }

    res.status(201).send({ message: 'Producto agregado exitosamente.', productoId: results.insertId });
  });
});

//PERFIL
app.post('/usuario', async (req, res) => {
  const { nombre, contrasena, email } = req.body; // Desestructura el cuerpo de la solicitud
  let connection;
  const idrol = 4;

  // Verificar que los campos requeridos estén presentes
  if (!nombre || !contrasena || !idrol || !email) {
      return res.status(400).send({ message: 'Todos los campos son requeridos.' });
  }

  try {
      connection = await database.getconnection(); // Obtener conexión
      const query = 'CALL sp_agregar_usuario(?, ?, ?, ?)';
      const [result] = await connection.promise().query(query, [nombre, contrasena, idrol, email]); // Insertar el nuevo usuario

      res.status(201).send({ message: 'Usuario creado exitosamente.', usuarioId: result.insertId }); // Respuesta exitosa
  } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).send({ message: 'Error al crear el usuario.' });
  }
});

app.get('/usuario/:id', async (req, res) => {
  let connection;
  const usuarioId = req.params.id;
  try {
    connection = await database.getconnection();
    const query = 'call sp_leer_usuario_por_id(?)';
    connection.query(query, [usuarioId], (error, results) => {
  
      if (results.length === 0) {
        return res.status(404).send({ message: 'Usuario no encontrado.' });
      }
  
      // Retornar la información del usuario
      res.status(200).send(results[0]);
    });
  } catch(error){
    return res.status(500).send({ message: 'Error al recuperar el perfil del usuario.' });
  }  
  // Consulta para seleccionar el usuario por su ID
  

  
});

//obtener perfil
/*app.get('/perfil/:id', (req, res) => {
  const usuarioId = req.params.id;

  // Consulta para obtener los detalles del perfil
  const query = `SELECT id, nombre, email, fecha_registro, direccion, telefono FROM usuarios WHERE id = ?`;

  connection.query(query, [usuarioId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al obtener el perfil del usuario.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }

    // Devolver el perfil del usuario
    res.status(200).send(results[0]);
  });
});
*/
//


//pedido

app.post('/pedido', async(req, res) => {
  let connection;
  const { usuarioId, precio, estadoId } = req.body; //agregué las variables precio y estadoId porque sino no iban a estar para la query
  try {
    connection = await database.getconnection();
    const query = 'call sp_crear_pedido(?, ?, ?)';
    connection.query(query, [usuarioId, precio, estadoId], (error, results) => {
  
      if (results.length === 0) {
        return res.status(404).send({ message: 'Error al crear el carrito.' });
      }
  
      // Retornar la información del usuario
      res.status(200).send(results[0]);
    });
  } catch(error){
    return res.status(500).send({ message: 'Error al crear el carrito.' });
  }  
  // Consulta para seleccionar el usuario por su ID
});

//obtener carrito
/* CARRITO AL FINAL NO EXISTE XD, asi que quedo ahi.
app.get('/carrito/:id', (req, res) => {
  const carritoId = req.params.id;

  // Consulta para obtener los detalles del carrito, incluyendo los productos
  const query = `
    SELECT p.id, p.nombre, p.categoria, p.precio, cp.cantidad, p.descripcion, p.imagen 
    FROM carrito_productos cp
    JOIN productos p ON cp.producto_id = p.id
    WHERE cp.carrito_id = ?`;

  connection.query(query, [carritoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al recuperar el carrito de compras.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'El carrito está vacío o no existe.' });
    }

    // Retornar los productos del carrito
    res.status(200).send(results);
  });
});
*/

// pedido por ID
app.get('/pedido/:id', (req, res) => {
  const pedidoId = req.params.id;

  // Consulta para obtener los detalles del carrito específico
  // ya esta el metodo sp_leer_pedido_por_id(), devuelve la info del pedido
  // NO devuelve los productos del pedido, para eso esta el endpoint de GET /pedido/:id/productos
  // por eso me parecio medio rara la query de abajo pero vamo con los datos del pedido sin productos
  const query = `
    SELECT c.id AS carrito_id, c.fecha_creacion, p.id AS producto_id, p.nombre, p.categoria, p.precio, cp.cantidad, p.descripcion, p.imagen 
    FROM carritos c
    JOIN carrito_productos cp ON c.id = cp.carrito_id
    JOIN productos p ON cp.producto_id = p.id
    WHERE c.id = ?`;

  connection.query(query, [pedidoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al recuperar el carrito de compras.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Carrito no encontrado o está vacío.' });
    }

    // Retornar los detalles del carrito y sus productos
    res.status(200).send(results);
  });
});

//agregar producto
app.post('/pedido/:id/producto', (req, res) => {
  const pedidoId = req.params.id;
  const { productoId, cantidad } = req.body;

  // Primero, verifica si el producto ya está en el pedido
  const checkQuery = `
    SELECT cantidad FROM pedido_producto 
    WHERE id_pedido = ? AND id_producto = ?`;

  connection.query(checkQuery, [pedidoId, productoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al verificar el producto en el pedido.' });
    }

    if (results.length > 0) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      const newCantidad = results[0].cantidad + cantidad;
      const updateQuery = `
        UPDATE carrito_productos 
        SET cantidad = ? 
        WHERE carrito_id = ? AND producto_id = ?`;

      connection.query(updateQuery, [newCantidad, pedidoId, productoId], (error) => {
        if (error) {
          return res.status(500).send({ message: 'Error al actualizar la cantidad del producto.' });
        }
        return res.status(200).send({ message: 'Producto actualizado en el peidod.' });
      });
    } else {
      // Si el producto no está en el carrito, agrégalo
      const insertQuery = `
        INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) 
        VALUES (?, ?, ?)`;

      connection.query(insertQuery, [carritoId, productoId, cantidad], (error) => {
        if (error) {
          return res.status(500).send({ message: 'Error al agregar el producto al carrito.' });
        }
        return res.status(200).send({ message: 'Producto agregado al carrito.' });
      });
    }
  });
});

/*/eliminar producto terminar*************************************YA EStA
*USaR sp_eliminar_producto_de_pedido_producto(pedidoId, productoId)*************************************/
app.delete('/pedido/:id/producto/:productoId', (req, res) => {
  const pedidoId = req.params.id;
  const productoId = req.params.productoId;

  // Consulta para eliminar el producto del carrito
  const deleteQuery = `call sp_eliminar_producto_de_pedido_producto(?, ?)`;

  connection.query(deleteQuery, [pedidoId, productoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al eliminar el producto del carrito.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Producto no encontrado en el carrito.' });
    }

    res.status(200).send({ message: 'Producto eliminado del carrito.' });
  });
});


//PEDIDO


//Método Obtener pedidos
app.get('/pedidos', (req, res) => {
  const cantidad = req.query.cantidad ? parseInt(req.query.cantidad) : 10; // Por defecto 10
  const estado = req.query.estado; // Opcional, para filtrar por estado
  const fecha = req.query.fecha; // Opcional, para filtrar por fecha

  // Construcción de la consulta SQL con los filtros opcionales
  let query = `call sp_leer_pedidos()`;
  const queryParams = [];

  if (estado || fecha) {
    query += ` WHERE`;
    if (estado) {
      query += ` estado = ?`;
      queryParams.push(estado);
    }
    if (fecha) {
      if (estado) query += ` AND`;
      query += ` fecha = ?`;
      queryParams.push(fecha);
    }
  }

  query += ` LIMIT ?`;
  queryParams.push(cantidad);

  connection.query(query, queryParams, (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al obtener los pedidos.' });
    }

    res.status(200).send(results);
  });
});

//Método obtener productos de un pedido ***********LISTOlA, sp_leer_pedido_productos(idpedido)************************************************************

app.get('/pedido/:id/productos', (req, res) => {
  const pedidoId = req.params.id;

  // Consulta para obtener los productos de un pedido
  const query = `call sp_leer_pedido_productos(?)`;

  connection.query(query, [pedidoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al obtener los productos del pedido.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'No se encontraron productos para este pedido.' });
    }

    // Retornar la lista de productos
    res.status(200).send(results);
  });
});

//obtener pedido por id ********Ya esta... usar sp_leer_pedido_por_id(idpedido)******************************************************************************************************

app.get('/pedido/:id', (req, res) => {
  const pedidoId = req.params.id;

  // Consulta para obtener el pedido por su ID
  const query = `sp_leer_pedido_por_id(?)`;

  connection.query(query, [pedidoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al obtener el pedido.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Pedido no encontrado.' });
    }

    // Retornar el objeto pedido
    res.status(200).send(results[0]);
  });
});

//actualizar estado de un pedido

app.put('/pedido/:id/estado', (req, res) => {
  const pedidoId = req.params.id;
  const { estado } = req.body;

  // Verificar si el estado es válido
  const estadosValidos = ['pendiente', 'completado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).send({ message: 'Estado no válido' });
  }

  // Consulta para actualizar el estado del pedido
  const query = `call sp_actualizar_pedido_estado(?, ?)`;

  connection.query(query, [ pedidoId, estado ], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al actualizar el estado del pedido.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Pedido no encontrado.' });
    }

    // Retornar éxito de la operación
    res.status(200).send({ success: true });
  });
});

//eliminar un pedido
app.delete('/pedido/:id', (req, res) => {
  const pedidoId = req.params.id;

  // Consulta para eliminar el pedido (productos relacionados se eliminan automáticamente gracias a ON DELETE CASCADE)
  const query = `call sp_eliminar_pedido(?)`;

  connection.query(query, [pedidoId], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Error al eliminar el pedido.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Pedido no encontrado.' });
    }

    // Retornar éxito de la operación
    res.status(200).send({ success: true });
  });
});

//SE ELIMINO TODO MENU DEL DIA POR SER CATEGORIA,NO TABLA, INNECESARIA TABLA