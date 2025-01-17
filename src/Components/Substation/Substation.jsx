import React, { useState, useRef } from 'react';
import { Card, Typography, IconButton } from '@mui/joy';
import Draggable from 'react-draggable';
import { 
  Cable, CheckroomSharp, Book
} from '@mui/icons-material';
import { ButtonBase } from '@mui/material';

const SubstationDiagram = () => {
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const canvasRef = useRef(null);
  
  const GRID_SIZE = 30;

  const componentTypes = {
    bus: { icon: Cable, name: "Bus Bar", width: 100 },
    transformer: { icon: CheckroomSharp, name: "Transformer", width: 40 },
    breaker: { icon: Book, name: "Circuit Breaker", width: 30 },

  };

  const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleDragStart = (type, fromPalette = true) => {
    if (fromPalette) {
      setDragging(type);
    }
  };

  const handleDrop = (e) => {
    if (!dragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left);
    const y = snapToGrid(e.clientY - rect.top);

    setComponents([
      ...components,
      {
        id: `component-${components.length}`,
        type: dragging,
        x,
        y
      }
    ]);

    setDragging(null);
  };

  const handleComponentClick = (e, componentId) => {
    e.stopPropagation();
    
    if (connecting === null) {
      setConnecting(componentId);
    } else if (connecting !== componentId) {
      setConnections([
        ...connections,
        {
          id: `connection-${connections.length}`,
          from: connecting,
          to: componentId
        }
      ]);
      setConnecting(null);
    }
  };

  const onDragStop = (e, data, componentId) => {
    const x = snapToGrid(data.x);
    const y = snapToGrid(data.y);
    
    setComponents(components.map(comp =>
      comp.id === componentId
        ? { ...comp, x, y }
        : comp
    ));
  };

  const GridLines = () => {
    // Get dimensions after the component has mounted
    const width = canvasRef.current?.offsetWidth || 0;
    const height = canvasRef.current?.offsetHeight || 0;
    const horizontalLines = [];
    const verticalLines = [];

    for (let i = GRID_SIZE; i < width; i += GRID_SIZE) {
      verticalLines.push(
        <line
          key={`v-${i}`}
          x1={i}
          y1={0}
          x2={i}
          y2={height}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }

    for (let i = GRID_SIZE; i < height; i += GRID_SIZE) {
      horizontalLines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i}
          x2={width}
          y2={i}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }

    return [...horizontalLines, ...verticalLines];
  };

  // Add this helper function to calculate component center
  const getComponentCenter = (component) => {
    // IconButton is 30x30 (transform -50% accounts for this)
    return {
      x: component.x + 15,
      y: component.y + 15
    };
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: '4xl' }}>
      <Typography level="h4" sx={{ p: 2 }}>
        Substation Single Line Diagram Editor
      </Typography>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Card
          variant="soft"
          sx={{
            width: '200px',
            bgcolor: 'background.level1',
            p: 2
          }}
        >
          <Typography level="h6" sx={{ mb: 2 }}>
            Components
          </Typography>
          {Object.entries(componentTypes).map(([type, { icon: Icon, name }]) => (
            <Card
              key={type}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                p: 1,
                cursor: 'move',
                '&:hover': {
                  bgcolor: 'background.level2'
                }
              }}
              draggable
              onDragStart={() => handleDragStart(type)}
            >
              <Icon />
              <Typography level="body-sm">{name}</Typography>
            </Card>
          ))}
        </Card>
        
        <div
          ref={canvasRef}
          style={{
            flex: 1,
            height: '384px',
            background: 'white',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden' // Prevent scroll during drag
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <svg 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <GridLines />
            
            {connections.map((connection) => {
              const fromComponent = components.find(c => c.id === connection.from);
              const toComponent = components.find(c => c.id === connection.to);
              if (!fromComponent || !toComponent) return null;

              const fromCenter = getComponentCenter(fromComponent);
              const toCenter = getComponentCenter(toComponent);

              return (
                <line
                  key={connection.id}
                  x1={fromCenter.x}
                  y1={fromCenter.y}
                  x2={toCenter.x}
                  y2={toCenter.y}
                  stroke="black"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {components.map((component) => {
            const { icon: Icon } = componentTypes[component.type];
            return (
              <Draggable
                key={component.id}
                grid={[GRID_SIZE, GRID_SIZE]}
                position={{ x: component.x, y: component.y }}
                onStop={(e, data) => onDragStop(e, data, component.id)}
                bounds="parent"
              >
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
                  <ButtonBase
                    
                    style={{backgroundColor:'lightgray', borderRadius: '5px'}}
                    variant={connecting === component.id ? "soft" : "plain"}
                    color={connecting === component.id ? "primary" : "neutral"}
                    onClick={(e) => handleComponentClick(e, component.id)}
                  >
                    <Icon style={{width: '30px', height: '30px'}}/>
                  </ButtonBase>
                </div>
              </Draggable>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SubstationDiagram;