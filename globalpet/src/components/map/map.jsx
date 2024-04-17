import React, { useState, useEffect, useContext } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import './map.css';

import RouteContext from './RouteContext'; // Import RouteContext

mapboxgl.accessToken = 'pk.eyJ1IjoicXVhcnphIiwiYSI6ImNsdXk0NnF4NDByMHAybG55aTliZ2xwMG4ifQ.n0rAXFpOzrOgntCfPhcDCA';
const start = [19.3039985249618, 51.818758996283094]; // Default start coordinates

function Map() {
  const [map, setMap] = useState(null);
  const {setDistance, setDuration } = useContext(RouteContext);

  useEffect(() => {

    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: start,
      zoom: 12
    });

    newMap.on('load', () => {
      setMap(newMap);

      newMap.loadImage(
        'https://test.globalpet.pl/gb.png',
        (error, image) => {
          if (error) throw error;
          // Add the loaded image to the map
          newMap.addImage('custom-icon', image);
          newMap.addLayer({
            id: 'point',
            type: 'symbol',
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
                      coordinates: start
                    }
                  }
                ]
              }
            },
            layout: {
              'icon-image': 'custom-icon',
              'icon-size': 0.05
            }
          });
        }
      );

      // Display initial route
      getRoute(start, start, 'green');
    });

    return () => newMap.remove();
  }, []);

  const getRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch route data');
      }
      const data = await response.json();
      const route = data.routes[0];

      setDistance(route.distance);
      setDuration(route.duration);

      // Show route on map
      map.getSource('route').setData(route.geometry);
      
      return route;
    } catch (error) {
      console.error('Error fetching route data:', error);
      return null;
    }
  };

  const handleClick = async (e) => {
    if (!map) return;

    const coordinates = [e.lngLat.lng, e.lngLat.lat];
    const route = await getRoute(start, coordinates);

    if (route) {
      // Show route on map
      map.getSource('route').setData(route.geometry);
    }

    map.addLayer({
      id: 'pickup-point',
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
                coordinates: pickupPoint
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 6,
        'circle-color': 'green'
      }
    });
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '100vh' }} onClick={handleClick}></div>
    </div>
  );
}

export default Map;
