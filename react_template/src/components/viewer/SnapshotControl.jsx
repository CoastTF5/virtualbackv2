import React, { useState } from 'react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

function SnapshotControl({ snapshots = [], onClose, onDelete }) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : snapshots.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < snapshots.length - 1 ? prev + 1 : 0));
  };

  const handleDelete = () => {
    if (onDelete && snapshots[selectedIndex]) {
      onDelete(snapshots[selectedIndex].id);
    }
  };

  const handleAddToMoodBoard = () => {
    if (snapshots[selectedIndex]) {
      navigate('/moodboard/new', { state: { snapshots: [snapshots[selectedIndex]] } });
      if (onClose) onClose();
    }
  };

  if (!snapshots.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Snapshot {selectedIndex + 1} of {snapshots.length}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <div className="relative bg-black flex items-center justify-center">
            <img
              src={snapshots[selectedIndex]?.imageUrl}
              alt={`Snapshot ${selectedIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain"
            />

            {/* Navigation buttons */}
            {snapshots.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 p-1 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white"
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-1 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white"
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Snapshot metadata and controls */}
          <div className="p-4">
            <h4 className="font-medium text-gray-900">
              {snapshots[selectedIndex]?.title || 'Untitled Snapshot'}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              From: {snapshots[selectedIndex]?.assetTitle || 'Unknown Asset'}
            </p>
            <p className="text-sm text-gray-500">
              Created: {new Date(snapshots[selectedIndex]?.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleAddToMoodBoard}>
                Add to Mood Board
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = snapshots[selectedIndex]?.imageUrl;
                  a.download = `snapshot-${Date.now()}.jpg`;
                  a.click();
                }}
              >
                Download
              </Button>
              {onDelete && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail navigation */}
        {snapshots.length > 1 && (
          <div className="p-4 border-t border-gray-200 overflow-x-auto">
            <div className="flex space-x-2">
              {snapshots.map((snapshot, index) => (
                <button
                  key={snapshot.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={snapshot.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SnapshotControl;