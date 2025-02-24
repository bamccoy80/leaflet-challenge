// create the tile layer for the background of the map
var defaultMap =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//grayscale layer
var grayScale = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

// water color layer
var waterColor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 1,
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

var topoMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

// make a baseMap object
let basemaps = {
    GrayScale: grayScale,
    "water color": waterColor,
    "Topography": topoMap,
    Default: defaultMap
};

// make map object
var myMap = L.map("map", {
    center: [36.778259, -119.417931],
    zoom: 5,
    layers: [defaultMap, grayScale,waterColor, topoMap]
});

// add default map to the map 
grayScale.addTo(myMap);

// get the data from the tectonic plates and drq on the map 
//variabe to hold the tactonic plate layer 
let tectonicplates = new L.layerGroup();

// call the api to get the info for the tectonic plates 
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/refs/heads/master/GeoJSON/PB2002_boundaries.json")
.then(function(plateData){
    //console log
    //console.log(plateData)

    // load data using geoJson and add to the tectonic plates 
    L.geoJson(plateData,{
        // add styling to make the lines variable
        color: "yellow", 
        weight: 1
    }).addTo(tectonicplates);
});

// add the tectonic plates to the map 
tectonicplates.addTo(myMap);

//variable to hold the earthquake data layer
let earthquakes = new L.layerGroup();

//get the data for the earthquakes and populate the layergroup
//make call to USGS GeoJson API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){
        //console log
        console.log(earthquakeData)
        //console log to make sure the data loaded
        //console.log(earthquakeDate);
        //plot circles, where theradious is dependent on the magnitude
        // andthe color is dependent on the depth
        
        // make a function that choose the color of thedata point 
        function dataColor(depth){
            if (depth >90) 
                return "red";
            else if(depth > 70)
                return "#E53B07"
            else if(depth > 50)
                return "#E58107";
            else if (depth > 30)
                return "#EACA2B";
            else if (depth > 10)
                return "#C1EA2B";
            else
                return "green";
        }
        // make a function that determine the size of the radius
        function radiusSize(mag){
            if (mag == 0) 
                return 1; // make sure that a 0 mag earthquake shows up 
            else
                return  mag *5; // makes sure that the circle is pronounced in the map 
        }

        // add on to the systel of each data point
        function dataStyle(feature)
        {
            return {
                opacity: 0.5,
                fillOpacity: 0.5, 
                fillColor: dataColor(feature.geometry.coordinates[2]), // use index 2 for the depth
                color: "000000", //black outline
                radius: radiusSize(feature.properties.mag),
                weight: 0.5,
                stroke: true
            }
        }
        // add the GeoJson data to the earthQuake layer Group
        L.geoJson(earthquakeData, {
            //make each maker which is a circle
            pointToLayer: function(feature, latLng){
                return L.circleMarker(latLng);
            }, 
            // set the style for each marker
            style: dataStyle, // call the data style function and pass in earthquake data
            // add popups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                    Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                    Location: <b>${feature.properties.place}</b>`);
            } 
        }).addTo(earthquakes); 
    }
);
    // add the earthquake layer to the map 
    earthquakes.addTo(myMap);

// add the overlay for the tectonic plates and for the earthquakes
let overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquake Data": earthquakes
};

// add the Layer control 
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);

    // add the legend to the map 
    let legend = L.control({
        position: "bottomright"
    });

   // add properties for the legend
   legend.onAdd = function() {
    // div for the legend to appear in the page
    let div = L.DomUtil.create("div", "info legend");
    
    // set up the intervals 
    let intervals = [-10, 10, 30 , 50, 70, 90];
    //set the colors for the intervals 
    let colors = [
        "green", 
        "#C1EA2B",
        "#E58107",
        "#EACA2B",
        "#E53B07",
        "red"

    ];

    //loop through the intervals and the colors and geneate a label
    // with a colored square for each interval
    for(var i = 0; i < intervals.length; i++)
    {
        div.innerHTML += "<i style='background: "
            + colors[i]
            + "; width: 18px; height: 18px; display: inline-block; margin-right: 5px;'></i> "
            + intervals[i] + (intervals[i + 1] ? "&ndash;" + intervals[i + 1] + " km<br>" : "+ km");
    }
    return div;
   };

   //add the legend to the map 
   legend.addTo(myMap);