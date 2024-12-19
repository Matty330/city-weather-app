import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById('search-form') as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById('weather-img') as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById('temp') as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById('humidity') as HTMLParagraphElement;

/* API Calls */

// Fetch weather data for a city
const fetchWeather = async (cityName: string) => {
  if (!cityName) {
    alert("City name is required.");
    return;  // Prevent further action if city name is empty
  }

  const response = await fetch('/api/weather/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityName }),
  });

  if (!response.ok) {
    console.error("Failed to fetch weather data", response.status);
    return;
  }

  const weatherData = await response.json();

  // Ensure weather data contains the necessary properties
  if (weatherData.saved && weatherData.forecast) {
    renderCurrentWeather(weatherData.saved);
    renderForecast(weatherData.forecast);
  } else {
    console.error("Weather data is missing necessary properties");
  }
};

// Fetch search history from the backend
const fetchSearchHistory = async () => {
  const history = await fetch('/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history.json();
};

/* Render Functions */

// Render current weather data
const renderCurrentWeather = (currentWeather: any): void => {
  if (!currentWeather) {
    console.error("Current weather data is missing!");
    return;
  }

  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;
  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

// Render 5-day forecast data
const renderForecast = (forecast: any[]): void => {
  if (!forecast || forecast.length === 0) {
    console.error("Forecast data is missing or empty!");
    return;
  }

  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach((day: any) => renderForecastCard(day));
};

// Render individual forecast card
const renderForecastCard = (forecast: any): void => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;
  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

/* Helper Functions */

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

// Create a history button for a city
const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

// Create a delete button for a city in history
const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

// Create a container div for history items
const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

// Build an individual history list item (city + delete button)
const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/* Event Handlers */

// Handle search form submission
const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value.trim()) {
    alert("City cannot be blank! Please enter a city name.");
    return;  // Prevent form submission if input is empty
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

// Handle click on search history
const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

// Handle deleting a city from history
const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/* Initial Render */

// Ensure that the history is rendered when the page loads
window.onload = () => {
  getAndRenderHistory();  // Make sure `getAndRenderHistory` is initialized before use
};

// Fetch and render history when the page loads
const getAndRenderHistory = () => fetchSearchHistory().then(renderSearchHistory);

// Add event listeners for search form and history clicks
searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);
