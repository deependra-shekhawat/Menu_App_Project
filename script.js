// Check if the "favouritesList" array exists in local storage, if not, create it
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Async function to fetch meals from the API based on a given URL and value
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}



// Function to display a list of meals based on the search input value
function showListOfMeals(){
    let inputValue = document.getElementById("my-search").value;
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    // Fetch meals from the API
    let meals=fetchMealsFromApi(url,inputValue);
    meals.then(data=>{
        // Check if meals are found in the API response
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav=false;
                // Check if the meal is in the favorite list
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }

                // Generate HTML for the meal card based on whether it's a favorite or not
                if (isFav) {
                    html += `
                <div id="card" class="card card-1 mb-3 " style="width: 20rem; background: linear-gradient(135deg, red, rgba(255, 255, 255, 0));">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                        <button id="main${element.idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${element.idMeal})" >Remove from Favorite</button>
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Details</button>
                            
                        </div>
                    </div>
                </div>
                `;
                    // HTML for the card when it's not in the favorites list
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem; ">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                        <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" >Add To Favorite</button>
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">Details</button>
                            
                        </div>
                    </div>
                </div>
                `;
                }
               
                
            });

        // HTML for the case when no meals are found
        } else {
            //This will be code if the searched input is not found in mealDB Api
            //and below image will be displayed
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                        <img src="https://www.artzstudio.com/content/images/wordpress/2020/05/404-error-not-found-page-lost.png" width="50%">  
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}



// Function to display full details of a meal after clicking the "Details" button
async function showMealDetails(id) {
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    // Fetch details of a meal from the API
    await fetchMealsFromApi(url,id).then(data=>{
        // Generate HTML for displaying meal details
        html += `
          <div id="meal-details" class="mb-5">
          <a class="bg-danger btn float-right" href="./index.html" style="font-weight:bolder">X</a>
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
    });
    // Set the generated HTML to the "main" element
    document.getElementById("main").innerHTML=html;
}




// Function to display all favorite meals in the favorites body
async function showFavMealList() {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    // Check if the favorite list is empty
    if (arr.length==0) {
        // HTML for the case when the favorite list is empty
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                <img src="https://d2hotjypbffaov.cloudfront.net/20180405114231/404_Error_sm.jpg" alt="404 error png image" width="100%"> 
                </div>
            </div>
            `;
    } else {
        // HTML for displaying favorite meals
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                // Generate HTML for each favorite meal
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;background: linear-gradient(135deg, red, rgba(255, 255, 255, 0));">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light " onclick="addRemoveToFavList(${data.meals[0].idMeal})" >Remove Favorite</button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites-body").innerHTML=html;
}






// Function to add or remove meals from the favorites list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    // Check if the meal is already in the favorites list
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    // Add or remove the meal based on its presence in the favorites list
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);

    } else {
        arr.push(id);
    
    }
    // Update the favorites list in local storage
    localStorage.setItem("favouritesList",JSON.stringify(arr));

    // Update the displayed list of meals and favorites
    showListOfMeals();
    showFavMealList();
}

// Event listener to toggle the 'search-active' class based on search input
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('my-search');
    var fullBody = document.getElementById('full-body');
  
    searchInput.addEventListener('input', function () {
      var inputValue = searchInput.value.trim();
  
        // Toggle the 'search-active' class based on the presence of text in the search input
        if (inputValue !== '') {
        fullBody.classList.add('search-active');
      } else {
        fullBody.classList.remove('search-active');
      }
    });
  });
  
