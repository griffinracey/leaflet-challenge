// Create a Leaflet map centered at a specific location
var map = L.map('map').setView([0, 0], 2);

// Add the base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through each earthquake feature
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];
            var popupContent = `
                <b>Location:</b> ${feature.properties.place}<br/>
                <b>Magnitude:</b> ${magnitude}<br/>
                <b>Depth:</b> ${depth} km
            `;

            // Define marker size based on earthquake magnitude
            var markerSize = magnitude * 5;

            // Define marker color based on earthquake depth
            var markerColor = getMarkerColorByDepth(depth);

            // Create the marker and bind popup
            L.circleMarker([coords[1], coords[0]], {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(popupContent).addTo(map);
        });
    });

// Add a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [10, 30, 50, 70, 100]; // Depth intervals

    // Depth legend
    div.innerHTML += '<h4>Depth (km)</h4>';
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<span style="background:' + getMarkerColorByDepth(depths[i]) + '"></span> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(map);

// Function to get marker size based on magnitude
function getMarkerSizeByMagnitude(magnitude) {
    return magnitude * 5;
}

// Function to get marker color based on depth
function getMarkerColorByDepth(depth) {
    // Interpolate color from green to red based on depth
    var normalizedDepth = depth / 100; // Assuming maximum depth of 100 km
    var r = Math.round(255 * normalizedDepth);
    var g = Math.round(255 * (1 - normalizedDepth));
    return 'rgb(' + r + ',' + g + ',0)';
}

