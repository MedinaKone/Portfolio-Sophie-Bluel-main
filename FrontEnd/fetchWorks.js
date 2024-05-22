const worksEndpoint = 'http://localhost:5678/api/';


// AFFICHER OU SUPPRIMER DES ELEMENTS SELON L'ETAT DE CONNEXION 
const modifierButton = document.querySelector(".modifier-button");
const signin = document.querySelector(".signin");
const signout = document.querySelector(".signout");
const modeEditionBand = document.querySelector(".mode-edition-band");
const mesProjetsModifierText = document.querySelector(".mes-projets-modifier-text");

// Fonction pour vérifier l'état de connexion et ajuster l'affichage
function loginIndex() {
    if (sessionStorage.getItem('token')) {
        signin.style.display = "none";
        signout.style.display = "inherit";
        modeEditionBand.style.display = "inherit";
        mesProjetsModifierText.style.display = "inherit";
        modifierButton.style.display = "inherit";
    }
}

loginIndex();

signout.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.reload();
});

modifierButton.addEventListener("click", (e) => {
    e.preventDefault();
    const modalLink = document.querySelector('a[href="#modal1"]');
    if (modalLink) {
        modalLink.click(); // Déclencher l'événement click sur le lien pour ouvrir le modal
    }
});



// AFFICHER LES IMAGES ET LEURS LEGENDES SANS LES FILTRES  


async function afficherCaptions() {
    try {
        // Récupérer les données de l'API
        const response = await fetch(worksEndpoint + "works/");
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

        // Vider la galerie avant d'ajouter de nouvelles images
        sectionGallery.innerHTML = '';

        // Parcourir les données pour afficher les images et leurs légendes
        imageData.forEach(imageInfo => {
            // Créer un élément <figure>
            const figureElement = document.createElement("figure");

            // Créer l'élément image
            const imageElement = document.createElement("img");
            imageElement.src = imageInfo.imageUrl; // Source de l'image
            imageElement.alt = imageInfo.title || "Image"; // Texte alternatif

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
        });
    } catch (error) {
        console.error("Erreur dans afficherCaptions :", error);
    }
}

// Appeler la fonction pour afficher les images et les légendes
afficherCaptions();






// Fonction pour afficher les images par catégorie
/*
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
*/


// FONCTION POUR S'ASSURER QU'UN SEUL BOUTON EST SELECTIONNE A LA FOIS
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


/* MODALE */

/*
let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

*/







// AFFICHER LES IMAGES DANS LA MODALE 
let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    
    if (!target) {
        console.error('Modal target not found.');
        return;
    }

    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    // Appeler chargerImagesGalerie() après avoir ouvert la modal
    chargerImagesGalerie();
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

// Ajouter un écouteur d'événements sur le déclencheur de la modal
document.querySelectorAll('.js-modal').forEach(trigger => {
    trigger.addEventListener('click', openModal);
});

async function chargerImagesGalerie() {
    try {
        const response = await fetch("http://localhost:5678/api/works/");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }
        const imageData = await response.json();
        const modalGallery = document.querySelector('#modal1 .modal-gallery');

        if (!modalGallery) {
            console.error("Élément modal-gallery introuvable.");
            return;
        }

        modalGallery.innerHTML = '';

        if (!Array.isArray(imageData) || imageData.length === 0) {
            console.warn("Aucune donnée d'image à afficher.");
            return;
        }

        imageData.forEach(imageInfo => {
            // Créer un conteneur pour l'image et l'icône de poubelle
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            // Créer l'élément image
            const imageElement = document.createElement("img");
            imageElement.src = imageInfo.imageUrl;

            // Créer l'icône de poubelle
            const trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

            // Ajouter des écouteurs d'événements pour l'icône de poubelle
            trashIcon.addEventListener('click', () => {
                // Action à effectuer lors du clic sur l'icône de poubelle
                // Par exemple : supprimer l'image
                alert('Icon clicked!');
                // Vous pouvez ajouter la logique de suppression ici
            });

            // Ajouter l'image et l'icône au conteneur
            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(trashIcon);

            // Ajouter le conteneur à la galerie
            modalGallery.appendChild(imageContainer);
        });
    } catch (error) {
        console.error("Erreur dans chargerImagesGalerie :", error);
    }
}

// Appeler la fonction pour charger les images quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    chargerImagesGalerie();
});




// ACCES VERS LA MODALE 2
document.addEventListener('DOMContentLoaded', function() {
    const modal1 = document.getElementById('modal1');
    const modal2 = document.getElementById('modal2');
    const addPictureLink = document.querySelector('.add-picture-link');
    const closeButtons = document.querySelectorAll('.js-modal-close');

    // Fonction pour afficher une modale
    function openModal(modal) {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
    }

    // Fonction pour fermer une modale
    function closeModal(modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    // Gestion de l'ouverture de la modale 2
    addPictureLink.addEventListener('click', function(event) {
        event.preventDefault();
        closeModal(modal1);
        openModal(modal2);
    });

    // Gestion de la fermeture des modales
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Exemple d'ouverture de la première modale pour test
    const openModal1 = document.querySelector('a[href="#modal1"]');
    if (openModal1) {
        openModal1.addEventListener('click', function(event) {
            event.preventDefault();
            openModal(modal1);
        });
    }
});






// RETOUR VERS LA MODAL 1
document.addEventListener('DOMContentLoaded', function() {
    const modal1 = document.getElementById('modal1');
    const modal2 = document.getElementById('modal2');
    const addPictureLink = document.querySelector('.add-picture-link');
    const returnToModal1Link = document.querySelector('.return-to-modal1-link');
    const closeButtons = document.querySelectorAll('.js-modal-close');

    // Fonction pour afficher une modale
    function openModal(modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    }

    // Fonction pour fermer une modale
    function closeModal(modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    // Gestion de l'ouverture de la modale 2
    addPictureLink.addEventListener('click', function(event) {
        event.preventDefault();
        closeModal(modal1);
        openModal(modal2);
    });

    // Gestion du retour à la modale 1
    returnToModal1Link.addEventListener('click', function(event) {
        event.preventDefault();
        closeModal(modal2);
        openModal(modal1);
    });

    // Gestion de la fermeture des modales
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Exemple d'ouverture de la première modale pour test
    const openModal1 = document.querySelector('a[href="#modal1"]');
    if (openModal1) {
        openModal1.addEventListener('click', function(event) {
            event.preventDefault();
            openModal(modal1);
        });
    }
});
