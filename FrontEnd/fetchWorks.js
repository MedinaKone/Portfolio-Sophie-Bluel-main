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








// Fonction pour afficher les images par catégorie

function displayImagesByCategory(imageData, categoryId) {
    const sectionGallery = document.querySelector('.gallery');
    sectionGallery.innerHTML = ''; // Vider la galerie avant de réafficher

    //Filtrage des images
    let filteredImages;

    if (categoryId === 'Tous') {
        filteredImages = imageData; // Afficher tous les éléments
    } else {
        filteredImages = imageData.filter(image => image.categoryId === categoryId); // Filtrer par `categoryId`
    }

    //Boucle pour afficher les images
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







// Fonction asynchrone pour créer les boutons de filtres et afficher les images
async function createCategoryButtonsAndDisplayImages() {
    try {
        //Récupération des données de l'API
        const categoryResponse = await fetch(worksEndpoint + 'categories');
        const worksResponse = await fetch(worksEndpoint + 'works');

        //Vérification des réponses
        if (!categoryResponse.ok || !worksResponse.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        //Conversion des réponses en JSON
        const categories = await categoryResponse.json();
        const imageData = await worksResponse.json();

        //Sélection de la section "portfolio" où les boutons et images seront affichées
        const sectionPortfolio = document.querySelector('#portfolio');

        // Créer un conteneur pour les boutons
        const divButton = document.createElement("div");
        divButton.setAttribute("class", "filtres");

        // Ajouter le bouton "Tous"
        const allButton = createButton("Tous", () => displayImagesByCategory(imageData, 'Tous'));
        divButton.appendChild(allButton);

        // Création et ajout des boutons pour chaque catégories
        categories.forEach(category => {
            const categoryButton = createButton(category.name, () => displayImagesByCategory(imageData, category.id));
            divButton.appendChild(categoryButton);
        });

        sectionPortfolio.insertBefore(divButton, document.querySelector('.gallery')); // Ajouter les boutons au portfolio

        // Afficher tous les éléments par défaut ("Tous")
        displayImagesByCategory(imageData, 'Tous');

        //Signalement d'une erreur
    } catch (error) {
        console.error("Erreur lors de la création des boutons ou de l'affichage des images :", error);
    }
}

// Appeler la fonction pour créer les boutons de filtres et afficher les images
createCategoryButtonsAndDisplayImages();











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
    button.addEventListener("click", function () {
        buttonSelection(this); // Marque ce bouton comme sélectionné
        onClick(); // Exécute la fonction de filtre
    });

    return button;
}


/* MODALE 1*/


// OUVERTURE ET FERMETURE DE LA MODALE

let modal = null;

//Ouverture de la modale 1
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));

    //Signalement d'une erreur
    if (!target) {
        console.error('Modal target not found.');
        return;
    }

    //Rend la modale visible
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    // Appeler chargerImagesGalerie() après avoir ouvert la modal
    chargerImagesGalerie();
};


//Fermeture de la modale 
const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    //Rendre la modale invisble
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







// AFFICHAGE ET SUPPRESSION DES PROJETS DANS LA MODALE 1
// Ajouter un écouteur d'événements sur le déclencheur de la modal
document.querySelectorAll('.js-modal').forEach(trigger => {
    trigger.addEventListener('click', openModal);
});

// CHARGER LES PROJETS DANS LA MODALE
async function chargerImagesGalerie() {
    // Récupère les données depuis l'API
    try {
        const response = await fetch("http://localhost:5678/api/works/");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }
        const imageData = await response.json();

        //Sélection des sections où les images seront affichées
        const modalGallery = document.querySelector('#modal1 .modal-gallery');
        const mainGallery = document.querySelector('.gallery');

        //Vérifie que les éléments existent
        if (!modalGallery) {
            console.error("Élément modal-gallery introuvable.");
            return;
        }

        //Vide la galerie
        modalGallery.innerHTML = '';

        //Vérifie s'il y a des données à afficher
        if (!Array.isArray(imageData) || imageData.length === 0) {
            console.warn("Aucune donnée d'image à afficher.");
            return;
        }

        // Création du projet
        imageData.forEach((imageInfo) => {
            // Créer un conteneur pour l'image et l'icône de poubelle dans la modale
            const modalImageContainer = document.createElement("div");
            modalImageContainer.classList.add("image-container");

            // Créer l'élément image
            const modalImageElement = document.createElement("img");
            modalImageElement.src = imageInfo.imageUrl;

            // Créer l'icône de poubelle
            const trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

            // Ajouter des écouteurs d'événements pour l'icône de poubelle
            trashIcon.addEventListener('click', () => {
                // Supprimer le conteneur de l'image de la modale
                modalImageContainer.remove();

                //SUPPRIMER UN PROJET
                // Supprimer le conteneur de l'image de la galerie principale en utilisant l'URL de l'image
                //Sélectionne les éléments et les convertit en tableau
                const mainImageContainer = Array.from(mainGallery.querySelectorAll('figure')).find(figure => {

                    //Trouve le bon conteneur
                    const img = figure.querySelector('img');
                    return img && img.src === imageInfo.imageUrl;
                });

                //Suppression du conteneur
                if (mainImageContainer) {
                    mainImageContainer.remove();
                }
            });

            // Ajouter l'image et l'icône au conteneur de la modale
            modalImageContainer.appendChild(modalImageElement);
            modalImageContainer.appendChild(trashIcon);

            // Ajouter le conteneur à la galerie de la modale
            modalGallery.appendChild(modalImageContainer);
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
document.addEventListener('DOMContentLoaded', function () {
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

    //Ferme la modale 1 et ouvre la modale 2
    addPictureLink.addEventListener('click', function (event) {
        event.preventDefault();
        closeModal(modal1);
        openModal(modal2);
    });

    // Gestion de la fermeture des modales
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
});











// RETOUR VERS LA MODAL 1
document.addEventListener('DOMContentLoaded', function () {

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
    addPictureLink.addEventListener('click', function (event) {
        event.preventDefault();
        closeModal(modal1);
        openModal(modal2);
    });

    // Gestion du retour à la modale 1
    returnToModal1Link.addEventListener('click', function (event) {
        event.preventDefault();
        closeModal(modal2);
        openModal(modal1);
    });

    // Gestion de la fermeture des modales
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

});










// AJOUTER UNE IMAGE DANS LA MODALE 2

document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.querySelector('.add-picture-button');
    const fileInput = document.querySelector('.file-input');
    const picturesPreview = document.querySelector('.pictures-preview');
    const icon = document.querySelector('.fa-image');
    const text = document.querySelector('.pictures-caracteristics');
    const errorMessage = document.querySelector('.error-message');

    //Ouvre la fenêtre de sélection de fichiers
    addButton.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0]; // Récupère le 1er fichier sélectionné

        //Vérifie si le fichier est une image JPEG ou PNG et s'il est inférieur à 4 Mo.
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            //Lance le fichier s'il est valide
            const reader = new FileReader();
            reader.onload = function (e) {
                // Créer un élément image
                const img = document.createElement('img');
                img.src = e.target.result;

                // Supprime le contenu précédent et affiche la nouvelle image
                picturesPreview.innerHTML = '';
                picturesPreview.appendChild(img);

                // Cache l'icône, le texte et le bouton
                icon.classList.add('hidden');
                text.classList.add('hidden');
                addButton.classList.add('hidden');

                // Cache le message d'erreur si le fichier est valide
                errorMessage.classList.add('hidden');
            };
            reader.readAsDataURL(file); //Démarre la lecture du fichier
        } else {
            // Affiche le message d'erreur si le fichier n'est pas valide
            errorMessage.classList.remove('hidden');
        }
    });
});






// RECUPERER LES CATEGORIES (MODALE 2)

document.addEventListener('DOMContentLoaded', function () {
    //Recherche l'id "categorie" dans le formulaire
    const categoriesSelect = document.getElementById('categorie');

    // Récupère les catégories depuis l'API
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
            const option = document.createElement('option'); //Créé un élément option
            option.value = category.id; //Récupère l'id de la categorie
            option.textContent = category.name; // Définit le texte visible de chaque option
            categoriesSelect.appendChild(option); // Ajoute chaque option dans le formulaire
        });
    }

    // Appel à la fonction pour récupérer et afficher les catégories
    fetchCategories();
});















// VALIDATION DU FORMULAIRE

document.addEventListener('DOMContentLoaded', function () {
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
        const titre = titreInput.value.trim(); //Suppression des espaces inutiles
        const categorie = categorieSelect.value;
        const isImageSelected = !!selectedImage;
        const isTitreValid = titre !== '';
        const isCategorieValid = categorie !== '';
        const isImageValid = isImageSelected && selectedImage.complete && selectedImage.naturalWidth > 0 && selectedImage.naturalHeight > 0; //Vérfie qu'il s'agit bien d'une image

        // Vérifie si tous les champs sont remplis et valides
        const isFormValid = isImageValid && isTitreValid && isCategorieValid;

        // Affiche les messages d'erreur appropriés uniquement si les conditions ne sont pas remplies
        errorMessageImage.style.display = isImageValid || !isImageSelected ? 'none' : 'block';
        errorMessageForm.style.display = (isTitreValid && isCategorieValid) || (!isTitreValid && !isCategorieValid) ? 'none' : 'block';

        // Change la couleur du bouton "Valider" en vert si le formulaire est valide
        if (isFormValid) {
            validerButton.classList.add('valid-form');
        } else {
            validerButton.classList.remove('valid-form');
        }

        // Active ou désactive le bouton "Valider" en fonction de l'état du formulaire
        validerButton.disabled = !isFormValid;
    }

    // Ouvre l'explorateur de fichiers
    addButton.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        // Vérfie les caractéristiques du fichier
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (e) {
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

    validerButton.addEventListener('click', function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        const titre = titreInput.value.trim();
        const categorie = categorieSelect.value;

        //Vérifie les 3 conditions lorsqu'on clique sur le bouton "valider"
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
        modal2Link.addEventListener('click', function () {
            errorMessageImage.style.display = 'none';
            errorMessageForm.style.display = 'none';
            validerButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
            validerButton.disabled = true; // Désactive le bouton
        });
    });
});















// ENVOI DU PROJET VERS L'API

function addProject(event) {
    event.preventDefault();

    const addProjetForm = document.querySelector('.new-picture'); // Sélection du formulaire

    const token = sessionStorage.getItem("Token"); //Récupération du token

    // Récupération des éléments du formulaire
    const titleNewProject = document.getElementById("titre").value;
    const categoryNewProject = parseInt(document.getElementById("categorie").value, 10);
    const imageNewProject = document.getElementById("pictures-preview").files[0];

    //Vérifie que tous les éléments sont présents
    if (!titleNewProject || !categoryNewProject || !imageNewProject) {
        console.error('All fields are required.');
        return;
    }

    // Créationn d'un nouvel objet pour stocker les données du formulaires
    const formData = new FormData();
    formData.append("title", titleNewProject);
    formData.append("category", categoryNewProject);
    formData.append('image', imageNewProject);
    console.log('formData:', formData);

    //Envoi de l'objet 
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la requête : ' + response.status);
            }
            return response.json();
        })
        .then(data => {

            console.log('Projet ajouté avec succès:', data);

        })
        .catch(error => {

            console.error('Erreur lors de l\'envoi du projet :', error);
        });
}

//Lance l'envoi lorsqu'on appuie sur le bouton "valider"
document.querySelector('.new-picture').addEventListener('submit', addProject);
