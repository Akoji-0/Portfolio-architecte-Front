const form = document.getElementById('myForm')

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validation des champs (vous pouvez ajouter d'autres vérifications)
    if (!email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Envoi des données à l'API backend
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        // Traitez la réponse du backend
        if (data.token) {
        localStorage.setItem('token', data.token)
            window.location.href = './index.html';
        } else {
            alert('Échec de la connexion : ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue');
    });
});