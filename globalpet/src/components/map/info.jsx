// RouteInfo.js
import React, { useContext } from 'react';
import RouteContext from './RouteContext'; // Import RouteContext
import './map.css';

function Info() {
// when the distance state 
  const { distance, duration } = useContext(RouteContext);
  
  const distanceInKm = Math.floor(distance / 1000);
  const costPerKm = 1.2; // zl0.3 per kilometer
  const totalCost = distanceInKm * 2 * costPerKm;

  return (
    <div className="info">
      {distance === 0 ? (
        <p>Wybierz trasę...</p>
      ) : (
        <>
          <div className="info-item">
            <p>
              <strong>Czas:</strong>{' '}
              {Math.floor(duration / 60)} min
            </p>
          </div>
          <div className="info-item">
            <p>
              <strong>Dystans:</strong>{' '}
              {distanceInKm} km
            </p>
          </div>
          <div className="info-item">
            <p>
              <strong>Cena:</strong> {totalCost.toFixed(2)} zł
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Info;
