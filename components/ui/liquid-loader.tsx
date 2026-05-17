import React, { useState, useEffect } from 'react';

const LiquidLoading = () => {
  const [heights, setHeights] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [droplets, setDroplets] = useState([false, false, false, false, false, false, false]);
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-green-400 to-cyan-400',
    'from-yellow-400 to-green-400',
    'from-orange-400 to-yellow-400',
    'from-red-500 to-orange-400'
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(prev => prev.map((height, index) => {
        const maxHeight = 80;
        const delay = index * 0.8;
        const time = Date.now() * 0.001;
        const primaryWave = Math.sin(time + delay);
        const bounceWave = Math.sin(time * 4 + delay) * 0.15;
        const ripple = Math.sin(time * 8 + delay) * 0.05;
        return maxHeight * (primaryWave + bounceWave + ripple);
      }));
      setDroplets(prev => prev.map((_, index) => {
        const delay = index * 0.8;
        const time = Date.now() * 0.001;
        return Math.sin(time + delay) > 0.8;
      }));
    }, 32);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end space-x-4 p-8">
      {heights.map((height, index) => (
        <div key={index} className="relative flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index]} mb-3 transition-all duration-500 ease-out ${droplets[index] ? 'opacity-100' : 'opacity-0'}`}
            style={{ filter: 'blur(0.5px)', transform: droplets[index] ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.5)' }} />
          <div className={`w-10 bg-gradient-to-t ${colors[index]} rounded-full transition-all duration-200 ease-out relative overflow-hidden`}
            style={{ height: `${Math.abs(height)}px`, transformOrigin: 'bottom', filter: 'blur(0.3px)' }}>
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
          </div>
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index]} mt-2 transition-all duration-300`}
            style={{ opacity: 0.6, transform: 'scale(0.8)' }} />
        </div>
      ))}
    </div>
  );
};

export default LiquidLoading;
