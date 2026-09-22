const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultHeading = document.getElementById('result-heading');
const mealsDiv = document.getElementById('meals');
const singleMealDiv = document.getElementById('single-meal');

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

// ===== 功能1：搜索菜单 =====
function searchMeal(e) {
    e.preventDefault(); 

    const term = searchInput.value.trim(); 

    if (term) {
        resultHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;
        singleMealDiv.innerHTML = ''; 

        fetch(`${API_BASE}/search.php?s=${term}`)
            .then(res => res.json())   
            .then(data => {
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>No results found for "${term}"</h2>`;
                    mealsDiv.innerHTML = '';
                } else {
                    mealsDiv.innerHTML = data.meals.map(meal => `
                        <div class="meal" data-mealid="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info">
                                <h3>${meal.strMeal}</h3>
                                <span class="tag">${meal.strCategory}</span>
                            </div>
                        </div>
                    `).join('');
                }
            })
            .catch(err => {
                resultHeading.innerHTML = '<h2>Something went wrong, try again</h2>';
                console.error(err);
            });
    }
}

// ===== 功能2：点卡片，查看某道菜的详情 =====
function getMealById(mealId) {
    mealsDiv.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`${API_BASE}/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]; 
            addMealToDOM(meal);
        });
}

// ===== 功能3：把详情画到页面上 =====
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`<li>✅ ${ingredient} - ${measure}</li>`);
        } else {
            break; 
        }
    }

    singleMealDiv.innerHTML = `
        <button class="back-btn" id="back-btn">← Back to recipes</button>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h1>${meal.strMeal}</h1>
        <span class="tag">${meal.strCategory}</span>
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul class="ingredients">
            ${ingredients.join('')}
        </ul>
        ${meal.strYoutube
            ? `<a class="video-btn" href="${meal.strYoutube}" target="_blank">▶ Watch Video</a>`
            : ''}
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
        singleMealDiv.innerHTML = ''; 
        searchMeal(new Event('submit')); 
    });
}

// ===== 事件绑定 =====
searchForm.addEventListener('submit', searchMeal);

mealsDiv.addEventListener('click', e => {
    const mealCard = e.target.closest('.meal');
    if (mealCard) {
        getMealById(mealCard.dataset.mealid); 
    }
});