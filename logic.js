// API key
const API_KEY = "pk.eyJ1IjoiYmFyYmFyYXlzbCIsImEiOiJjazQyMGszaXAwM2lyM2twdGQ0dWppNzJsIn0.JhEljgI3217QYJaPTo7JCQ";

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5

});

function markerSize(mag) {
  return mag*20000;
}

function chooseColor(mag) {
  switch (true) {
  case (0<=mag && mag<=1):
    return "#BFF250";
  case (1<mag && mag<=2):
     return "#EDF24B"; 
  case (2<mag && mag<=3):
    return "#F2CA50"; 
 case (3<mag && mag<=4):
    return "#F29E6D";
    case (mag>4):
      return "#ea0437"; 
      default:
        return "black";}
  }

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl).then((data) => {
    // Once we get a response, send the data.features object to the createFeatures function
    // createFeatures(data.features);
    console.log(data);
    for (var i = 0; i < data.features.length; i++) {
      var places= data.features[i].geometry;
     geojson= L.circle([places.coordinates[1],places.coordinates[0]], {
        fillOpacity: 0.8,
        weight:0.5,
        color: "black",
        fillColor: chooseColor(data.features[i].properties.mag),
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(data.features[i].properties.mag)
      }).bindPopup("<h3>" + data.features[i].properties.place + " Mag: "+ data.features[i].properties.mag +
      "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>").addTo(myMap)

  };
    // Set up the legend
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Magnitude</h4>";
      div.innerHTML += '<i style="background: #ea0437"></i><span>> 4</span><br>';
      div.innerHTML += '<i style="background: #F29E6D"></i><span>3-4</span><br>';
      div.innerHTML += '<i style="background: #F2CA50"></i><span>2-3</span><br>';
      div.innerHTML += '<i style="background: #EDF24B"></i><span>1-2</span><br>';
      div.innerHTML += '<i style="background: #BFF250"></i><span><1</span><br>';
      
         
    
      return div;
    };
    
  
    legend.addTo(myMap);
});
  