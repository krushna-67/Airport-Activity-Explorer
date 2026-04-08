const API_KEY = "c8333f165b173818fc1a6097d5406f81";
const BASE_URL = "http://api.aviationstack.com/v1/flights";

// Dictionary to convert common airport names into ICAO codes
const airportDictionary = {
    "mumbai": "VABB",
    "delhi": "VIDP",
    "london": "EGLL",
    "new york": "KJFK",
    "dubai": "OMDB",
    "tokyo": "RJTT",
    "paris": "LFPG",
    "sydney": "YSSY",
    "singapore": "WSSS",
    "chicago": "KORD",
    "frankfurt": "EDDF",
    "amsterdam": "EHAM"
};

const funFacts = [
    "Did you know? Hartsfield-Jackson Atlanta International Airport is the busiest airport in the world!",
    "Fun fact: The shortest commercial flight in the world takes only around 90 seconds in Scotland.",
    "Did you know? Airport runways are numbered based on their magnetic compass heading.",
    "Fun Fact: Airplane tires are filled with nitrogen instead of regular air so they don't blow up.",
    "Did you know? The longest commercial flight covers over 9,500 miles and takes nearly 19 hours!"
];


async function getAirportData() {
    const rawInput = document.getElementById("airportInput").value.trim().toLowerCase();

    if (!rawInput) {
        alert("Hey! You need to enter an airport name or code first!");
        return;
    }

    // Lookup the airport name in our dictionary, otherwise assume it's already an ICAO code
    const airportCode = airportDictionary[rawInput] || rawInput.toUpperCase();

    displayRandomFunFact();

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "<p>Loading flight data... this might take a second...</p>";

    // Check if we are running locally (localhost or file path)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    
    // If online, use the secure Vercel proxy. If local, we can use the raw HTTP url!
    const apiUrl = isLocal ? BASE_URL : "/api/flights";
    const url = `${apiUrl}?access_key=${API_KEY}&dep_icao=${airportCode}`;

    try {
        console.log("Fetching data from API...");
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Got the data:", data);
        displayData(data);
    } catch (error) {
        console.error("Oops! Error fetching data:", error);
        outputDiv.innerHTML = "<p>Sorry, there was an error getting the flights. Check console.</p>";
    }
}

function displayData(data) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; 

    if (!data || !data.data || data.data.length === 0) {
        outputDiv.innerHTML = "<p>No flights found for this airport. Are you sure it's correct?</p>";
        return;
    }

    for (let i = 0; i < 10; i++) {
        if (i >= data.data.length) break; 

        const flight = data.data[i];
        
        const div = document.createElement("div");
        div.className = "flight-card"; 

        div.innerHTML = `
            <p>
                <strong>Flight Name:</strong> ${flight.flight?.iata || "Unknown"} <br>
                <strong>From:</strong> ${flight.departure?.airport || "Unknown"} <br>
                <strong>To:</strong> ${flight.arrival?.airport || "Unknown"} <br>
                <strong>Status:</strong> ${flight.flight_status || "Unknown"}
            </p>
        `;

        outputDiv.appendChild(div);
    }
}

function displayRandomFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const factText = funFacts[randomIndex];
    document.getElementById("funFactDisplay").innerText = factText;
}

// Allows the user to quickly search through the loaded flights
function filterFlights() {
    const filterText = document.getElementById("filterInput").value.toLowerCase();
    const flightCards = document.getElementsByClassName("flight-card");

    for (let i = 0; i < flightCards.length; i++) {
        const cardText = flightCards[i].innerText.toLowerCase();
        
        // hide or show based on whether the text matches
        if (cardText.includes(filterText)) {
            flightCards[i].style.display = "";
        } else {
            flightCards[i].style.display = "none";
        }
    }
}
