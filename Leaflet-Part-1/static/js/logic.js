
// variable to hold the url to the json dataset
let url = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");

// Get the data with d3.
d3.json(url).then(function(data) {
    createMap(data.features);
  });

// Function to add a map based on earthquake data input
function createMap(earthquakes) {


// Create a map object.
    let myMap = L.map("map-id", {
        center: [-22.839076, 91.593792],
        zoom: 3
    });
  
    // Add a tile layer.
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Loop through the cities array, and create one marker for each city object.
    for (let i = 0; i < earthquakes.length; i++) {

        let location = [earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]]
  
        // Add circles to the map.
        L.circle(location, {
          fillOpacity: 0.75,
          weight: 2,
          color: "white",
          fillColor: getColor(earthquakes[i].geometry.coordinates[2]),

          // Adjust the radius.
            radius: earthquakes[i].properties.mag * 50000

        // add text to be attached as a popup to each circle
        }).bindPopup(`<h2><strong>Earthquake event</strong></h2><hr>
        <p><strong>Location:</strong> ${earthquakes[i].properties.place}</p>
        <p><strong>Magnitude:</strong>${earthquakes[i].properties.mag} </p>
        <p><strong>Depth:</strong>${earthquakes[i].geometry.coordinates[2]} </p>
        <p><strong>Time of Event:</strong> ${new Date(earthquakes[i].properties.time)}</p>`).addTo(myMap);
    }
                 
                      

        // Adding legend to the map
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
        
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [-10, 10, 30, 50, 70, 90],
                labels = [];
        
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
            return div;
        };
        
        legend.addTo(myMap);

        // function to select the colour of the circle based on the value of the input
        function getColor(d) {
            return d > 90 ? '#006837' :
                   d > 70  ? '#31a354' :
                   d > 50  ? '#78c679' :
                   d > 30  ? '#addd8e' :
                   d > 10  ? '#d9f0a3' :
                   d > -10   ? '#ffffcc':
                   '#FFEDA0';
        };
  };
