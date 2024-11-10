document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const contrasena = document.getElementById('contrasena').value;
  
        try {
          const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contrasena })
          });
  
          if (!response.ok) {
            throw new Error('Error en el inicio de sesión');
          }
  
          const data = await response.json();
          
          if (data.redirectTo) {
            window.location.href = data.redirectTo;
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Error en el login:', error);
          alert('Hubo un problema al iniciar sesión. Inténtalo de nuevo.');
        }
      });
    }
  });
  