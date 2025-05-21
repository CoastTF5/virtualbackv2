import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import SnapshotItem from './SnapshotItem';

function MoodBoardCanvas({ items = [], onUpdateLayout, onRemoveItem }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [draggingItem, setDraggingItem] = useState(null);

  // Set up drop target
  const [, drop] = useDrop({
    accept: 'snapshot',
    drop: (item, monitor) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dropPosition = monitor.getClientOffset();
      
      // Calculate position relative to canvas
      const x = dropPosition.x - canvasRect.left;
      const y = dropPosition.y - canvasRect.top;
      
      // If item is from the sidebar (new item)
      if (item.isNew) {
        // Handle logic for adding new item to the canvas
        // This would be handled in the parent component
      } else {
        // Update existing item position
        handleItemMove(item.id, { x, y });
      }
    }
  });

  // Initialize canvas size
  useEffect(() => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    }
    
    // Update canvas size on window resize
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle item position change
  const handleItemMove = (itemId, position) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          position
        };
      }
      return item;
    });
    
    onUpdateLayout(updatedItems);
  };

  // Handle item rotation
  const handleItemRotate = (itemId, rotation) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          rotation
        };
      }
      return item;
    });
    
    onUpdateLayout(updatedItems);
  };

  // Handle item scaling
  const handleItemScale = (itemId, scale) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          scale
        };
      }
      return item;
    });
    
    onUpdateLayout(updatedItems);
  };

  // Return the drop reference to the canvas div
  drop(canvasRef);

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full min-h-[500px] bg-gray-100 relative overflow-hidden"
    >
      {items.map((item) => (
        <SnapshotItem
          key={item.id}
          id={item.id}
          snapshot={item.snapshot}
          position={item.position}
          rotation={item.rotation || 0}
          scale={item.scale || 1}
          onMove={(position) => handleItemMove(item.id, position)}
          onRotate={(rotation) => handleItemRotate(item.id, rotation)}
          onScale={(scale) => handleItemScale(item.id, scale)}
          onRemove={() => onRemoveItem(item.id)}
          canvasSize={canvasSize}
          isSelected={draggingItem === item.id}
          onSelect={() => setDraggingItem(item.id)}
        />
      ))}

      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-2">Add snapshots to create your mood board</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodBoardCanvas;