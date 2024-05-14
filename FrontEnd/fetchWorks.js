const worksEndpoint = 'http://localhost:5678/api/';

async function afficherCaptions() {
    try {
        // Récupérer les données de l'API
        const response = await fetch("http://localhost:5678/api/works/");

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        // Convertir la réponse en tableau d'objets
        const imageData = await response.json();

        // Obtenir la section de galerie une seule fois
        const sectionGallery = document.querySelector('.gallery');

        if (!sectionGallery) {
            console.error("Section .gallery introuvable.");
            return;
        }

        // Vérifier que `imageData` est un tableau
        if (!Array.isArray(imageData) || imageData.length === 0) {
            console.warn("Aucune donnée d'image à afficher.");
            return;
        }

        // Parcourir les données pour afficher les images et leurs légendes
        for (let i = 0; i < imageData.length; i++) {
            const imageInfo = imageData[i];

            // Créer l'élément image
            const imageElement = document.createElement("img");
            imageElement.src = imageInfo.imageUrl; // Source de l'image
            imageElement.alt = imageInfo.title || "Image"; // Texte alternatif

            // Créer un élément <figure>
            const figureElement = document.createElement("figure");

            // Ajouter l'image au <figure>
            figureElement.appendChild(imageElement);
            
            // Créer la légende si nécessaire
            if (imageInfo.title) {
                const captionElement = document.createElement("figcaption");
                captionElement.textContent = imageInfo.title; // Définir le texte de la légende

                figureElement.appendChild(captionElement); // Ajouter la légende au <figure>
            }

            // Ajouter le <figure> à la galerie
            sectionGallery.appendChild(figureElement);
        }
    } catch (error) {
        console.error("Erreur dans afficherCaptions :", error); // Gérer les erreurs
    }
}


// Appeler la fonction pour afficher les images et les légendes
afficherCaptions();





function afficherSousCategories() {

const worksEndpoint = "http://localhost:5678/api/categories"

fetch(worksEndpoint)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Données récupérées:', data);
    })
    .catch((error) => {
        console.error('Erreur lors de la récupération des fichiers:', error);
    });

}
afficherSousCategories()







// Fonction pour afficher les images par catégorie
function displayImagesByCategory(imageData, categoryId) {
    const sectionGallery = document.querySelector('.gallery');
    sectionGallery.innerHTML = ''; // Vider la galerie avant de réafficher

    const filteredImages = categoryId === 'Tous'
        ? imageData // Afficher tous les éléments
        : imageData.filter(image => image.categoryId === categoryId); // Filtrer par `categoryId`

    filteredImages.forEach(image => {
        const figureElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = image.imageUrl;
        imageElement.alt = image.title || "Image";

        figureElement.appendChild(imageElement);

        if (image.title) {
            const captionElement = document.createElement("figcaption");
            captionElement.textContent = image.title;
            figureElement.appendChild(captionElement);
        }

        sectionGallery.appendChild(figureElement);
    });
}

// Fonction pour créer un bouton avec un gestionnaire d'événements
function createButton(name, onClick) {
    const button = document.createElement("button");
    button.innerText = name; // Nom affiché sur le bouton
    button.classList.add("button");
    button.addEventListener("click", onClick); // Ajouter le gestionnaire d'événements
    return button;
}

// Fonction asynchrone pour créer les boutons de filtres et afficher les images
async function createCategoryButtonsAndDisplayImages() {
    try {
        const categoryResponse = await fetch(worksEndpoint + 'categories');
        const worksResponse = await fetch(worksEndpoint + 'works');

        if (!categoryResponse.ok || !worksResponse.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const categories = await categoryResponse.json();
        const imageData = await worksResponse.json();

        const sectionPortfolio = document.querySelector('#portfolio');

        // Créer un conteneur pour les boutons
        const divButton = document.createElement("div");
        divButton.setAttribute("class", "filtres");

        // Ajouter le bouton "Tous"
        const allButton = createButton("Tous", () => displayImagesByCategory(imageData, 'Tous'));
        divButton.appendChild(allButton);

        // Ajouter des boutons pour chaque catégorie par `id`
        categories.forEach(category => {
            const categoryButton = createButton(category.name, () => displayImagesByCategory(imageData, category.id));
            divButton.appendChild(categoryButton);
        });

        sectionPortfolio.insertBefore(divButton, document.querySelector('.gallery')); // Ajouter les boutons au portfolio

        // Afficher tous les éléments par défaut ("Tous")
        displayImagesByCategory(imageData, 'Tous');

    } catch (error) {
        console.error("Erreur lors de la création des boutons ou de l'affichage des images :", error);
    }
}

// Appeler la fonction pour créer les boutons de filtres et afficher les images
createCategoryButtonsAndDisplayImages();




// Fonction pour assurer qu'un seul bouton est sélectionné à la fois
function buttonSelection(selectedButton) {
    const filterButtons = document.querySelectorAll('.filtres .button');

    // Supprime la classe 'selected' de tous les autres boutons
    filterButtons.forEach(button => {
        button.classList.remove('selected');
    });

    // Ajoute la classe 'selected' au bouton actuellement sélectionné
    selectedButton.classList.add('selected');
}

// Fonction pour créer un bouton avec un gestionnaire d'événements
function createButton(name, onClick) {
    const button = document.createElement("button");
    button.innerText = name; // Nom affiché sur le bouton
    button.classList.add("button"); // Classe par défaut des boutons

    // Ajouter un gestionnaire de clics qui utilise `buttonSelection`
    button.addEventListener("click", function() {
        buttonSelection(this); // Marque ce bouton comme sélectionné
        onClick(); // Exécute la fonction de filtre
    });

    return button;
}





