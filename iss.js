var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGLandsatLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));

var position = new WorldWind.Position(30, -105, 400);

var modelLayer = new WorldWind.RenderableLayer("ISS");
wwd.addLayer(modelLayer);

var cLoader = new WorldWind.ColladaLoader(position);

// Placemark Layer
var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

// Placemark Attributes
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
  WorldWind.OFFSET_FRACTION, 0.3,
  WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
  WorldWind.OFFSET_FRACTION, 0.5,
  WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

// Placemark
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

//cLoader.load("iss.dae", function(cmodel) {});
cLoader.load("./iss.dae", function(cmodel) {
  cmodel.scale = 10000;
  modelLayer.addRenderable(cmodel);

  placemark.alwaysOnTop = true;
  placemarkLayer.addRenderable(placemark);

  // Update object markers
  window.setInterval(function() {
    $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
      position = new WorldWind.Position(
        data['latitude'],
        data['longitude'],
        data['altitude']
      );

      cmodel.position = position;
      placemark.position = position;

      placemark.label = "ISS\n" +
        "(" + position.latitude.toPrecision(5).toString() + ", " + position.longitude.toPrecision(5).toString() + ")";

      console.log(position);
      wwd.redraw();
    });
  }, 2000);
});