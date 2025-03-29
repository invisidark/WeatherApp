const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {

    res.sendFile(__dirname + "/index.html");

});


app.post("/", function(req, res) {

const query = req.body.cityName;
const apiKey = process.env.WEATHER_API_KEY;
const unit = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

https.get(url, function (response){
    console.log(response.statusCode);

    response.on("data", function(data) {
        const weatherData = JSON.parse(data);
    
        if (weatherData.cod === "404") {
            return res.status(404).render("error", { message: "City not found. Please try another search." });
        }
    
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL =  "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    
        res.render("weather", {
            city: query,
            temp: temp,
            description: weatherDescription,
            imageURL: imageURL
        });
    
        console.log(weatherData);
        console.log(temp);
        console.log(weatherDescription);        
    });
    
});

// Error view
app.get("/error", (req, res) => {
    res.render("error", { message: "Something went wrong." });
  });
  


});



app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});