let recipes = [];

let activeTags = [];

function generateCards(filteredRecipes) {
    const container = document.querySelector('.content-container');
    const recipesCountElement = document.getElementById('recipes-count'); // L'élément pour afficher le nombre
    recipesCountElement.className="recette-count";

    container.innerHTML = '';  // Vider le conteneur

    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recette-card';
        
        // Generate the list of ingredients
        let ingredientsList = '<ul class="ingredients-list">';
        recipe.ingredients.forEach(ingredient => {
            ingredientsList += `<li><span class="ingredient-name">${ingredient.ingredient}</span><br> <span class="ingredient-quantity">${ingredient.quantity || ''}</span> <span class="ingredient-unit">${ingredient.unit || ''}</span></li>`;
        });
        ingredientsList += '</ul>';

        card.innerHTML = `
            <div class="card">
                <img src="images/${recipe.image}" alt="${recipe.name}" class="card-img" />
                <div class="structure-card">
                <h3 class="card-title">${recipe.name}</h3>
                <p class="card-description"><p class="recette">RECETTE</p><p class="paragraph">${recipe.description}</p></p>
                <h4 class="ingredients-h4"><p class="ingredients">INGREDIENTS</p></h4>
                <div class="ingredients-list-container">${ingredientsList}</div>
                <p class="card-time">${recipe.time + "min"}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
    // Mettre à jour le nombre de recettes affichées
recipesCountElement.textContent = `${filteredRecipes.length} RECETTES`;
}

document.addEventListener("DOMContentLoaded", function() {
    
    // Fetch the recipes and populate the dropdowns
    fetch('assets/recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = data;
            populateDropdowns(recipes); // Populate dropdowns with unique items
            generateCards(recipes); // Display all recipes at initial load
        })
        .catch(error => console.error('Error loading the recipes:', error));

     // Function to populate dropdowns
    
    function populateDropdowns(filteredRecipes) {
        // Sets to hold the unique items
        const ingredientsSet = new Set();
        const appliancesSet = new Set();
        const utensilsSet = new Set();
    
        // Populate the Sets with items from the filtered recipes
        filteredRecipes.forEach(recipe => {
            recipe.ingredients.forEach(item => ingredientsSet.add(item.ingredient));
            appliancesSet.add(recipe.appliance);
            recipe.ustensils.forEach(item => utensilsSet.add(item));
        });
    
    

        // Function to add items to a specific dropdown, without removing the search bar
const addItemsToDropdown = (selector, items) => {
    const dropdown = document.querySelector(selector);
    const existingItems = dropdown.querySelectorAll('.dropdown-item');
    
    // Remove all existing items except for the search bar
    existingItems.forEach(item => item.remove());

    // Append new items
    items.forEach(item => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'dropdown-item';
        element.textContent = item;
        element.addEventListener('click', function() {
            addTag(item);
            filterRecipesByTags(); // Filter recipes based on the new tags
            console.log(item + ' selected');
        });
        dropdown.appendChild(element);
    });
};

        // Convert each Set to an array and populate the dropdowns
        addItemsToDropdown('.dropdown-content[data-dropdown="ingredients"]', Array.from(ingredientsSet));
        addItemsToDropdown('.dropdown-content[data-dropdown="appliances"]', Array.from(appliancesSet));
        addItemsToDropdown('.dropdown-content[data-dropdown="ustensils"]', Array.from(utensilsSet));
    }
    
    // Search functionality
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        chercherRecettes(searchBar.value);
    });

    // Function to check if a text includes the search term
    function correspondARecherche(texte, recherche) {
        return texte.toLowerCase().includes(recherche.toLowerCase());
    }


    function chercherRecettes(champRecherche) {
        
        let resultats = [];
        let recherche = champRecherche.trim();
        const messageElement = document.querySelector('.message');

        
        if (recherche.length <3) {
            populateDropdowns(recipes); // Repopulate dropdowns with all items

            generateCards(recipes);
            messageElement.innerHTML = ''; // Clear any existing message when the input is cleared.
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
            // Display message if no results found
            if (resultats.length === 0) {
                messageElement.innerHTML = `Aucune recette ne contient '${recherche}' vous pouvez chercher «
                tarte aux pommes », « poisson », etc.`;
            } else {
                populateDropdowns(resultats); // Update dropdowns with items from filtered recipes
                generateCards(resultats); // Update the UI with search results

                messageElement.innerHTML = ''; // Clear the message when there are results
            }
            if (correspond) {
                resultats.push(recipes[i]);
            }
            
        }
    
        // Actualise l'interface avec les résultats de recherche
        generateCards(resultats);
    
        
    }


    // Filter Dropdowns

    searchBar.addEventListener('input', function() {
        filterDropdowns(searchBar.value);
        chercherRecettes(searchBar.value);
    });
    
    function filterDropdowns(searchTerm) {
        const allDropdownItems = document.querySelectorAll('.dropdown .dropdown-content button');
        allDropdownItems.forEach(item => {
            // Convertir en minuscules pour une recherche insensible à la casse
            if (item.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.style.display = ''; // Affiche le bouton s'il correspond
            } else {
                item.style.display = 'none'; // Cache le bouton s'il ne correspond pas
            }
        });
    }

    function closeAllDropdowns() {
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        dropdownContents.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    // Close all dropdowns when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn')) {
            closeAllDropdowns();
        }
    });

    // Function to filter dropdown items based on search input
    function filterDropdownItems(event) {
    const input = event.target;
    const filter = input.value.toLowerCase();
    const dropdown = input.closest('.dropdown-content');
    const items = dropdown.querySelectorAll('.dropdown-item');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
            item.style.display = ""; // Show item
        } else {
            item.style.display = "none"; // Hide item
        }
    });
}

// Attach event listeners to all dropdown search inputs
document.querySelectorAll('.input-dropdowns').forEach(input => {
    input.addEventListener('keyup', filterDropdownItems);
});


    

function filterRecipesByTags() {
    let filteredRecipes = recipes.filter(recipe => {
        // Tous les tags doivent correspondre pour qu'une recette soit incluse
        return activeTags.every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient.includes(tag)) ||
            recipe.appliance.includes(tag) ||
            recipe.ustensils.includes(tag)
        );
    });
    generateCards(filteredRecipes); // Générer les cartes pour les recettes filtrées
    // Update dropdowns with items from filtered recipes
    populateDropdowns(filteredRecipes);
}

function addTag(tagName) {
    if (!activeTags.includes(tagName)) {
        activeTags.push(tagName); // Ajouter le tag seulement s'il n'est pas déjà présent

        // Créer le tag HTML
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = tagName;
        
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'tag-close-btn';
        closeBtn.onclick = function() {
            removeTag(tagName, tag);
        };

        tag.appendChild(closeBtn);

        document.getElementById('tags-container').appendChild(tag);
    }
}

function removeTag(tagName, tagElement) {
    activeTags = activeTags.filter(tag => tag !== tagName); // Enlever le tag des actifs
    tagElement.remove(); // Enlever l'élément HTML du tag
    filterRecipesByTags(); // Re-filtrer les recettes
}
})