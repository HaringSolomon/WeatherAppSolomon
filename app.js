document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "IovjvK9VoyFfqLDXiHHxNyiJ7ZJjvJ5H"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;

                    weatherDiv.innerHTML = '';
                    fetchWeatherData(locationKey);
                    fetch5DayForecast(locationKey);
                    fetch12HourForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML += `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML += `<p>Error fetching current weather data.</p>`;
            });
    }

    function fetch5DayForecast(locationKey) {
        const forecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    display5DayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No 5-day forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching 5-day forecast data.</p>`;
            });
    }

    function fetch12HourForecast(locationKey) {
        const forecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    display12HourForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No 12-hour forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12-hour forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching 12-hour forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML += weatherContent;
    }

    function display5DayForecast(forecasts) {
        let forecastHtml = '<h2>5-Day Weather Forecast</h2>';
        forecasts.forEach(forecast => {
            forecastHtml += `
                <div>
                    <p>Date: ${forecast.Date}</p>
                    <p>Temperature Min: ${forecast.Temperature.Minimum.Value}°C</p>
                    <p>Temperature Max: ${forecast.Temperature.Maximum.Value}°C</p>
                    <p>Day: ${forecast.Day.IconPhrase}</p>
                    <p>Night: ${forecast.Night.IconPhrase}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastHtml;
    }

    function display12HourForecast(data) {
        let forecastHtml = '<h2>12-Hour Weather Forecast</h2>';
        data.forEach(forecast => {
            forecastHtml += `
                <div>
                    <p>Date/Time: ${forecast.DateTime}</p>
                    <p>Temperature: ${forecast.Temperature.Value} ${forecast.Temperature.Unit}</p>
                    <p>Weather: ${forecast.IconPhrase}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastHtml;
    }
});
