import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

function SnapshotItem({ 
  id, 
  snapshot, 
  position, 
  rotation = 0, 
  scale = 1, 
  onMove, 
  onRotate, 
  onScale, 
  onRemove,
  canvasSize,
  isSelected,
  onSelect
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const itemRef = useRef(null);
  const rotationStartPos = useRef(null);
  const scaleStartPos = useRef(null);
  const startRotation = useRef(rotation);
  const startScale = useRef(scale);

  // Set up drag functionality
  const [{ opacity }, drag] = useDrag(() => ({
    type: 'snapshot',
    item: () => {
      setIsDragging(true);
      return { id, position };
    },
    end: () => setIsDragging(false),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  }), [id, position]);

  // Calculate item style based on position, rotation, and scale
  const itemStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${rotation}deg) scale(${scale})`,
    opacity,
    zIndex: isSelected || isDragging ? 10 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  // Handle rotation control
  const startRotating = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    rotationStartPos.current = {
      x: e.clientX,
      y: e.clientY
    };
    startRotation.current = rotation;
    document.addEventListener('mousemove', handleRotate);
    document.addEventListener('mouseup', stopRotating);
  };

  const handleRotate = (e) => {
    if (!isRotating || !itemRef.current) return;
    
    const itemRect = itemRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top + itemRect.height / 2;
    
    const startAngle = Math.atan2(
      rotationStartPos.current.y - itemCenterY,
      rotationStartPos.current.x - itemCenterX
    );
    
    const currentAngle = Math.atan2(
      e.clientY - itemCenterY,
      e.clientX - itemCenterX
    );
    
    let newRotation = startRotation.current + ((currentAngle - startAngle) * (180 / Math.PI));
    
    // Snap to 15-degree increments when holding Shift
    if (e.shiftKey) {
      newRotation = Math.round(newRotation / 15) * 15;
    }
    
    onRotate(newRotation);
  };

  const stopRotating = () => {
    setIsRotating(false);
    document.removeEventListener('mousemove', handleRotate);
    document.removeEventListener('mouseup', stopRotating);
  };

  // Handle scaling control
  const startScaling = (e) => {
    e.stopPropagation();
    setIsScaling(true);
    scaleStartPos.current = {
      x: e.clientX,
      y: e.clientY
    };
    startScale.current = scale;
    document.addEventListener('mousemove', handleScale);
    document.addEventListener('mouseup', stopScaling);
  };

  const handleScale = (e) => {
    if (!isScaling) return;
    
    const dx = e.clientX - scaleStartPos.current.x;
    const dy = e.clientY - scaleStartPos.current.y;
    
    // Use diagonal distance for scaling
    const distance = Math.sqrt(dx * dx + dy * dy);
    const direction = dx > 0 || dy > 0 ? 1 : -1;
    
    // Scale factor based on movement
    let scaleFactor = 1 + (direction * distance / 200);
    let newScale = startScale.current * scaleFactor;
    
    // Constrain scale
    newScale = Math.max(0.2, Math.min(3, newScale));
    
    onScale(newScale);
  };

  const stopScaling = () => {
    setIsScaling(false);
    document.removeEventListener('mousemove', handleScale);
    document.removeEventListener('mouseup', stopScaling);
  };

  // Connect the drag ref to the div
  drag(itemRef);

  return (
    <div
      ref={itemRef}
      className={`absolute select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <img
        src={snapshot.imageUrl}
        alt={snapshot.title || "Snapshot"}
        className="max-w-xs shadow-md"
        draggable={false}
      />
      
      {/* Controls that appear on hover or when selected */}
      {(isHovered || isSelected) && (
        <>
          {/* Remove button */}
          <button
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Rotation control */}
          <button
            className="absolute top-1/2 -right-6 bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-gray-100 cursor-alias"
            onMouseDown={startRotating}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Scale control */}
          <button
            className="absolute -bottom-3 -right-3 bg-white text-gray-700 rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-gray-100 cursor-se-resize"
            onMouseDown={startScaling}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default SnapshotItem;