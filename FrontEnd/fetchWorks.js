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


            /*
            // Ajouter des écouteurs d'événements pour l'icône de poubelle
            trashIcon.addEventListener('click', () => {
                // Action à effectuer lors du clic sur l'icône de poubelle
                // Par exemple : supprimer l'image
                alert('Icon clicked!');
                // Vous pouvez ajouter la logique de suppression ici
            });
            */

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










// AJOUTER UNE IMAGE DANS LA MODALE 2

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessage = document.querySelector('.error-message');

    addButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create an image element
                const img = document.createElement('img');
                img.src = e.target.result;

                // Clear the preview container and add the new image
                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                // Hide the icon, text, and button
                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                // Hide the error message if the file is valid
                errorMessage.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            // Show the error message if the file is invalid
            errorMessage.classList.remove('hidden');
        }
    });
});






// RECUPERER LES CATEGORIES (MODALE 2)

document.addEventListener('DOMContentLoaded', function() {
    const categoriesSelect = document.getElementById('categorie');

    // Fonction pour récupérer les catégories depuis l'API
    function fetchCategories() {
        fetch(worksEndpoint + 'categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                populateCategories(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    // Fonction pour remplir le select avec les catégories
    function populateCategories(categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Supposons que chaque catégorie a un id
            option.textContent = category.name;
            categoriesSelect.appendChild(option);
        });
    }

    // Appel à la fonction pour récupérer et afficher les catégories
    fetchCategories();
});









// AJOUTE L'IMAGE ET SA DESCRIPTION DANS LE PORTFOLIO

/*
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessage = document.querySelector('.error-message');
    const gallery = document.querySelector('.gallery');
    const validerButton = document.querySelector('.valider');
    const titreInput = document.getElementById('titre');
    
    let selectedImage = null;

    addButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create an image element
                const img = document.createElement('img');
                img.src = e.target.result;


                // Clear the preview container and add the new image
                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                // Hide the icon, text, and button
                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                // Hide the error message if the file is valid
                errorMessage.classList.add('hidden');

                // Store the selected image
                selectedImage = img;
            };
            reader.readAsDataURL(file);
        } else {
            // Show the error message if the file is invalid
            errorMessage.classList.remove('hidden');
        }
    });

    validerButton.addEventListener('click', function() {
        const titre = titreInput.value.trim();
        if (selectedImage && titre) {
            // Create a figure element
            const figure = document.createElement('figure');

            // Clone the selected image and adjust its size for the gallery
            const galleryImage = selectedImage.cloneNode(true);
            galleryImage.style.width = '346.66px';
            galleryImage.style.height = '461.83px';

            // Create a figcaption element and set its content
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = titre;

            // Append the image and caption to the figure
            figure.appendChild(galleryImage);
            figure.appendChild(figcaption);

            // Append the figure to the gallery
            gallery.appendChild(figure);

            // Close modal2
            const modal2 = document.getElementById('modal2');
            modal2.style.display = 'none';

            // Reset the form and preview for the next addition
            picturesPreview.innerHTML = '';
            icon.classList.remove('hidden');
            text.classList.remove('hidden');
            addButton.classList.remove('hidden');
            titreInput.value = '';
            fileInput.value = '';
            selectedImage = null;
        } else {
            alert('Veuillez sélectionner une image et entrer un titre avant de valider.');
        }
    });
});

*/






/*
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessageImage = document.querySelector('.error-message-image');
    const errorMessageForm = document.querySelector('.error-message-form');
    const gallery = document.querySelector('.gallery');
    const validerButton = document.querySelector('.valider');
    const titreInput = document.getElementById('titre');
    const categorieSelect = document.getElementById('categorie');

    let selectedImage = null;

    // Fonction pour vérifier l'état des champs et activer/désactiver le bouton "Valider"
    function checkFormValidity() {
        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        const isImageSelected = !!selectedImage;
        const isTitreValid = titre !== '';
        const isCategorieValid = categorie !== '';
        const isImageValid = isImageSelected && selectedImage.complete && selectedImage.naturalWidth > 0 && selectedImage.naturalHeight > 0;

        // Vérifie si tous les champs sont remplis et valides
        const isFormValid = isImageValid && isTitreValid && isCategorieValid;

        // Change la couleur du bouton "Valider" en vert si le formulaire est valide
        validerButton.style.backgroundColor = isFormValid ? '#1D6154' : '';

        // Affiche les messages d'erreur appropriés en fonction de l'état du formulaire
        errorMessageImage.classList.toggle('hidden', isImageValid);
        errorMessageForm.classList.toggle('hidden', isFormValid);

        // Active ou désactive le bouton "Valider" en fonction de l'état du formulaire
        validerButton.disabled = !isFormValid;
    }

    addButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '129px';
                img.style.height = '169px'; // Ajustement de la hauteur à 169px

                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                selectedImage = img;

                // Vérifie la validité du formulaire après la sélection de l'image
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        } else {
            errorMessageImage.textContent = 'Veuillez sélectionner une image valide (jpg ou png) de taille maximale 4MB.';
            errorMessageImage.classList.remove('hidden');
            errorMessageForm.classList.add('hidden');
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        }
    });

    validerButton.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        if (selectedImage && titre !== '' && categorie !== '') {
            const figure = document.createElement('figure');

            const galleryImage = selectedImage.cloneNode(true);
            galleryImage.style.width = '346.66px';
            galleryImage.style.height = '461.83px';
            figure.appendChild(galleryImage);

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = titre;

            figure.appendChild(figcaption);

            gallery.appendChild(figure);

            const modal2 = document.getElementById('modal2');
            modal2.style.display = 'none';

            picturesPreview.innerHTML = '';
            icon.classList.remove('hidden');
            text.classList.remove('hidden');
            addButton.classList.remove('hidden');
            titreInput.value = '';
            fileInput.value = '';
            selectedImage = null;

            // Réinitialise les messages d'erreur
            errorMessageImage.classList.add('hidden');
            errorMessageForm.classList.add('hidden');

            // Vérifie la validité du formulaire après l'ajout de l'image
            checkFormValidity();
        } else {
            errorMessageForm.classList.remove('hidden');
            errorMessageImage.classList.add('hidden');
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        }
    });

    // Écouteurs d'événements pour vérifier la validité du formulaire lorsque les champs sont modifiés
    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);
});
*/












/*

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessageImage = document.querySelector('.error-message.hidden-img');
    const errorMessageForm = document.querySelector('.error-message.hidden-form');
    const gallery = document.querySelector('.gallery');
    const validerButton = document.querySelector('.valider');
    const titreInput = document.getElementById('titre');
    const categorieSelect = document.getElementById('categorie');

    let selectedImage = null;

    // Fonction pour vérifier l'état des champs et activer/désactiver le bouton "Valider"
    function checkFormValidity() {
        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        const isImageSelected = !!selectedImage;
        const isTitreValid = titre !== '';
        const isCategorieValid = categorie !== '';
        const isImageValid = isImageSelected && selectedImage.complete && selectedImage.naturalWidth > 0 && selectedImage.naturalHeight > 0;

        // Vérifie si tous les champs sont remplis et valides
        const isFormValid = isImageValid && isTitreValid && isCategorieValid;

        // Affiche les messages d'erreur appropriés uniquement si les conditions ne sont pas remplies
        errorMessageImage.classList.toggle('hidden', isImageValid);
        errorMessageForm.classList.toggle('hidden', isTitreValid && isCategorieValid);

        // Change la couleur du bouton "Valider" en vert si le formulaire est valide
        validerButton.style.backgroundColor = isFormValid ? '#1D6154' : '';

        // Active ou désactive le bouton "Valider" en fonction de l'état du formulaire
        validerButton.disabled = !isFormValid;
    }

    addButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '129px';
                img.style.height = '169px'; // Ajustement de la hauteur à 169px

                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                selectedImage = img;

                // Vérifie la validité du formulaire après la sélection de l'image
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        } else {
            errorMessageImage.textContent = 'Veuillez sélectionner une image valide (jpg ou png) de taille maximale 4MB.';
            errorMessageImage.classList.toggle('hidden', file === null);
            errorMessageForm.classList.add('hidden');
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        }
    });

    validerButton.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        if (selectedImage && titre !== '' && categorie !== '') {
            const figure = document.createElement('figure');

            const galleryImage = selectedImage.cloneNode(true);
            galleryImage.style.width = '346.66px';
            galleryImage.style.height = '461.83px';
            figure.appendChild(galleryImage);

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = titre;

            figure.appendChild(figcaption);

            gallery.appendChild(figure);

            const modal2 = document.getElementById('modal2');
            modal2.style.display = 'none';

            picturesPreview.innerHTML = '';
            icon.classList.remove('hidden');
            text.classList.remove('hidden');
            addButton.classList.remove('hidden');
            titreInput.value = '';
            fileInput.value = '';
            selectedImage = null;

            // Réinitialise les messages d'erreur
            errorMessageImage.classList.add('hidden');
            errorMessageForm.classList.add('hidden');

            // Vérifie la validité du formulaire après l'ajout de l'image
            checkFormValidity();
        } else {
            errorMessageForm.classList.toggle('hidden', !(titre === '' && categorie === ''));
            errorMessageImage.classList.add('hidden');
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        }
    });

    // Écouteurs d'événements pour vérifier la validité du formulaire lorsque les champs sont modifiés
    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);
});

*/








document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessageImage = document.querySelector('.error-message.hidden-img');
    const errorMessageForm = document.querySelector('.error-message.hidden-form');
    const gallery = document.querySelector('.gallery');
    const validerButton = document.querySelector('.valider');
    const titreInput = document.getElementById('titre');
    const categorieSelect = document.getElementById('categorie');

    let selectedImage = null;

    // Fonction pour vérifier l'état des champs et activer/désactiver le bouton "Valider"
    function checkFormValidity() {
        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        const isImageSelected = !!selectedImage;
        const isTitreValid = titre !== '';
        const isCategorieValid = categorie !== '';
        const isImageValid = isImageSelected && selectedImage.complete && selectedImage.naturalWidth > 0 && selectedImage.naturalHeight > 0;

        // Vérifie si tous les champs sont remplis et valides
        const isFormValid = isImageValid && isTitreValid && isCategorieValid;

        // Affiche les messages d'erreur appropriés uniquement si les conditions ne sont pas remplies
        errorMessageImage.style.display = isImageValid || !isImageSelected ? 'none' : 'block';
        errorMessageForm.style.display = (isTitreValid && isCategorieValid) || (!isTitreValid && !isCategorieValid) ? 'none' : 'block';

        // Change la couleur du bouton "Valider" en vert si le formulaire est valide
        validerButton.style.backgroundColor = isFormValid ? '#1D6154' : '';

        // Active ou désactive le bouton "Valider" en fonction de l'état du formulaire
        validerButton.disabled = !isFormValid;
    }

    addButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '129px';
                img.style.height = '169px'; // Ajustement de la hauteur à 169px

                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                selectedImage = img;

                // Réinitialise les messages d'erreur d'image
                errorMessageImage.style.display = 'none';

                // Vérifie la validité du formulaire après la sélection de l'image
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        } else {
            selectedImage = null; // Réinitialise l'image sélectionnée
            errorMessageImage.style.display = 'block'; // Affiche le message d'erreur d'image
            errorMessageForm.style.display = 'none'; // Masque le message d'erreur de formulaire

            picturesPreview.innerHTML = '';
            icon.classList.remove('hidden');
            text.classList.remove('hidden');
            addButton.classList.remove('hidden');

            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        }
    });

    validerButton.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;
        if (selectedImage && titre !== '' && categorie !== '') {
            const figure = document.createElement('figure');

            const galleryImage = selectedImage.cloneNode(true);
            galleryImage.style.width = '346.66px';
            galleryImage.style.height = '461.83px';
            galleryImage.style.objectFit = 'cover';
            figure.appendChild(galleryImage);

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = titre;

            figure.appendChild(figcaption);

            gallery.appendChild(figure);

            const modal2 = document.getElementById('modal2');
            modal2.style.display = 'none';

            picturesPreview.innerHTML = '';
            icon.classList.remove('hidden');
            text.classList.remove('hidden');
            addButton.classList.remove('hidden');
            titreInput.value = '';
            categorieSelect.value = '';
            fileInput.value = '';
            selectedImage = null;

            // Réinitialise les messages d'erreur
            errorMessageImage.style.display = 'none';
            errorMessageForm.style.display = 'none';

            // Vérifie la validité du formulaire après l'ajout de l'image
            checkFormValidity();
        } else {
            // Affiche le message d'erreur de formulaire si le titre ou la catégorie n'est pas rempli
            errorMessageForm.style.display = 'block';
            errorMessageImage.style.display = 'none'; // Masque le message d'erreur d'image
        }
    });

    // Écouteurs d'événements pour vérifier la validité du formulaire lorsque les champs sont modifiés
    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);

    // Réinitialiser les messages d'erreur lorsque la modal s'ouvre
    document.querySelectorAll('a[href="#modal2"]').forEach(modal2Link => {
        modal2Link.addEventListener('click', function() {
            errorMessageImage.style.display = 'none';
            errorMessageForm.style.display = 'none';
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        });
    });
});
