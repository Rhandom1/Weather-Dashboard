var searchButton = $('#searchBtn');

// add api
function getApi(cityValue) {
    var requestKey = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;
    //use fetch to collect information
    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            $("#current-city").empty();
            //local scope variables for all required values
            //dynamically adds an h2 with bootstrap class
                                                                                //JQ method to add the current date
            var cityName = $('<h2>').addClass('card-title').text(`${data.name} (${new Date().toLocaleDateString()})`);
            var temp = $('<p>').addClass('card-text').text(`Temp: ${data.main.temp}`);
            var humidity = $('<p>').addClass('card-text').text(`Humidity: ${data.main.humidity}`);
            var wind = $('<p>').addClass('card-text').text(`Wind: ${data.wind.speed}`);
            var icon = $('<img>').addClass('card-text').attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
            cityName.append(icon);
            $("#current-city").append(cityName, temp, humidity, wind);
            uvIndex(data.coord.lat, data.coord.lon)
            fiveDay(cityValue);
        })
}
//get the uvi from lat/lng
function uvIndex(lat,lon) {
    var requestKey = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;

    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            var uv = $('<p>').addClass('card-text uvi').text(`UV Index: `);
            var spanEl = $('<span>').text(data.current.uvi);
            //create background colors for Severe, Moderate, and Favorable UV conditions
            if (data.current.uvi > 6) {
                spanEl.addClass("severe");
            }
            else if (data.current.uvi > 3 && data.current.uvi < 6) {
                spanEl.addClass("moderate");
            }
            else {
                spanEl.addClass("favorable");
            }
            //append the span tag to the uv value
            uv.append(spanEl);
            //append the uv value to the display area
            $("#current-city").append(uv);
        })
}
//call the forecast data from the API
function fiveDay(cityValue) {
    var requestKey = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;

    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            $("#forecast").empty();
            for (let i = 0; i < data.list.length; i++) {
                const element = data.list[i];
                //i= -1 means it is not in the array
                if (element.dt_txt.indexOf('12:00:00') != -1) {
                    var card = $('<div>').addClass('card bg-primary text-white');
                    var cardBody = $('<div>').addClass("card-body");
                    var date = $('<h4>').addClass('card-title').text(new Date(element.dt_txt).toLocaleDateString());
                    var temp = $('<p>').addClass('card-text').text(`temp: ${data.list[i].main.temp}`);
                    var humidity = $('<p>').addClass('card-text').text(`Humidity: ${data.list[i].main.humidity}`);
                    var icon = $('<img>').addClass('card-text').attr("src", `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
                    
                    //create variables for data to call and add to the append line
                    $('#forecast').append(card.append(cardBody.append(date, temp, humidity, icon)));
                    
                };
                
            }
        })
}
//build out search function
$("#searchBtn").on('click', function() {
    var cityValue = $('#search').val();
    var searchListEl = $('<li>').text(cityValue);

    searchListEl.appendTo('.list');
    getApi(cityValue);

    console.log(cityValue);
    
    $('#forecast-5-day').removeClass("hidden");

    localStorage.getItem(cityValue);
    localStorage.setItem(searchListEl, cityValue);

    document.getElementById('search').value = "";
    
})
//genreate the getAPI function when the city saved in the search list is clicked
$(document).on('click', '.list', function(event) {
    var citySearch = $(event.target).text().trim();
    getApi(citySearch);

    
})