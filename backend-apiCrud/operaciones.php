<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

include("conexion.php");

// Conexión a la base de datos
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// ==================== FUNCIONES DE AUTENTICACIÓN ====================

// Función para verificar el inicio de sesión
function login($usuario, $contrasena) {
    global $db;
    try{
        $stmt = $db->prepare("SELECT * FROM roles WHERE usuario = :usuario AND contrasena = :contrasena");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();

        if ($stmt->rowCount() > 0 ) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row;
        }
        return false;
    }catch( PDOException $e ){
        die("Error al verificar el inicio de sesión: " . $e->getMessage());
    }
}

// ==================== FUNCIONES CRUD PRODUCTOS ====================

function getProducts($nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (:nombre, :descripcion, :precio, :stock, :imagen)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':stock', $stock);
        $stmt->bindParam(':imagen', $imagen);
        $stmt->execute();
        echo json_encode(array("message" => "Producto creado con éxito", "id" => $db->lastInsertId()));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al crear producto: " . $e->getMessage()));
    }
}

function updateProducts($id, $nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    try {
        $stmt = $db->prepare("UPDATE productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, stock = :stock, imagen = :imagen WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':stock', $stock);
        $stmt->bindParam(':imagen', $imagen);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Producto actualizado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Producto no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar producto: " . $e->getMessage()));
    }
}

function deleteProduct($id){
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM productos WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Producto eliminado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Producto no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar producto: " . $e->getMessage()));
    }
}

function getProductById($id){
    global $db;
    try {
        $stmt = $db->prepare("SELECT * FROM productos WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $producto = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($producto);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Producto no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener producto: " . $e->getMessage()));
    }
}

// ==================== FUNCIONES CRUD CLIENTES ====================

function getAllClientes(){
    global $db;
    try {
        $stmt = $db->query("SELECT * FROM clientes ORDER BY id_cliente DESC");
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($clientes);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener clientes: " . $e->getMessage()));
    }
}

function createCliente($nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion){
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO clientes (nombre, apellido, email, celular, direccion, direccion2, descripcion) VALUES (:nombre, :apellido, :email, :celular, :direccion, :direccion2, :descripcion)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':celular', $celular);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':direccion2', $direccion2);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->execute();
        echo json_encode(array("message" => "Cliente creado con éxito", "id" => $db->lastInsertId()));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al crear cliente: " . $e->getMessage()));
    }
}

function updateCliente($id, $nombre, $apellido, $email, $celular, $direccion, $direccion2, $descripcion){
    global $db;
    try {
        $stmt = $db->prepare("UPDATE clientes SET nombre = :nombre, apellido = :apellido, email = :email, celular = :celular, direccion = :direccion, direccion2 = :direccion2, descripcion = :descripcion WHERE id_cliente = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':celular', $celular);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':direccion2', $direccion2);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Cliente actualizado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Cliente no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar cliente: " . $e->getMessage()));
    }
}

function deleteCliente($id){
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM clientes WHERE id_cliente = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Cliente eliminado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Cliente no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar cliente: " . $e->getMessage()));
    }
}

function getClienteById($id){
    global $db;
    try {
        $stmt = $db->prepare("SELECT * FROM clientes WHERE id_cliente = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($cliente);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Cliente no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener cliente: " . $e->getMessage()));
    }
}

// ==================== FUNCIONES CRUD PEDIDOS ====================

function getAllPedidos(){
    global $db;
    try {
        $stmt = $db->query("
            SELECT p.*, c.nombre, c.apellido, c.email 
            FROM pedido p 
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente 
            ORDER BY p.id DESC
        ");
        $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($pedidos);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener pedidos: " . $e->getMessage()));
    }
}

function createPedido($id_cliente, $descuento, $metodo_pago, $aumento, $productos){
    global $db;
    try {
        $db->beginTransaction();
        
        // Crear el pedido
        $stmt = $db->prepare("INSERT INTO pedido (id_cliente, descuento, metodo_pago, aumento) VALUES (:id_cliente, :descuento, :metodo_pago, :aumento)");
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->bindParam(':descuento', $descuento);
        $stmt->bindParam(':metodo_pago', $metodo_pago);
        $stmt->bindParam(':aumento', $aumento);
        $stmt->execute();
        
        $pedido_id = $db->lastInsertId();
        
        // Agregar productos al detalle del pedido
        foreach ($productos as $producto) {
            $stmt = $db->prepare("INSERT INTO detalle_pedido (id_pedido, id_producto, precio, cantidad) VALUES (:id_pedido, :id_producto, :precio, :cantidad)");
            $stmt->bindParam(':id_pedido', $pedido_id);
            $stmt->bindParam(':id_producto', $producto['id_producto']);
            $stmt->bindParam(':precio', $producto['precio']);
            $stmt->bindParam(':cantidad', $producto['cantidad']);
            $stmt->execute();
            
            // Actualizar stock del producto
            $stmt = $db->prepare("UPDATE productos SET stock = stock - :cantidad WHERE id = :id_producto");
            $stmt->bindParam(':cantidad', $producto['cantidad']);
            $stmt->bindParam(':id_producto', $producto['id_producto']);
            $stmt->execute();
        }
        
        $db->commit();
        echo json_encode(array("message" => "Pedido creado con éxito", "id" => $pedido_id));
    } catch(PDOException $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode(array("message" => "Error al crear pedido: " . $e->getMessage()));
    }
}

function updatePedido($id, $id_cliente, $descuento, $metodo_pago, $aumento){
    global $db;
    try {
        $stmt = $db->prepare("UPDATE pedido SET id_cliente = :id_cliente, descuento = :descuento, metodo_pago = :metodo_pago, aumento = :aumento WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->bindParam(':descuento', $descuento);
        $stmt->bindParam(':metodo_pago', $metodo_pago);
        $stmt->bindParam(':aumento', $aumento);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Pedido actualizado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Pedido no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar pedido: " . $e->getMessage()));
    }
}

function deletePedido($id){
    global $db;
    try {
        $db->beginTransaction();
        
        // Eliminar detalles del pedido
        $stmt = $db->prepare("DELETE FROM detalle_pedido WHERE id_pedido = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        // Eliminar el pedido
        $stmt = $db->prepare("DELETE FROM pedido WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $db->commit();
            echo json_encode(array("message" => "Pedido eliminado con éxito"));
        } else {
            $db->rollback();
            http_response_code(404);
            echo json_encode(array("message" => "Pedido no encontrado"));
        }
    } catch(PDOException $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar pedido: " . $e->getMessage()));
    }
}

function getPedidoById($id){
    global $db;
    try {
        $stmt = $db->prepare("
            SELECT p.*, c.nombre, c.apellido, c.email 
            FROM pedido p 
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente 
            WHERE p.id = :id
        ");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $pedido = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Obtener detalles del pedido
            $stmt = $db->prepare("
                SELECT dp.*, pr.nombre as producto_nombre 
                FROM detalle_pedido dp 
                INNER JOIN productos pr ON dp.id_producto = pr.id 
                WHERE dp.id_pedido = :id
            ");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $pedido['detalles'] = $detalles;
            echo json_encode($pedido);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Pedido no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener pedido: " . $e->getMessage()));
    }
}

// ==================== FUNCIONES CRUD USUARIOS/ROLES ====================

function getAllUsuarios(){
    global $db;
    try {
        $stmt = $db->query("SELECT id, rol, usuario FROM roles ORDER BY id DESC");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener usuarios: " . $e->getMessage()));
    }
}

function createUser($rol, $usuario, $contrasena){
    global $db;
    try {
        // Verificar si el usuario ya existe
        $stmt = $db->prepare("SELECT COUNT(*) FROM roles WHERE usuario = :usuario");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        
        if ($stmt->fetchColumn() > 0) {
            http_response_code(409);
            echo json_encode(array("message" => "El usuario ya existe"));
            return;
        }
        
        $stmt = $db->prepare("INSERT INTO roles (rol, usuario, contrasena) VALUES (:rol, :usuario, :contrasena)");
        $stmt->bindParam(':rol', $rol);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();
        echo json_encode(array("message" => "Usuario creado con éxito", "id" => $db->lastInsertId()));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al crear usuario: " . $e->getMessage()));
    }
}

function updateUser($id, $rol, $usuario, $contrasena = null){
    global $db;
    try {
        if ($contrasena) {
            $stmt = $db->prepare("UPDATE roles SET rol = :rol, usuario = :usuario, contrasena = :contrasena WHERE id = :id");
            $stmt->bindParam(':contrasena', $contrasena);
        } else {
            $stmt = $db->prepare("UPDATE roles SET rol = :rol, usuario = :usuario WHERE id = :id");
        }
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':rol', $rol);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Usuario actualizado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Usuario no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar usuario: " . $e->getMessage()));
    }
}

function deleteUser($id){
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM roles WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Usuario eliminado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Usuario no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar usuario: " . $e->getMessage()));
    }
}

function getUserById($id){
    global $db;
    try {
        $stmt = $db->prepare("SELECT id, rol, usuario FROM roles WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($usuario);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Usuario no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener usuario: " . $e->getMessage()));
    }
}

// ==================== FUNCIONES CRUD DETALLE PEDIDO ====================

function getDetallesByPedido($id_pedido){
    global $db;
    try {
        $stmt = $db->prepare("
            SELECT dp.*, pr.nombre as producto_nombre, pr.imagen 
            FROM detalle_pedido dp 
            INNER JOIN productos pr ON dp.id_producto = pr.id 
            WHERE dp.id_pedido = :id_pedido
        ");
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->execute();
        $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($detalles);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al obtener detalles: " . $e->getMessage()));
    }
}

function createDetallePedido($id_pedido, $id_producto, $precio, $cantidad){
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO detalle_pedido (id_pedido, id_producto, precio, cantidad) VALUES (:id_pedido, :id_producto, :precio, :cantidad)");
        $stmt->bindParam(':id_pedido', $id_pedido);
        $stmt->bindParam(':id_producto', $id_producto);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':cantidad', $cantidad);
        $stmt->execute();
        echo json_encode(array("message" => "Detalle agregado con éxito", "id" => $db->lastInsertId()));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al crear detalle: " . $e->getMessage()));
    }
}

function updateDetallePedido($id, $precio, $cantidad){
    global $db;
    try {
        $stmt = $db->prepare("UPDATE detalle_pedido SET precio = :precio, cantidad = :cantidad WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':cantidad', $cantidad);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Detalle actualizado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Detalle no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al actualizar detalle: " . $e->getMessage()));
    }
}

function deleteDetallePedido($id){
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM detalle_pedido WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("message" => "Detalle eliminado con éxito"));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Detalle no encontrado"));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Error al eliminar detalle: " . $e->getMessage()));
    }
}
?>