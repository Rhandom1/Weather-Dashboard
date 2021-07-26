var searchButton = $('#searchBtn');

// add api?
function getApi(cityValue) {
    var requestKey = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;

    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = $('<h2>').addClass('card-title').text(`${data.name} (${new Date().toLocaleDateString()})`);
            var temp = $('<p>').addClass('card-text').text(`Temp: ${data.main.temp}`);
            var humidity = $('<p>').addClass('card-text').text(`Humidity: ${data.main.humidity}`);
            var wind = $('<p>').addClass('card-text').text(`Wind: ${data.wind.speed}`);
            // var icon = $('<img>').addClass('card-text').attr("src", `${data.weather[0].icon}`);
            $("#current-city").append(cityName, temp, humidity, wind);
            uvIndex(data.coord.lat, data.coord.lon)
            fiveDay(cityValue);
        })
}

function uvIndex(lat,lon) {
    var requestKey = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;

    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            var uv = $('<p>').addClass('card-text uvi').text(`UV Index: ${data.current.uvi}`);
            $("#current-city").append(uv);
        })
}

function fiveDay(cityValue) {
    var requestKey = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=46b821e4cbd17e00a860614cfb6899bc&units=imperial`;

    fetch(requestKey)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            for (let i = 0; i < data.list.length; i++) {
                const element = data.list[i];
                //i= -1 means it is not in the array
                if (element.dt_txt.indexOf('12:00:00') != -1) {
                    console.log(element);
                    var card = $('<div>').addClass('card bg-primary text-white');
                    var cardBody = $('<div>').addClass("card-body");
                    var date = $('<h4>').addClass('card-title').text(new Date(element.dt_txt).toLocaleDateString());
                    var temp = $('<p>').addClass('card-text').text(`temp: ${data.list[i].main.temp}`);
                    var humidity = $('<p>').addClass('card-text').text(`Humidity: ${data.list[i].main.humidity}`);
                    // var icon = $('<img>').addClass('card-image').src("http://openweathermap.org/img/wn/" + ${data.weather[0].icon} + "@2x.png");
                    
                    //create variables for data to call and add to the append line
                    $('#forecast').append(card.append(cardBody.append(date, temp, humidity)));

                };
                
            }
        })
}

$("#searchBtn").click(function(){
    var cityValue = $('#search').val();
    var searchListEl = $('<li>').appendTo(".list").text(cityValue);
    // console.log(cityValue);
    getApi(cityValue);


    localStorage.getItem(cityValue);
    localStorage.setItem(searchListEl, cityValue);
})

// TO DO:
    //Save search results in local Storage
    //City should appear below search box
    //clikcing on city should run a search for that city

//Add icons to forecast
//remove borders