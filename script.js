document.addEventListener('DOMContentLoaded', function() {

    const isIndexPage = window.location.pathname.includes('index.html');
    const isDetailsPage = window.location.pathname.includes('details');
    const isEditPage = window.location.pathname.includes('edit');
    const difficultyLevels = ['Easy', 'Moderate', 'Intermediate', 'Difficult', 'Very Difficult'];

    let recipes = [];

    // Function to load recipes from local storage
    function loadRecipes() {
        recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    }

    // Function to save recipes to local storage
    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
    // Function to display recipes on the index page
    function displayRecipes(recipesToDisplay) {
        const recipeContainer = document.querySelector('.recipe-container');
        if (!recipeContainer) return;
        recipeContainer.innerHTML = ''; // Clear previous content

        recipesToDisplay.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>Star Rating: <span class="star-rating"> ${'<i class="fa-solid fa-star"></i>'.repeat(recipe.rating)}</span> (${recipe.rating})</p>
                <p>Difficulty: ${difficultyLevels[recipe.difficulty-1]} (${recipe.difficulty})</p>
                <p id="ingredients-p">Ingredients: ${recipe.ingredients}</p>
                <button class="view-details-btn" data-recipe-id="${recipe.id}">View Details</button>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }

    // Function to sort recipes by rating in ascending order
    function sortByRatingAsc(recipes) {
        return recipes.slice().sort((a, b) => a.rating - b.rating || a.difficulty - b.difficulty || a.id - b.id);
    }

    // Function to sort recipes by rating in descending order
    function sortByRatingDesc(recipes) {
        return recipes.slice().sort((a, b) => b.rating - a.rating || b.difficulty - a.difficulty || a.id - b.id);
    }

    // Function to sort recipes by difficulty in ascending order
    function sortByDifficultyAsc(recipes) {
        return recipes.slice().sort((a, b) => a.difficulty - b.difficulty || a.rating - b.rating || a.id - b.id);
    }   

    // Function to sort recipes by difficulty in descending order
    function sortByDifficultyDesc(recipes) {
        return recipes.slice().sort((a, b) => b.difficulty - a.difficulty || b.rating - a.rating || a.id - b.id);
    }

    // Function to filter recipes based on search keyword
    function filterRecipes(keyword) {
        return recipes.filter(recipe => recipe.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    // Event listener for dropdown menu items
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        item.addEventListener('click', event => {
            const sortBy = event.target.textContent; // Get the text content of the clicked menu item
            let sortedRecipes = [];

            // Sort recipes based on the selected option
            switch (sortBy) {
                case 'Asc by Stars':
                    sortedRecipes = sortByRatingAsc(recipes);
                    break;
                case 'Desc by Stars':
                    sortedRecipes = sortByRatingDesc(recipes);
                    break;
                case 'Asc by Difficulty':
                    sortedRecipes = sortByDifficultyAsc(recipes);
                    break;
                case 'Desc by Difficulty':
                    sortedRecipes = sortByDifficultyDesc(recipes);
                    break;
                default:
                    sortedRecipes = recipes; // Default: no sorting
            }

            // Display the sorted recipes
            displayRecipes(sortedRecipes);
        });
    });

    // Event listener for search input
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            if (keyword !== '') {
                const filteredRecipes = filterRecipes(keyword);
                displayRecipes(filteredRecipes);
            }
            else{
                displayRecipes(recipes);
            }
        });
    }

    // Function to add a new recipe
    function addRecipe(title, ingredients, steps, rating, difficulty, recipesArray) {
        const newRecipe = {
            id: recipesArray.length + 1, // Generate unique ID for the recipe
            title,
            ingredients,
            steps,
            rating,
            difficulty
        };
        console.log(recipesArray);
        // Append the new recipe to the existing recipes array
        recipesArray.push(newRecipe);

        saveRecipes();

        // Redirect to the index page
        window.location.href = 'index.html';
    }

    // Event listener for adding a new recipe
    const addRecipeForm = document.getElementById('add-recipe-form');
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            // Get form values
            const title = document.getElementById('title').value;
            const ingredients = document.getElementById('ingredients').value;
            const steps = document.getElementById('steps').value;
            const rating = document.getElementById('rating').value;
            const difficulty = document.getElementById('difficulty').value;
            // Add the new recipe
            loadRecipes();
            addRecipe(title, ingredients, steps, rating, difficulty, recipes);
            // Reset form fields
            this.reset();
        });
    }

    // Function to remove a recipe
    function removeRecipe(recipeId) {
        if (confirm('Are you sure you want to remove this recipe?')) {
            recipes = recipes.filter(recipe => recipe.id !== recipeId);
            saveRecipes();
            if (isIndexPage) displayRecipes();
        }
    }

    if (isIndexPage) {
        // Attach event listener to the recipe container to handle button clicks using event delegation
        const recipeContainer = document.querySelector('.recipe-container');
        if (recipeContainer) {
            recipeContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('view-details-btn')) {
                    const recipeId = parseInt(event.target.dataset.recipeId);
                    viewRecipeDetails(recipeId);
                }
            });
        }
    }

    // Function to view recipe details
    function viewRecipeDetails(recipeId) {
        // Redirect to details.html and pass the recipe ID as a query parameter
        window.location.href = `details.html?id=${recipeId}`;
    }

    // Function to display recipe details on details.html
    function displayRecipeDetails() {
        // Get the recipe ID from the query parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('id'));

        // Find the recipe with the corresponding ID
        const recipe = recipes.find(recipe => recipe.id === recipeId);

        // Display recipe details on the page
        const detailsContainer = document.querySelector('.details-container');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>Star Rating: <span class="star-rating"> ${'<i class="fa-solid fa-star"></i>'.repeat(recipe.rating)}</span> (${recipe.rating})</p>
                <p>Difficulty: ${difficultyLevels[recipe.difficulty-1]} (${recipe.difficulty})</p>
                <h3>Ingredients:</h3>
                <p>${recipe.ingredients}</p>
                <h3>Steps:</h3>
                <p>${recipe.steps}</p>
                <div class="button-container">
                    <a href="index.html"><button>Return Home</button></a>
                    <button id="edit-recipe-btn">Edit Recipe</button>
                    <button class="remove-recipe-btn" data-recipe-id="${recipe.id}">Remove Recipe</button>
                </div>
            `;
        
            // Event listener for the remove recipe button
            const removeRecipeBtn = detailsContainer.querySelector('.remove-recipe-btn');
            if (removeRecipeBtn) {
                removeRecipeBtn.addEventListener('click', function() {
                    const recipeId = parseInt(this.dataset.recipeId);
                    // Ask for confirmation before removing the recipe
                    const confirmed = confirm('Are you sure you want to remove this recipe?');
                    if (confirmed) {
                        removeRecipe(recipeId);
                        // After removing the recipe, redirect to the index page
                        window.location.href = 'index.html';
                    }
                });
            }

            // Event listener for the edit recipe button
            const editRecipeBtn = detailsContainer.querySelector('#edit-recipe-btn');
            if (editRecipeBtn) {
                editRecipeBtn.addEventListener('click', function() {
                    // Redirect to editRecipe.html with the recipe ID as a query parameter
                    window.location.href = `editRecipe.html?id=${recipeId}`;
                });
            }
        } 
    }

    // Function to display recipe details for editing on editRecipe.html
    function displayEditRecipeDetails() {
        // Get the recipe ID from the query parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('id'));

        // Load recipes from local storage
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

        // Find the index of the recipe with the corresponding ID
        const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);

        // Get the recipe with the corresponding ID
        const recipe = recipes[recipeIndex];

        // Display recipe details on the page for editing
        const editRecipeContainer = document.querySelector('.edit-recipe-container');
        if (editRecipeContainer) {
            if (recipe) {
                editRecipeContainer.innerHTML = `
                    <h2>Edit Recipe</h2>
                    <form id="edit-recipe-form">
                        <div class="form-group">
                            <label for="title">Title:</label>
                            <input type="text" id="title" name="title" value="${recipe.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="ingredients">Ingredients:</label>
                            <textarea id="ingredients" name="ingredients" rows="4" required>${recipe.ingredients}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="steps">Steps:</label>
                            <textarea id="steps" name="steps" rows="6" required>${recipe.steps}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="rating">Rating:</label>
                            <select id="rating" name="rating" required>
                                <option value="1" ${recipe.rating === '1' ? 'selected' : ''}>1 Star</option>
                                <option value="2" ${recipe.rating === '2' ? 'selected' : ''}>2 Stars</option>
                                <option value="3" ${recipe.rating === '3' ? 'selected' : ''}>3 Stars</option>
                                <option value="4" ${recipe.rating === '4' ? 'selected' : ''}>4 Stars</option>
                                <option value="5" ${recipe.rating === '5' ? 'selected' : ''}>5 Stars</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="difficulty">Difficulty:</label>
                            <select id="difficulty" name="difficulty" required>
                                <option value="1" ${recipe.difficulty === '1' ? 'selected' : ''}>Easy</option>
                                <option value="2" ${recipe.difficulty === '2' ? 'selected' : ''}>Moderate</option>
                                <option value="3" ${recipe.difficulty === '3' ? 'selected' : ''}>Intermediate</option>
                                <option value="4" ${recipe.difficulty === '4' ? 'selected' : ''}>Difficult</option>
                                <option value="5" ${recipe.difficulty === '5' ? 'selected' : ''}>Very Difficult</option>
                            </select>
                        </div>
                        <div class="button-container">
                        <button type="submit">Save Changes</button>
                        <button type="button" id="return-details-btn">Cancel</button>
                        </div>
                    </form>
                `;

                // Event listener for the form submission
                const editRecipeForm = document.getElementById('edit-recipe-form');
                editRecipeForm.addEventListener('submit', function(event) {
                    event.preventDefault(); // Prevent form submission

                    // Get form values
                    const title = document.getElementById('title').value;
                    const ingredients = document.getElementById('ingredients').value;
                    const steps = document.getElementById('steps').value;
                    const rating = document.getElementById('rating').value;
                    const difficulty = document.getElementById('difficulty').value;

                    // Update the recipe with new values
                    recipes[recipeIndex] = {
                        ...recipe,
                        title,
                        ingredients,
                        steps,
                        rating,
                        difficulty
                    };

                    // Save recipes to local storage
                    localStorage.setItem('recipes', JSON.stringify(recipes));

                    // Redirect to details.html with the updated recipe ID
                    window.location.href = `details.html?id=${recipeId}`;
                });

                // Event listener for the cancel button
                const returnDetailsBtn = document.getElementById('return-details-btn');
                returnDetailsBtn.addEventListener('click', function() {
                    // Redirect to details.html without making any changes
                    window.location.href = `details.html?id=${recipeId}`;
                });
            } else {
                console.error("Recipe not found.");
            }
        } else {
            console.error("Edit recipe container not found.");
        }
    }


    // Display existing recipes on page load
    if (isIndexPage) {
        loadRecipes();
        displayRecipes(recipes);
    }
    if(isDetailsPage) {
        loadRecipes();
        displayRecipeDetails();
    };
    if(isEditPage){
        displayEditRecipeDetails();
    }
});



