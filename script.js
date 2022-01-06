const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');

const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meal');
const single_mealEl = document.getElementById('single-meal');

//search meal fetch from API
const searchMeal = (e) => {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = '';

  const term = search.value;
  if (term.trim()) {
    fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search result for ${term}</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There no result here ! try again</p>`;
          mealsEl.innerHTML = '';
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => ` 
          <div class="meal">
          <img  src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
          <div class="meal-info" data-mealID=${meal.idMeal}>
          <h3>${meal.strMeal}</h3>
          </div>
          </div>
          `
            )
            .join('');
        }
        search.value = '';
      });
  } else {
    alert('Please enter meal or keyword');
  }
};

//Fetch Meal by id
const getMealById = (mealID) => {
  fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
      console.log(meal);
    });
};

//Get random meal
const getRandomMeal = () => {
  //clears heading or meals
  resultHeading.innerHTML = '';
  mealsEl.innerHTML = '';
  fetch(`https://themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
};

//Add meal to DOM
const addMealToDOM = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
  <div class='single-meal'>
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class='single-meal-info'>
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
   <p>${meal.strInstructions}</p>
   <h2>Ingredients</h2>
   <ul>
    ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
   </ul>
  </div>
  </div>
  `;
  console.log(ingredients);
};

//event listener
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID);
  }
});
