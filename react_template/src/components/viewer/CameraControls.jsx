import React from 'react';

const presetCameras = [
  { id: 'default', name: 'Default View' },
  { id: 'front', name: 'Front View' },
  { id: 'side', name: 'Side View' },
  { id: 'top', name: 'Top View' },
  { id: 'closeup', name: 'Close-Up View' }
];

function CameraControls({ currentCamera = 'default', onCameraChange }) {
  return (
    <div className="bg-black bg-opacity-50 px-3 py-2 rounded-md">
      <div className="flex flex-col space-y-1">
        {presetCameras.map(camera => (
          <button
            key={camera.id}
            onClick={() => onCameraChange(camera.id)}
            className={`px-2 py-1 text-xs rounded-md ${
              currentCamera === camera.id 
                ? 'bg-blue-500 text-white' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {camera.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CameraControls;