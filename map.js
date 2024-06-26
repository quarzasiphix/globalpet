
mapboxgl.accessToken = 'pk.eyJ1IjoicXVhcnphIiwiYSI6ImNsdXk0NnF4NDByMHAybG55aTliZ2xwMG4ifQ.n0rAXFpOzrOgntCfPhcDCA';  

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-122.662323, 45.523751], // starting position
  zoom: 12
});

  // Load the image
map.loadImage(
  'https://test.globalpet.pl/gb.png',
  (error, image) => {
    if (error) throw error;
    // Add the loaded image to the map
    map.addImage('custom-icon', image);
  }
);


const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: false
});

document.getElementById('search').appendChild(geocoder.onAdd(map));

geocoder.on('result', (event) => {
  const coordinates = event.result.geometry.coordinates;
  const end = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coordinates
        }
      }
    ]
  };

  getRoute(coordinates);

  // Remove existing end destination layer if it exists
  if (map.getLayer('end-point')) {
    map.removeLayer('end-point');
    map.removeSource('end-point');
  }

  // Add a new layer to display the end destination
  map.addLayer({
    id: 'end-point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coordinates
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#ff0000' // Red color for end destination
    }
  });
});

// Add click event listener to the map
map.on('click', (event) => {
  const coordinates = [event.lngLat.lng, event.lngLat.lat];
  getRoute(coordinates);

  // Remove existing end destination layer if it exists
  if (map.getLayer('end-point')) {
    map.removeLayer('end-point');
    map.removeSource('end-point');
  }

  // Add a new layer to display the end destination
  map.addLayer({
    id: 'end-point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coordinates
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#ff0000' // Red color for end destination
    }
  });
});

// create a function to make a directions request
async function getRoute(end) {
  const start = [-122.662323, 45.523751]; // Starting position

  // make a directions request using cycling profile
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];

  const distanceInKm = Math.floor(data.distance / 1000);
  const costPerKm = 0.3; // $0.3 per kilometer
  const totalCost = distanceInKm * costPerKm;

  document.getElementById('info').innerHTML = `
    <p><strong>Trip duration: ${Math.floor(data.duration / 60)} min  </strong></p>
    <p>Distance: ${Math.floor(data.distance / 1000)} km </p>
    <p>Cost: $${totalCost.toFixed(2)}</p>
    <p> </p>
  `;

  document.getElementById('coordinates').innerHTML = `
    <p> coordinates: </p>
    <p>   0: ${end[0]} </p>
    <p>   1: ${end[1]} </p>
  `;
  

  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#34a352',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
}

map.on('load', () => {
  // make an initial directions request that
  // starts and ends at the same location
  
  // Add starting point to the map
  map.addLayer({
    id: 'point',
    type: 'symbol', // Change the type to 'symbol' to display an image
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [-122.662323, 45.523751] // Starting position
            }
          }
        ]
      }
    },
    layout: {
      'icon-image': 'custom-icon', // Use the name of the image added with map.addImage()
      'icon-size': 0.09 // Adjust the icon size if needed
    }
  });

  getRoute([-122.662323, 45.523751]); // Initial route
});
