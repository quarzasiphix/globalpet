import React from 'react';
import Map from './components/map/map'; // Assuming Map component is in a separate file
import Info from './components/map/info.jsx'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Map />
      <Info/>
    </div>
  );
}

export default App;
