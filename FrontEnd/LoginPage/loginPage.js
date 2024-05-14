const worksEndpoint = 'http://localhost:5678/api/';



function login() {
    let button = document.getElementById("login-button");
    button.addEventListener("click", () => {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        // Envoyer une requête HTTP au serveur pour l'authentification
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(function(response) {
            if (response.ok) {
                // Authentification réussie
                return response.json();
            } else {
                // Gérer les erreurs d'authentification
                throw new Error('Erreur d\'authentification');
            }
        })
        .then(function(data) {
            // Stocker le token dans sessionStorage ou localStorage
            sessionStorage.setItem('token', data.token);
            // Rediriger l'utilisateur vers la page index.html
            window.location.href = '../index.html';
        })
        .catch(function(error) {
            // Gérer les erreurs
            console.error('Erreur lors de la tentative de connexion:', error);
        });
    });

    // Empêcher le formulaire de se soumettre par défaut lors de la soumission
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
    });
}

// Appeler la fonction login pour activer les gestionnaires d'événements
login();

