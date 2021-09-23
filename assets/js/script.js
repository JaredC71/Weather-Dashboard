const searchBarVal = document.getElementById('city-input'); //search bar
const searchBtn = document.getElementById('searchBtn'); //submit button
const searchHistoryEl = document.getElementById('search-historyEl');//housing element for search history blocks
const cityNameJumbotron = document.getElementById('city-data-jumbotron');//where city name will go in the jumbotron
const tempJumbotron = document.getElementById('temp-data-jumbotron');//where the temperature will go in the jumbotron
const windJumbotron = document.getElementById('wind-data-jumbotron');//where the wind will go in the jumbotron
const humidityJumbotron = document.getElementById('humidity-data-jumbotron');//where the humidity will go in the jumbotron
const UV_Index_Jumbotron = document.getElementById('UV-index-data-jumbotron');//where the UV index will go in the jumbotron
const fiveDay_ForcastEl = document.getElementById('five-day-housing');//housing element for the five cards displaying the next five days of weather will go
let search_History = [];//will house our city names after being submited
//this function will run on load in order to render our search history after refresh

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
   }
   
function startUp() {
    let search_History_Storage = JSON.parse(localStorage.getItem('search-history'));
    if (search_History_Storage !== null) {
        search_History = search_History_Storage;
    }
    renderStorage();
    
}
//when clicked, we will fetch our urls and extract the necessary data.
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
    let cityName = searchBarVal.value;//city name equals whatever the user submits into the search bar
    let APIKey = '&APPID=1f5285776176cb63d4dd947ae4b66e26';
    let requestURL = baseUrl + cityName + APIKey;
    fetch(requestURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let JumboDateMonth = new Date().getMonth();
        let JumboDateDay = new Date().getDate();
        let JumboDateYear = new Date().getFullYear();
        let JumboDate = `${JumboDateMonth}/${JumboDateDay}/${JumboDateYear}`;
        cityNameJumbotron.textContent = data.name + " "+ JumboDate;
        search_History.push(data.name);//add the city into our search history array
        storeData();//store the city
        renderStorage();//render the stored city onto the page
        let secondUrlBase = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
        let latValue = data.coord.lat;
        let lonPlaceholder = '&lon=';
        let units = '&units=imperial';
        let lonValue = data.coord.lon;
        let dateValue = '&dt=1623726270';
        let APIKeyPlaceholder = '&appid=';
        let apiValue = '1f5285776176cb63d4dd947ae4b66e26';
        let secondURL = secondUrlBase + latValue + lonPlaceholder + lonValue + units + dateValue + APIKeyPlaceholder + apiValue;
        fetch(secondURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let uvIndexBackground = document.createElement('span');
            if(data.current.uvi >= .5) {
                uvIndexBackground.classList.add('uv-red');
            } else {
                uvIndexBackground.id = 'uv-green';
            }
            let JumboIcon = document.createElement('img');
            JumboIcon.className = 'weather-icon';
            JumboIcon.id = 'icon-Jumbo';
            JumboIcon.src = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
            cityNameJumbotron.appendChild(JumboIcon);
            uvIndexBackground.textContent = data.current.uvi;
            console.log(data.current.uvi);
            tempJumbotron.textContent = 'Temp: ' + data.current.temp + '°F';
            windJumbotron.textContent = "Wind: " + data.current.wind_speed + ' MPH';
            humidityJumbotron.textContent = "Humidity: " + data.current.humidity + ' %';
            UV_Index_Jumbotron.textContent = 'UV Index: ';
            UV_Index_Jumbotron.appendChild(uvIndexBackground);
        })
        let thirdUrlBase = 'https://api.openweathermap.org/data/2.5/forecast?q=';
        let thirdUrl = thirdUrlBase + data.name + units + APIKeyPlaceholder + apiValue;
        fetch(thirdUrl)
        .then((resonse) => {
            return resonse.json();
        })
        .then((data) => {
            generateCards(data);
            console.log(data);
        })
        
    })
    searchBarVal.value = '';
})
function storeData() {
    localStorage.setItem('search-history', JSON.stringify(search_History));
}
function renderStorage() {
    searchHistoryEl.innerHTML = '';
    for (let i = 0; i < search_History.length; i++) {
        let newItem = document.createElement('li');
        newItem.className = 'search-history-item';
        newItem.textContent = search_History[i];
        searchHistoryEl.appendChild(newItem);
        newItem.addEventListener('click', () => {
            let baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
            let cityName = newItem.textContent;
            let APIKey = '&APPID=1f5285776176cb63d4dd947ae4b66e26';
            // let requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1f5285776176cb63d4dd947ae4b66e26';
            let requestURL = baseUrl + cityName + APIKey;
            fetch(requestURL)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let JumboDateMonth = new Date().getMonth();
                let JumboDateDay = new Date().getDate();
                let JumboDateYear = new Date().getFullYear();
                let JumboDate = `${JumboDateMonth}/${JumboDateDay}/${JumboDateYear}`;
                cityNameJumbotron.textContent = data.name + " "+ JumboDate;
                let secondUrlBase = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
                let latValue = data.coord.lat;
                let lonPlaceholder = '&lon=';
                let units = '&units=imperial';
                let lonValue = data.coord.lon;
                let dateValue = '&dt=1623726270';
                let APIKeyPlaceholder = '&appid=';
                let apiValue = '1f5285776176cb63d4dd947ae4b66e26';
                let secondURL = secondUrlBase + latValue + lonPlaceholder + lonValue + units + dateValue + APIKeyPlaceholder + apiValue;
                fetch(secondURL)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    let JumboIcon = document.createElement('img');
                    JumboIcon.className = 'weather-icon';
                    JumboIcon.id = 'icon-Jumbo';
                    JumboIcon.src = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
                    cityNameJumbotron.appendChild(JumboIcon);
                    tempJumbotron.textContent = 'Temp: ' + data.current.temp + '°F';
                    windJumbotron.textContent = "Wind: " + data.current.wind_speed + ' MPH';
                    humidityJumbotron.textContent = "Humidity: " + data.current.humidity + ' %';
                    let uvIndexBackground = document.createElement('span');
                    if(data.current.uvi >= .5) {
                        uvIndexBackground.classList.add('uv-red');
                    } else {
                        uvIndexBackground.id = 'uv-green';
                        
                    }
                    uvIndexBackground.textContent = data.current.uvi;
                    UV_Index_Jumbotron.textContent = 'UV Index: ';
                    UV_Index_Jumbotron.appendChild(uvIndexBackground);
                })
                let thirdUrlBase = 'https://api.openweathermap.org/data/2.5/forecast?q=';
                let thirdUrl = thirdUrlBase + data.name + units + APIKeyPlaceholder + apiValue;
                fetch(thirdUrl)
                .then((resonse) => {
                    return resonse.json();
                })
                .then((data) => {
                    generateCards(data);
                    console.log(data);
                })
                
            })
            searchBarVal.value = '';
        })
    }
    
}

function generateCards(dataSet) {
    fiveDay_ForcastEl.innerHTML = '';
    let dayOneEl = document.createElement('div');
    let dayOneDate = document.createElement('p');
    let dayOneIcon = document.createElement('img');
    dayOneIcon.className = 'weather-icon';
    dayOneIcon.src = "http://openweathermap.org/img/w/" + dataSet.list[0].weather[0].icon + ".png";
    let dayOneTemp = document.createElement('p');
    let dayOneWind = document.createElement('p');
    let dayOneHumidity = document.createElement('p');
    dayOneEl.className = 'card';
    dayOneDate.textContent = dataSet.list[0].dt_txt;
    dayOneTemp.textContent = "Temp: " + dataSet.list[0].main.temp + '°F';
    dayOneWind.textContent = "Wind: " + dataSet.list[0].wind.speed + " MPH";
    dayOneHumidity.textContent = "Humidity: " + dataSet.list[0].main.humidity + ' %';
    dayOneEl.appendChild(dayOneDate);
    dayOneEl.appendChild(dayOneIcon);
    dayOneEl.appendChild(dayOneTemp);
    dayOneEl.appendChild(dayOneWind);
    dayOneEl.appendChild(dayOneHumidity);
    fiveDay_ForcastEl.appendChild(dayOneEl);
    //day 2
    let dayTwoEl = document.createElement('div');
    let dayTwoDate = document.createElement('p');
    let dayTwoIcon = document.createElement('img');
    dayTwoIcon.className = 'weather-icon';
    dayTwoIcon.src = "http://openweathermap.org/img/w/" + dataSet.list[8].weather[0].icon + ".png";
    let dayTwoTemp = document.createElement('p');
    let dayTwoWind = document.createElement('p');
    let dayTwoHumidity = document.createElement('p');
    dayTwoEl.className = 'card';
    dayTwoDate.textContent = dataSet.list[8].dt_txt;
    dayTwoTemp.textContent = "Temp: " + dataSet.list[8].main.temp + "°F";
    dayTwoWind.textContent = "Wind: " + dataSet.list[8].wind.speed + ' MPH';
    dayTwoHumidity.textContent = "Humidity: " + dataSet.list[8].main.humidity + ' %';
    dayTwoEl.appendChild(dayTwoDate);
    dayTwoEl.appendChild(dayTwoIcon);
    dayTwoEl.appendChild(dayTwoTemp);
    dayTwoEl.appendChild(dayTwoWind);
    dayTwoEl.appendChild(dayTwoHumidity);
    fiveDay_ForcastEl.appendChild(dayTwoEl);
    //day 3
    let dayThreeEl = document.createElement('div');
    let dayThreeDate = document.createElement('p');
    let dayThreeIcon = document.createElement('img');
    dayThreeIcon.className = 'weather-icon';
    dayThreeIcon.src = "http://openweathermap.org/img/w/" + dataSet.list[16].weather[0].icon + ".png";
    let dayThreeTemp = document.createElement('p');
    let dayThreeWind = document.createElement('p');
    let dayThreeHumidity = document.createElement('p');
    dayThreeEl.className = 'card';
    dayThreeDate.textContent = dataSet.list[16].dt_txt;
    dayThreeTemp.textContent = "Temp: " + dataSet.list[16].main.temp + '°F';
    dayThreeWind.textContent = "Wind :" + dataSet.list[16].wind.speed + " MPH";
    dayThreeHumidity.textContent = "Humidity: " + dataSet.list[16].main.humidity + ' %';
    dayThreeEl.appendChild(dayThreeDate);
    dayThreeEl.appendChild(dayThreeIcon);
    dayThreeEl.appendChild(dayThreeTemp);
    dayThreeEl.appendChild(dayThreeWind);
    dayThreeEl.appendChild(dayThreeHumidity);
    fiveDay_ForcastEl.appendChild(dayThreeEl);
    //day 4
    let dayFourEl = document.createElement('div');
    let dayFourDate = document.createElement('p');
    let dayFourIcon = document.createElement('img');
    dayFourIcon.className = 'weather-icon';
    dayFourIcon.src = "http://openweathermap.org/img/w/" + dataSet.list[24].weather[0].icon + ".png";
    let dayFourTemp = document.createElement('p');
    let dayFourWind = document.createElement('p');
    let dayFourHumidity = document.createElement('p');
    dayFourEl.className = 'card';
    dayFourDate.textContent = dataSet.list[24].dt_txt;
    console.log(dataSet.list[24].dt_txt)
    dayFourTemp.textContent = "Temp: " + dataSet.list[24].main.temp + "°F";
    dayFourWind.textContent = "Wind: " + dataSet.list[24].wind.speed + " MPH";
    dayFourHumidity.textContent = "Humidity: " + dataSet.list[24].main.humidity + " %";
    dayFourEl.appendChild(dayFourDate);
    dayFourEl.appendChild(dayFourIcon);
    dayFourEl.appendChild(dayFourTemp);
    dayFourEl.appendChild(dayFourWind);
    dayFourEl.appendChild(dayFourHumidity);
    fiveDay_ForcastEl.appendChild(dayFourEl);
    //day 5
    let dayFiveEl = document.createElement('div');
    let dayFiveDate = document.createElement('p');
    let dayFiveIcon = document.createElement('img');
    dayFiveIcon.className = 'weather-icon';
    dayFiveIcon.src = "http://openweathermap.org/img/w/" + dataSet.list[32].weather[0].icon + ".png";
    let dayFiveTemp = document.createElement('p');
    let dayFiveWind = document.createElement('p');
    let dayFiveHumidity = document.createElement('p');
    dayFiveEl.className = 'card';
    dayFiveDate.textContent = dataSet.list[32].dt_txt;
    dayFiveTemp.textContent = "Temp: " + dataSet.list[32].main.temp + "°F";
    dayFiveWind.textContent = "Wind: " + dataSet.list[32].wind.speed + ' MPH';
    dayFiveHumidity.textContent = "Humidity: " + dataSet.list[32].main.humidity + " %";
    dayFiveEl.appendChild(dayFiveDate);
    dayFiveEl.appendChild(dayFiveIcon);
    dayFiveEl.appendChild(dayFiveTemp);
    dayFiveEl.appendChild(dayFiveWind);
    dayFiveEl.appendChild(dayFiveHumidity);
    fiveDay_ForcastEl.appendChild(dayFiveEl);
    
}
startUp();
