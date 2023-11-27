document.addEventListener("DOMContentLoaded", function() {

    // Get the search input element
const searchBar = document.getElementById('searchBar');

// Attach an event listener
searchBar.addEventListener('input', function() {
    chercherRecettes(searchBar.value);
});

let recipes = [];

fetch('assets/recipes.json')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        generateCards(recipes);  // Affiche toutes les recettes au chargement initial
    })
    .catch(error => console.error('Error loading the recipes:', error));

function correspondARecherche(texte, recherche) {
    return texte.toLowerCase().includes(recherche.toLowerCase());
}        


function chercherRecettes(champRecherche) {
    let resultats = [];
    let recherche = champRecherche.trim();

    // If search input is empty or less than 3 characters, display all recipes
    if (recherche.length === 0 || recherche.length < 3) {
        if (recherche.length < 3 && recherche.length !== 0) {
            console.log("Entrez au moins 3 caractères pour rechercher.");
        }
        generateCards(recipes);
        return;
    }

    for (let i = 0; i < recipes.length; i++) {
        let correspond = false;

        // Recherche dans le nom
        if (correspondARecherche(recipes[i].name, recherche)) {
            correspond = true;
        }

        // Recherche dans la description
        if (!correspond && correspondARecherche(recipes[i].description, recherche)) {
            correspond = true;
        }

        // Recherche dans les ingrédients
        for (let j = 0; j < recipes[i].ingredients.length; j++) {
            if (correspondARecherche(recipes[i].ingredients[j].ingredient, recherche)) {
                correspond = true;
                break;
            }
        }

        if (correspond) {
            resultats.push(recipes[i]);
        }
    }

    // Actualise l'interface avec les résultats de recherche
    generateCards(resultats);

    // Display message if no results found
    const messageElement = document.querySelector('.message');
    if (resultats.length === 0) {
        messageElement.innerHTML = `Aucune recette ne contient '${recherche}'`;
    } else {
        messageElement.innerHTML = ''; // Clear the message when there are results
    }
}



function generateCards(filteredRecipes) {
    const container = document.querySelector('.content-container');
    
    container.innerHTML = '';  // Vider le conteneur

    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recette-card';
        
        // Generate the list of ingredients
        let ingredientsList = '<ul>';
        recipe.ingredients.forEach(ingredient => {
            ingredientsList += `<li>${ingredient.ingredient}: ${ingredient.quantity || ''} ${ingredient.unit || ''}</li>`;
        });
        ingredientsList += '</ul>';

        card.innerHTML = `
            <div class="card">
                <img src="images/${recipe.image}" alt="${recipe.name}" class="card-img" />
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <h4>Ingredients:</h4>
                ${ingredientsList}
            </div>
        `;

        container.appendChild(card);
    });
}
})


// Dropdowns

// const dropbtn = document.querySelector(".dropbtn");
//   const dropdownContent = document.querySelector(".dropdown-content");

//   dropbtn.addEventListener("click", function () {
//     dropdownContent.classList.toggle("show");
//   });

//   document.addEventListener("click", function (event) {
//     if (!event.target.matches('.dropbtn') && dropdownContent.classList.contains("show")) {
//       dropdownContent.classList.remove("show");
//     }
//   });