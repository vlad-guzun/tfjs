import React, { useState, useEffect } from 'react';

export function PulsatingCircle() {
  const [scale, setScale] = useState(100); 
  const [increasing, setIncreasing] = useState(true); 

  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prevScale => {
        if (prevScale >= 105) {
          setIncreasing(false);
        } else if (prevScale <= 100) {
          setIncreasing(true);
        }
        return increasing ? prevScale + 1 : prevScale - 1;
      });
    }, 20); 

    return () => clearInterval(interval); 
  }, [increasing]);

  const circleStyle = {
    width: '10px',
    height: '10px',
    backgroundColor: '#4CAF50',  
    borderRadius: '50%',
    transform: `scale(${scale / 100})`, 
  };

  return <div style={circleStyle} />;
}

