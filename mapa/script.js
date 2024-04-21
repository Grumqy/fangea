// Replace 'path/to/map.svg' with the correct path to your SVG file
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load SVG map
fetch('path/to/map.svg')
  .then(response => response.text())
  .then(svgData => {
    const customLayer = L.svgOverlay(svgData, bounds).addTo(map);
    map.fitBounds(bounds);
  });

// Enable zoom and pan
map.scrollWheelZoom.enable();

// Measure tool
L.control.measure({
  primaryLengthUnit: 'kilometers',
  secondaryLengthUnit: undefined,
  primaryAreaUnit: undefined,
  secondaryAreaUnit: undefined
}).addTo(map);


