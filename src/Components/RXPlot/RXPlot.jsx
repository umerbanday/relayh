import React from 'react';
import {Plot} from 'react-plotly/src/react-plotly';

export default function RXPlot({ zoneData, lineAngle }) {
  const createQuadrilateral = (reach, resistiveReach, lineAngle) => {
    // Convert angle to radians
    const angleRad = (lineAngle * Math.PI) / 180;
    
    // Calculate quadrilateral corners
    const x = [
      0,  // Origin
      reach * Math.cos(angleRad),  // Reach point
      reach * Math.cos(angleRad),  // Top right
      0,  // Top center
      -reach * Math.cos(angleRad), // Top left
      -reach * Math.cos(angleRad), // Left reach
      0   // Back to origin
    ];
    
    const y = [
      0,  // Origin
      reach * Math.sin(angleRad),  // Reach point
      resistiveReach,  // Top right
      resistiveReach,  // Top center
      resistiveReach,  // Top left
      reach * Math.sin(angleRad),  // Left reach
      0   // Back to origin
    ];
    
    return { x, y };
  };

  const traces = [];
  const colors = ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(255,255,0,0.3)'];

  // Create traces for each zone
  Object.entries(zoneData).forEach(([zone, data], index) => {
    const quad = createQuadrilateral(data.reach, data.resistiveReach, lineAngle);
    traces.push({
      x: quad.x,
      y: quad.y,
      fill: 'toself',
      fillcolor: colors[index],
      line: { color: colors[index].replace('0.3', '1') },
      name: `Zone ${zone}`
    });
  });

  // Add characteristic angle line
  const lineLength = Math.max(...Object.values(zoneData).map(z => z.reach)) * 1.2;
  traces.push({
    x: [0, lineLength * Math.cos((lineAngle * Math.PI) / 180)],
    y: [0, lineLength * Math.sin((lineAngle * Math.PI) / 180)],
    line: { color: 'black', dash: 'dash' },
    name: 'Line Angle'
  });

  const layout = {
    title: 'Distance Protection Zones',
    xaxis: {
      title: 'R (Ω)',
      range: [-lineLength, lineLength]
    },
    yaxis: {
      title: 'X (Ω)',
      range: [0, lineLength]
    },
    showlegend: true,
    grid: { rows: 1, columns: 1, pattern: 'independent' }
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '600px' }}
    />
  );
}
