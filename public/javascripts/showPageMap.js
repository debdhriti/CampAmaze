//for mapbox
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: passedCampground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

//navigation controls
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

new mapboxgl.Marker()
  .setLngLat(passedCampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${passedCampground.title}</h3><p>${passedCampground.location}</p>`
    )
  )
  .addTo(map);
