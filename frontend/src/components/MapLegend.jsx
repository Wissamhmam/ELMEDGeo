import React from 'react';
import { Info } from 'lucide-react';

const MapLegend = () => {
  const legendItems = [
    {
      label: 'Parcelle',
      color: '#00f2fe',
      type: 'area'
    },
    {
      label: 'Tracé de la ligne',
      color: '#ef4444',
      type: 'dashed-line'
    },
    {
      label: 'Emprise du projet',
      color: '#10b981',
      type: 'line'
    }
  ];

  return (
    <div className="glass-card px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-1.5 text-primary font-bold uppercase text-[10px] tracking-wider border-r border-glass-border pr-4 mr-2">
        <Info size={12} />
        Légende
      </div>
      
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <div className="shrink-0">
            {item.type === 'area' && (
              <div 
                className="w-3.5 h-3.5 rounded-sm border" 
                style={{ 
                  borderColor: item.color, 
                  backgroundColor: `${item.color}33` 
                }} 
              />
            )}
            {item.type === 'line' && (
              <div className="w-4 h-4 flex items-center justify-center">
                <div 
                  className="w-full h-0.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
              </div>
            )}
            {item.type === 'dashed-line' && (
              <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full h-0.5" 
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${item.color} 50%, transparent 50%)`,
                    backgroundSize: '4px 100%',
                    backgroundRepeat: 'repeat-x'
                  }} 
                />
              </div>
            )}
          </div>
          <span className="text-[11px] font-medium text-white/90 group-hover:text-primary transition-colors">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
