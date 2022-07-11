
const reviewForm = document.querySelector(".reviewForm");
const defaultStarInput = document.querySelector("input[name='review[rating]']");
const statusContainer = document.querySelector("#status");
if (reviewForm) {
    reviewForm.addEventListener("submit", function (e) {
        if (defaultStarInput.checked) {
            statusContainer.classList.remove("d-none");
            e.preventDefault();
        } else {
            statusContainer.classList.add("d-none");
        }
    })
};

mapboxgl.accessToken = 'pk.eyJ1IjoibW9vbm1pbiIsImEiOiJjbDVnaG43Y3AxbGF1M29tdGR3djJlaXJxIn0.-CGqoI0JPbYEHVjQyM7Utw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    .addTo(map)
