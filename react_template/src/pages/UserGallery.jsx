import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import SnapshotControl from '../components/viewer/SnapshotControl';
import { useSnapshot } from '../context/SnapshotContext';
import { StorageService } from '../services/StorageService';

function UserGallery() {
  const navigate = useNavigate();
  const { snapshots, fetchSnapshots, deleteSnapshot, loading } = useSnapshot();
  const [moodboards, setMoodboards] = useState([]);
  const [moodboardsLoading, setMoodboardsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('snapshots');
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);
  const [showSnapshotViewer, setShowSnapshotViewer] = useState(false);
  const [viewingSnapshots, setViewingSnapshots] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fetch snapshots and moodboards
  useEffect(() => {
    fetchSnapshots();
    
    const loadMoodboards = async () => {
      try {
        setMoodboardsLoading(true);
        const userMoodboards = await StorageService.getUserMoodBoards();
        setMoodboards(userMoodboards);
      } catch (err) {
        console.error('Error loading moodboards:', err);
      } finally {
        setMoodboardsLoading(false);
      }
    };
    
    loadMoodboards();
  }, [fetchSnapshots]);

  // Handle snapshot selection toggle
  const handleSnapshotToggle = (snapshot) => {
    setSelectedSnapshots(prev => {
      if (prev.some(s => s.id === snapshot.id)) {
        return prev.filter(s => s.id !== snapshot.id);
      } else {
        return [...prev, snapshot];
      }
    });
  };

  // Handle viewing a snapshot
  const handleViewSnapshot = (snapshot) => {
    setViewingSnapshots([snapshot]);
    setShowSnapshotViewer(true);
  };

  // Handle creating a new mood board with selected snapshots
  const handleCreateMoodBoard = () => {
    navigate('/moodboard/new', { state: { snapshots: selectedSnapshots } });
  };

  // Handle deleting a moodboard
  const handleDeleteMoodboard = async (moodboardId) => {
    try {
      await StorageService.deleteMoodBoard(moodboardId);
      setMoodboards(prev => prev.filter(mb => mb.id !== moodboardId));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting moodboard:', err);
    }
  };

  // Handle deleting selected snapshots
  const handleDeleteSnapshots = async () => {
    try {
      // Delete each selected snapshot
      for (const snapshot of selectedSnapshots) {
        await deleteSnapshot(snapshot.id);
      }
      
      // Clear selection
      setSelectedSnapshots([]);
    } catch (err) {
      console.error('Error deleting snapshots:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Gallery</h1>
        <p className="mt-2 text-gray-600">
          Manage your saved snapshots and mood boards
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex -mb-px">
          <button
            className={`mr-8 py-4 border-b-2 text-sm font-medium ${
              activeTab === 'snapshots'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('snapshots')}
          >
            Snapshots
          </button>
          <button
            className={`mr-8 py-4 border-b-2 text-sm font-medium ${
              activeTab === 'moodboards'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('moodboards')}
          >
            Mood Boards
          </button>
        </div>
      </div>

      {/* Snapshots Tab */}
      {activeTab === 'snapshots' && (
        <div>
          {/* Action buttons */}
          {selectedSnapshots.length > 0 && (
            <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                {selectedSnapshots.length} snapshot{selectedSnapshots.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCreateMoodBoard}
                >
                  Create Mood Board
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteSnapshots}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Snapshots grid */}
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loading text="Loading snapshots..." />
            </div>
          ) : snapshots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className={`group border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    selectedSnapshots.some((s) => s.id === snapshot.id)
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  {/* Snapshot image */}
                  <div
                    className="aspect-w-16 aspect-h-9 cursor-pointer"
                    onClick={() => handleViewSnapshot(snapshot)}
                  >
                    <img
                      src={snapshot.imageUrl}
                      alt={snapshot.title || 'Snapshot'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Snapshot details */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {snapshot.title || 'Untitled Snapshot'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {snapshot.assetTitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(snapshot.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => handleSnapshotToggle(snapshot)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {selectedSnapshots.some((s) => s.id === snapshot.id)
                          ? 'Deselect'
                          : 'Select'}
                      </button>
                      <button
                        onClick={() => handleViewSnapshot(snapshot)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No snapshots yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Take snapshots of assets to save them to your gallery.
              </p>
              <div className="mt-6">
                <Link to="/">
                  <Button>Browse Assets</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Moodboards Tab */}
      {activeTab === 'moodboards' && (
        <div>
          {/* Create new moodboard button */}
          <div className="mb-6 flex justify-end">
            <Link to="/moodboard/new">
              <Button>Create New Mood Board</Button>
            </Link>
          </div>

          {/* Moodboards grid */}
          {moodboardsLoading ? (
            <div className="py-16 flex justify-center">
              <Loading text="Loading mood boards..." />
            </div>
          ) : moodboards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moodboards.map((moodboard) => (
                <div
                  key={moodboard.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Moodboard preview */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                    {moodboard.items && moodboard.items.length > 0 ? (
                      moodboard.items.slice(0, 3).map((item, index) => (
                        <div
                          key={item.id}
                          className="absolute"
                          style={{
                            top: `${20 + index * 15}%`,
                            left: `${20 + index * 15}%`,
                            width: '50%',
                            transform: `rotate(${-5 + index * 5}deg)`,
                            zIndex: index,
                          }}
                        >
                          <img
                            src={item.snapshot.imageUrl}
                            alt=""
                            className="w-full h-full object-contain shadow-md"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Empty moodboard</p>
                      </div>
                    )}
                  </div>

                  {/* Moodboard details */}
                  <div className="p-4">
                    <h3 className="text-md font-medium text-gray-900 truncate">
                      {moodboard.title || 'Untitled Mood Board'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {moodboard.items?.length || 0} items • Last updated{' '}
                      {new Date(moodboard.updatedAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        to={`/moodboard/${moodboard.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmation(moodboard.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No mood boards yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first mood board to collect and arrange snapshots.
              </p>
              <div className="mt-6">
                <Link to="/moodboard/new">
                  <Button>Create Mood Board</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Snapshot viewer modal */}
      {showSnapshotViewer && viewingSnapshots.length > 0 && (
        <SnapshotControl
          snapshots={viewingSnapshots}
          onClose={() => setShowSnapshotViewer(false)}
          onDelete={(id) => {
            deleteSnapshot(id);
            setShowSnapshotViewer(false);
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <Modal
          title="Delete Mood Board"
          onClose={() => setDeleteConfirmation(null)}
          size="sm"
        >
          <div className="p-6">
            <p className="text-gray-700">
              Are you sure you want to delete this mood board? This action cannot be undone.
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmation(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteMoodboard(deleteConfirmation)}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default UserGallery;