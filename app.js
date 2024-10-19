document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchTermInput = document.getElementById("searchTerm");
    const errorDiv = document.getElementById("error");
    const result = document.querySelector(".result");
    const temp = document.querySelector(".temp");
    const loc = document.querySelector(".loc");
    const desc = document.querySelector(".description");
    const loading = document.querySelector(".loading");
    const gifContainer = document.getElementById("gifContainer");
  
    const weatherAPIKey = 'FMTY8UJ875ETJ8EECXCE95G4L';
    const giphyAPIKey = 'iKwRFmVYxZJUbPgK6QxvQUHD7HufgO7m'; 
  
    // Fetch weather data from Visual Crossing API
    async function weatherAPI(location) {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${weatherAPIKey}`;
      try {
        const response = await fetch(url, { mode: "cors" });
        const data = await response.json();
  
        const tempF = data.currentConditions.temp;
        const tempC = Math.round(((tempF - 32) * 5) / 9);
        const description = data.currentConditions.conditions;
        const completeAddress = data.resolvedAddress;
  
        return { completeAddress, description, tempF, tempC };
      } catch (error) {
        throw new Error("Location not found.");
      }
    }
  
    // Fetch GIFs from Giphy API based on weather description
    async function fetchWeatherGif(query) {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIKey}&q=${query}&limit=1`;
      const response = await fetch(url);
      const { data } = await response.json();
  
      if (data.length > 0) {
        return data[0].images.fixed_height.url;
      } else {
        return ""; // No GIF found
      }
    }
  
    // Change background color based on weather description
    function changeBackground(description) {
      if (description.includes("Sunny")) {
        document.body.style.backgroundColor = "#FFD700"; // Gold
      } else if (description.includes("Cloud")) {
        document.body.style.backgroundColor = "#C0C0C0"; // Silver
      } else if (description.includes("Rain")) {
        document.body.style.backgroundColor = "#87CEFA"; // Light Sky Blue
      } else if (description.includes("Snow")) {
        document.body.style.backgroundColor = "#FFFFFF"; // White
      } else {
        document.body.style.backgroundColor = "#ADD8E6"; // Light Blue
      }
    }
  
    // Main search button click handler
    searchButton.addEventListener("click", async () => {
      const searchValue = searchTermInput.value.trim();
      if (searchValue.length < 3) {
        errorDiv.textContent = "Please enter at least 3 characters.";
        return;
      }
  
      // Clear previous results and show loading spinner
      errorDiv.textContent = "";
      result.classList.add("hidden");
      gifContainer.innerHTML = "";
      loading.classList.remove("hidden");
  
      try {
        const { completeAddress, description, tempF, tempC } = await weatherAPI(searchValue);
  
        // Fetch GIF based on weather description
        const gifUrl = await fetchWeatherGif(description);
        if (gifUrl) {
          const gifImg = document.createElement("img");
          gifImg.src = gifUrl;
          gifContainer.appendChild(gifImg);
        }
  
        // Update the DOM with weather data
        temp.textContent = `${tempF}°F | ${tempC}°C`;
        loc.textContent = completeAddress;
        desc.textContent = description;
  
        // Change background color based on weather
        changeBackground(description);
  
        // Show the result and hide the loading spinner
        result.classList.remove("hidden");
      } catch (error) {
        errorDiv.textContent = error.message;
      } finally {
        loading.classList.add("hidden"); // Hide loading spinner
      }
    });
  });
  