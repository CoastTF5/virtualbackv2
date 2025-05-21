import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import ThreeJsRenderer from '../components/viewer/ThreeJsRenderer';
import CameraControls from '../components/viewer/CameraControls';
import SnapshotControl from '../components/viewer/SnapshotControl';
import { useAssetPreview } from '../hooks/useAssetPreview';
import { useAuth } from '../context/AuthContext';

function AssetDetailView() {
  const { assetId } = useParams();
  const { user, hasPermission } = useAuth();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [renderMode, setRenderMode] = useState('realtime');
  
  // Use custom hook for asset preview functionality
  const {
    asset,
    loading,
    error,
    viewerRef,
    currentCamera,
    setCurrentCamera,
    isPlaying,
    togglePlayback,
    takeSnapshot,
    snapshots,
  } = useAssetPreview(assetId);

  // Track asset views
  useEffect(() => {
    if (asset && !loading) {
      // In a real app, we would track this view in analytics
      console.log(`Viewed asset: ${asset.id}`);
    }
  }, [asset, loading]);

  // Handle snapshot button click
  const handleSnapshotClick = () => {
    const snapshot = takeSnapshot();
    if (snapshot) {
      setShowSnapshots(true);
    }
  };

  // Handle download options
  const handleDownloadClick = () => {
    if (hasPermission('download')) {
      setShowDownloadOptions(true);
    } else {
      // In a real app, we might show a permission denied message
      alert('You do not have permission to download assets');
    }
  };

  // Handle camera selection
  const handleCameraChange = (cameraId) => {
    setCurrentCamera(cameraId);
    if (viewerRef.current) {
      viewerRef.current.setCameraPosition(cameraId);
    }
  };

  // Start download with selected format
  const handleStartDownload = (format) => {
    // In a real app, this would initiate the actual download
    console.log(`Downloading asset ${assetId} in ${format} format`);
    setShowDownloadOptions(false);
    
    // Mock download by opening a new tab (in a real app this would be a download link)
    window.open(`#download-${format}`, '_blank');
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loading text="Loading asset details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <p className="mt-2">
              <Link to="/" className="text-red-700 underline">
                Return to asset library
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">Asset not found</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to asset library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-blue-600">
              Asset Library
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to={`/?category=${asset.category}`} className="hover:text-blue-600">
              {asset.category}
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-900 font-medium">{asset.title}</li>
        </ol>
      </nav>

      {/* Asset title and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{asset.title}</h1>
          <p className="text-gray-500 mt-1">Added on {new Date(asset.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-3">
          <Button variant="secondary" onClick={handleSnapshotClick}>
            Take Snapshot
          </Button>
          
          <Button onClick={handleDownloadClick}>
            Download
          </Button>
        </div>
      </div>

      {/* Main content with 3D viewer */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Viewer container */}
        <div className="relative">
          <ThreeJsRenderer 
            ref={viewerRef} 
            assetId={assetId} 
            renderMode={renderMode} 
          />
          
          {/* Camera controls */}
          <div className="absolute top-4 right-4">
            <CameraControls 
              currentCamera={currentCamera} 
              onCameraChange={handleCameraChange} 
            />
          </div>
          
          {/* Playback controls - only shown if asset has animations */}
          {asset.hasAnimations && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-3 py-1">
              <button 
                onClick={togglePlayback}
                className="text-white p-1 focus:outline-none"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Asset details */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{asset.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/?q=${tag}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Details</h2>
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{asset.category}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Format</dt>
                  <dd className="text-sm text-gray-900">{asset.format}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Creator</dt>
                  <dd className="text-sm text-gray-900">{asset.creator}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Polycount</dt>
                  <dd className="text-sm text-gray-900">{asset.polycount}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">File Size</dt>
                  <dd className="text-sm text-gray-900">{asset.fileSize}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{new Date(asset.updatedAt).toLocaleDateString()}</dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Render Quality</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRenderMode('realtime')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      renderMode === 'realtime'
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700'
                    }`}
                  >
                    Realtime
                  </button>
                  <button
                    onClick={() => setRenderMode('offline')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      renderMode === 'offline'
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700'
                    }`}
                  >
                    High Quality
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download options modal */}
      {showDownloadOptions && (
        <Modal 
          title="Download Options" 
          onClose={() => setShowDownloadOptions(false)}
          size="md"
        >
          <div className="p-6">
            <p className="mb-4 text-gray-600">
              Select the format you want to download this asset in:
            </p>
            
            <div className="space-y-3">
              {asset.availableFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleStartDownload(format.id)}
                  className="w-full p-4 flex items-center justify-between border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium">{format.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({format.size})</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button variant="secondary" onClick={() => setShowDownloadOptions(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      
      {/* Snapshots modal */}
      {showSnapshots && snapshots.length > 0 && (
        <SnapshotControl 
          snapshots={snapshots} 
          onClose={() => setShowSnapshots(false)}
          onDelete={(id) => {
            // In a real app, this would delete the snapshot
            console.log(`Delete snapshot: ${id}`);
            // For the prototype, we'll just close the modal
            setShowSnapshots(false);
          }}
        />
      )}
    </div>
  );
}

export default AssetDetailView;