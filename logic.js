//URL for the geojson - earthquakes in the past month
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//create function to determine marker size based on earthquake mag
function markerSize(mag) {
        return mag * 15000;
}

//function to color the markers based on magnitude
function colorCircle(mag) {
    if (mag < 1) {
        return "MediumOrchid";
    }
    else if (mag >= 1 && mag < 2) {
        return "blue";
    }
    else if (mag >=2 && mag < 3) {
        return "Yellow";
    }
    else if (mag >=3 && mag < 4) {
        return "Aqua";
    }
    else if (mag >=4 && mag <5) {
        return "Red";
    }
    else {
        return "Black";
    }
}

//get data
d3.json(earthquakeURL, function(data) {

    //run through every feature and create popup
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><h4>Magnitude: " + feature.properties.mag + "</h4><hr><p>" +
            new Date(feature.properties.time) + "</p>");
        }

    //create the geoJSON layer from earthquake query
    var earthquakes = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng, {
                stroke: true,
                color: "black",
                weight: 0.5,
                fillOpacity: 0.8,
                fillColor: colorCircle(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            }).addTo(myMap);
        },
        onEachFeature: onEachFeature
    });
    console.log(earthquakes);
});


//function to create base maps
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.streets",
    accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.light",
    accessToken: API_KEY
});

//create basemaps object
var baseMaps = {
    "Streets": streetmap,
    "Grayscale": lightmap,
};

    
//define the map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [lightmap]
});


//place map in the layer control and add to map
L.control.layers(baseMaps).addTo(myMap);

//create legend
var legend = L.control({ position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels = ["<1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var levels = [1, 2, 3, 4, 5, 6];

    div.innerHTML = "<div><strong>Earthquake<br>Magnitude</strong></div>";

    for(var i=0; i <labels.length; i++) {
        div.innerHTML += '<i style="background: ' + colorCircle(levels[i] -1) +'"> &nbsp; </i> &nbsp; &nbsp;' + 
        labels[i] + '<br/>';
        };
    return div;
    };
    legend.addTo(myMap);