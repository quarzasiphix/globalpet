// RouteContext.js
import React, { createContext, useState } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <RouteContext.Provider value={{ distance, setDistance, duration, setDuration }}>
      {children}
    </RouteContext.Provider>
  );
};

export default RouteContext;
