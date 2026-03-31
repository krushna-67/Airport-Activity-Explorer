const API_KEY = "c8333f165b173818fc1a6097d5406f81"
const BASE_URL = `http://api.aviationstack.com/v1/flights`

async function getAirportData() {
    const airportCode = document.getElementById("airportInput").value;

    if (!airportCode) {
        alert("Please enter an airport code");
        return;
    }

    const url = `${BASE_URL}?access_key=${API_KEY}&dep_icao=${airportCode}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayData(data);
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

function displayData(data) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    if (!data || !data.data || data.data.length === 0) {
        outputDiv.innerHTML = "No data found";
        return;
    }

    data.data.slice(0, 10).forEach(flight => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p>
                Flight: ${flight.flight.iata || "N/A"} <br>
                From: ${flight.departure.airport} <br>
                To: ${flight.arrival.airport} <br>
                Status: ${flight.flight_status}
            </p>
            <hr>
        `;

        outputDiv.appendChild(div);
    });
}
