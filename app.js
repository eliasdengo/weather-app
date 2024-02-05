const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 30000;  // Use lowercase for port variable

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/image"));

async function getWeatherData(city) {
  const apiKey = "3083f84cc70eece13ad7fa132cab8e13";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;

  try {
    const response = await axios.get(weatherURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);  // Use console.error for errors
    throw error;
  }
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;  // Access city from query string

  try {
    const weatherData = await getWeatherData(city);
    
    const desc=weatherData.weather[0].description;
    const temp=weatherData.main.temp.toFixed(1);
    console.log(desc);
    console.log(temp);
    console.log(city);

    let sentence = desc;

    const weatherKeywords = ["rain", "clouds", "sky"];
    let foundKeyword = "";
    
    for (const keyword of weatherKeywords) {
      const index = sentence.indexOf(keyword);
      if (index !== -1) {
        foundKeyword = keyword;
       console.log(foundKeyword);
        break; // Exit the loop once a keyword is found
      }
    }
    
    // Use a dictionary for cleaner image path mapping
    const weatherImages = {
      rain: "../rain.png",
      clouds: "../cloud.png",
      sky: "../sunny.png",
      default: "../weather.jpg"
    };
    
    const img = weatherImages[foundKeyword] || weatherImages.default;
    console.log(img);
    
    res.render("index", { weatherData, city, img });
  } catch (error) {
    res.status(500).send("Error fetching weather data.");
  }
});

app.listen(port, () => {
  console.log(`Weather app is running on port ${port}`);
});