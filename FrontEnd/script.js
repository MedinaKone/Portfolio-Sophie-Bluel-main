/*async function ajouterCategories() {
    try{
        const response = await fetch("http://localhost:5678/api/categories/");

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données (categories).");
        }

        const categoriesData = await response.json();

        let balisesFigure = document.querySelector("figure");

        if (!balisesFigure) {
            console.error("Balises `figure` introuvable.");
            return;
        }

        if(!Array.isArray(categoriesData)) || categoriesData.length === 0){
            console.warn("Aucune donnée de catégories à affihcer.");
            return;
        }

        for (let i = 0; i < categoriesData.length; i++) {
            const categoriesInfo = categoriesData[i];

            const categoryElement = document.createElement("p");
            categoryElement.src = categoriesInfo.
        }
    }
}