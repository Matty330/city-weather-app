Weather Dashboard
Description
The Weather Dashboard is a web application that allows users to search for weather information for multiple cities. The app displays current weather conditions, a 5-day weather forecast, and stores previously searched cities in a history list. Users can easily search for any city, view its weather details, and quickly access any previously searched city.

Features
Search for a city: Enter a city name to get current and 5-day weather data.
View current weather: See the temperature, humidity, wind speed, and a weather description for the selected city.
View future weather forecast: Get a 5-day forecast including temperature, wind speed, and humidity.
Search history: View and click on previously searched cities to quickly see their weather information again.
Installation
Prerequisites
You will need to have the following installed on your machine:

Node.js: Download Node.js
npm (Node Package Manager): npm comes with Node.js, so if you have Node.js installed, npm is automatically set up.
Steps to Install
Clone the repository using the command: git clone https://github.com/your-username/weather-dashboard.git

Navigate to the project folder by using: cd weather-dashboard

Install backend dependencies by navigating to the server folder and running: cd server and npm install

Create the .env file in the server folder with the following contents: API_KEY=your_openweather_api_key API_BASE_URL=https://api.openweathermap.org PORT=3001

Replace your_openweather_api_key with your actual API key from OpenWeatherMap.

Start the backend server by running: npm run dev

Navigate to the frontend folder by using: cd ../client

Install frontend dependencies by running: npm install

Start the frontend server by running: npm run dev

Open the app in your browser at http://localhost:3000.

Usage
Once the app is running, enter a city name in the search bar to view its current weather and 5-day forecast. You can view previously searched cities in the search history section. Click on any city from the history to reload its weather data.

Technologies Used
Frontend: HTML, CSS, JavaScript (React, Vue, or vanilla JS)
Backend: Node.js, Express.js
API: OpenWeatherMap API
Environment Variables: dotenv
Version Control: Git, GitHub
Contributing
We welcome contributions! Here's how to get involved:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -am 'Add new feature').
Push your changes to the branch (git push origin feature-branch).
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.