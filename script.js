const apiKey = "5565ed5da3441dd72edd49b5aa70cae3";
const searchBtn = document.getElementById("searchBtn");

const toggleBtnSearch = document.createElement("button"); // Toggle button create
const toggleBtnLive = document.createElement("button"); // Toggle button create

toggleBtnSearch.textContent = "Switch to °F";
toggleBtnSearch.style.marginTop = "10px";

toggleBtnLive.textContent = "Switch to °F";
toggleBtnLive.style.marginTop = "10px";

document.querySelector(".searchWeather").appendChild(toggleBtnSearch);
document.querySelector(".liveWeather").appendChild(toggleBtnLive);

let isCelsius = true;

searchBtn.addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a valid city name.");
    }
});

async function getWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(currentWeatherUrl);
        const forecastResponse = await axios.get(forecastUrl);

        updateCurrentWeather(response.data);
        updateForecastUI(forecastResponse.data.list);
    } catch (error) {
        alert("City not found. Please try again.");
    }
}

function updateForecastUI(data) {
    const forecastList = document.getElementById("upcomingList");
    // const forecastList = document.getElementById("forecastList");
    forecastList.innerHTML = "";

    // ✅ Object to Store Only One Entry Per Day
    const dailyData = {};

    // ✅ Loop to Filter Only One Entry Per Day
    data.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract Date (YYYY-MM-DD)

        if (!dailyData[date]) {
            dailyData[date] = entry; // Store First Entry of Each Day
        }
    });

    Object.values(dailyData)
        .slice(0, 5)
        .forEach((day) => {
            const item = document.createElement("p"); // Use <p> instead of <li> to remove bullet points
            item.textContent = `${day.dt_txt.split(" ")[0]} - ${day.main.temp}°C`;
            forecastList.appendChild(item);
        });
}



function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            try {
                const response = await axios.get(locationWeatherUrl);
                updateLocationWeather(response.data);
            } catch (error) {
                alert("Could not fetch location weather.");
            }
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}





function toggleTemperatureLive(tempCelsius) {
    if (isCelsius) {
        let tempFahrenheit = (tempCelsius * 9) / 5 + 32;
        document.getElementById("liveTemperature").textContent = `${tempFahrenheit.toFixed(2)}°F`;
        toggleBtnLive.textContent = "Switch to °C";
    } else {
        document.getElementById("liveTemperature").textContent = `${tempCelsius}°C`;
        toggleBtnLive.textContent = "Switch to °F";
    }
    isCelsius = !isCelsius;
}


function updateLocationWeather(data) {
    document.getElementById("liveCityName").textContent = data.name;
    document.getElementById("liveTemperature").textContent = `${data.main.temp}°C`;
    document.getElementById("liveHumidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("liveCondition").textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById("liveWeatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    toggleBtnLive.onclick = function () {
        toggleTemperatureLive(data.main.temp);
    };
}







function updateCurrentWeather(data) {
    document.getElementById("searchCityName").textContent = data.name;
    document.getElementById("searchTemperature").textContent = `${data.main.temp}°C`;
    document.getElementById("searchHumidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("searchCondition").textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById("searchWeatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    toggleBtnSearch.onclick = function () {
        toggleTemperatureSearch(data.main.temp);
    };
}

function toggleTemperatureSearch(tempCelsius) {
    if (isCelsius) {
        let tempFahrenheit = (tempCelsius * 9) / 5 + 32;
        document.getElementById("searchTemperature").textContent = `${tempFahrenheit.toFixed(2)}°F`;
        toggleBtnSearch.textContent = "Switch to °C";
    } else {
        document.getElementById("searchTemperature").textContent = `${tempCelsius}°C`;
        toggleBtnSearch.textContent = "Switch to °F";
    }
    isCelsius = !isCelsius;
}


window.onload = getLocationWeather;
