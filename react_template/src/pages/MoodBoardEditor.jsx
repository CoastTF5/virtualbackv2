import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import MoodBoardCanvas from '../components/moodboard/MoodBoardCanvas';
import ShareOptions from '../components/moodboard/ShareOptions';
import { useSnapshot } from '../context/SnapshotContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/StorageService';
import { v4 as uuidv4 } from 'uuid';

function MoodBoardEditor() {
  const { moodboardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { snapshots, loading: snapshotsLoading, fetchSnapshots } = useSnapshot();
  
  const [moodboard, setMoodboard] = useState(null);
  const [moodboardItems, setMoodboardItems] = useState([]);
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [error, setError] = useState(null);

  // Check for snapshots passed from other pages
  useEffect(() => {
    if (location.state?.snapshots) {
      // Add snapshots from navigation state to selected snapshots
      setSelectedSnapshots(prevSelected => {
        const newSnapshots = location.state.snapshots.filter(
          snap => !prevSelected.some(s => s.id === snap.id)
        );
        return [...prevSelected, ...newSnapshots];
      });
      
      // Clear the state to avoid re-adding on navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Load moodboard data if editing existing
  useEffect(() => {
    const loadMoodboard = async () => {
      if (!moodboardId || moodboardId === 'new') return;
      
      try {
        setIsLoading(true);
        const data = await StorageService.getMoodBoard(moodboardId);
        setMoodboard(data);
        setTitle(data.title);
        setDescription(data.description);
        setMoodboardItems(data.items || []);
      } catch (err) {
        console.error('Error loading moodboard:', err);
        setError('Failed to load mood board. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoodboard();
  }, [moodboardId]);

  // Fetch user snapshots
  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  // Handle adding selected snapshots to the moodboard
  const handleAddSnapshots = () => {
    // Add new items for each selected snapshot
    const newItems = selectedSnapshots.map(snapshot => ({
      id: `item-${uuidv4()}`,
      snapshot,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 200 + 100
      },
      rotation: Math.random() * 10 - 5,
      scale: 1,
      zIndex: moodboardItems.length
    }));
    
    setMoodboardItems([...moodboardItems, ...newItems]);
    setSelectedSnapshots([]);
    setShowSnapshots(false);
  };

  // Handle updating layout of items on the canvas
  const handleUpdateLayout = (updatedItems) => {
    setMoodboardItems(updatedItems);
  };

  // Handle removing an item from the canvas
  const handleRemoveItem = (itemId) => {
    setMoodboardItems(moodboardItems.filter(item => item.id !== itemId));
  };

  // Handle snapshot selection toggle
  const handleSnapshotToggle = (snapshot) => {
    setSelectedSnapshots(prevSelected => {
      if (prevSelected.some(s => s.id === snapshot.id)) {
        // Remove from selection
        return prevSelected.filter(s => s.id !== snapshot.id);
      } else {
        // Add to selection
        return [...prevSelected, snapshot];
      }
    });
  };

  // Handle save moodboard
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your mood board');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const moodboardData = {
        id: moodboard?.id || `moodboard-${uuidv4()}`,
        title,
        description,
        items: moodboardItems,
        createdAt: moodboard?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.id,
        creatorName: user?.name
      };
      
      const savedMoodboard = await StorageService.saveMoodBoard(moodboardData);
      
      // Navigate to the saved moodboard
      navigate(`/moodboard/${savedMoodboard.id}`, { replace: true });
      
      // Show success message
      alert('Mood board saved successfully!');
    } catch (err) {
      console.error('Error saving moodboard:', err);
      setError('Failed to save mood board. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading text="Loading mood board..." />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto pb-16">
        {/* Header section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter mood board title"
              className="text-3xl font-bold text-gray-900 w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-1"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="mt-2 text-gray-600 w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
              rows={2}
            />
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="secondary" onClick={() => setShowSnapshots(true)}>
              Add Snapshots
            </Button>
            
            {hasPermission('share') && (
              <Button variant="secondary" onClick={() => setShowShareOptions(true)}>
                Share
              </Button>
            )}
            
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Canvas area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              {moodboardItems.length} item{moodboardItems.length !== 1 ? 's' : ''}
            </h3>
            
            <div className="text-xs text-gray-500">
              Drag items to position • Use controls to resize and rotate
            </div>
          </div>
          
          <div className="h-[600px]">
            <MoodBoardCanvas 
              items={moodboardItems} 
              onUpdateLayout={handleUpdateLayout} 
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
        
        {/* Snapshots selection modal */}
        {showSnapshots && (
          <Modal title="Add Snapshots" onClose={() => setShowSnapshots(false)}>
            <div className="p-6 max-h-96 overflow-y-auto">
              {snapshotsLoading ? (
                <Loading text="Loading your snapshots..." />
              ) : snapshots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {snapshots.map(snapshot => (
                    <div 
                      key={snapshot.id} 
                      onClick={() => handleSnapshotToggle(snapshot)}
                      className={`
                        border rounded-md overflow-hidden cursor-pointer 
                        ${selectedSnapshots.some(s => s.id === snapshot.id) 
                          ? 'ring-2 ring-blue-500' 
                          : 'border-gray-200 hover:border-blue-300'}
                      `}
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img 
                          src={snapshot.imageUrl} 
                          alt={snapshot.title || "Snapshot"} 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-sm truncate">{snapshot.title || "Untitled"}</p>
                        <p className="text-xs text-gray-500 truncate">{snapshot.assetTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-900">No snapshots available</p>
                  <p className="text-sm text-gray-500">
                    Take snapshots from asset detail pages to use in your mood board.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button 
                onClick={handleAddSnapshots} 
                disabled={selectedSnapshots.length === 0}
              >
                Add {selectedSnapshots.length > 0 ? `(${selectedSnapshots.length})` : ''}
              </Button>
            </div>
          </Modal>
        )}
        
        {/* Share options modal */}
        {showShareOptions && (
          <ShareOptions 
            shareUrl={`https://virtualbacklot.paramount.com/shared/${moodboard?.id || 'new-moodboard'}`}
            boardTitle={title || 'Untitled Mood Board'}
            onClose={() => setShowShareOptions(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default MoodBoardEditor;