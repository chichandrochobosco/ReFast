document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const contrasena = document.getElementById("contrasena").value;
    const email = document.getElementById("email").value;

    const data = {
        nombre: nombre,
        contrasena: contrasena,
        email: email
    };

    fetch('http://localhost:4000/usuario', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json(); // Convertir a JSON solo si la respuesta es exitosa
    })
    .then(data => {
        if (data.success) {
            alert(data.message);  // Mensaje de éxito desde el servidor
        } else {
            alert(`Error: ${data.message}`);  // Mensaje de error desde el servidor
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    });
});
