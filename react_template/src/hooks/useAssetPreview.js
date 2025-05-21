import { useState, useEffect, useRef } from 'react';
import { StorageService } from '../services/StorageService';
import { useAuth } from '../context/AuthContext';

export function useAssetPreview(assetId) {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const viewerRef = useRef(null);
  const [currentCamera, setCurrentCamera] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadAsset = async () => {
      try {
        setLoading(true);
        setError(null);

        const assetData = await StorageService.getAsset(assetId);
        setAsset(assetData);

        const preview = await StorageService.getAssetPreviewData(assetId);
        setPreviewData(preview);
      } catch (err) {
        console.error('Error loading asset preview:', err);
        setError(err.message || 'Failed to load asset preview');
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      loadAsset();
    }

    return () => {
      // Clean up any resources if needed
    };
  }, [assetId]);

  const takeSnapshot = () => {
    if (!viewerRef.current || !asset) return null;

    try {
      // Get the image data from the Three.js renderer
      const imageUrl = viewerRef.current.captureViewport();
      
      // Generate a snapshot object
      const snapshot = {
        assetId,
        assetTitle: asset.title,
        imageUrl,
        title: `Snapshot of ${asset.title}`,
        cameraPosition: viewerRef.current.getCurrentCameraPosition()
      };

      // If user is logged in, save the snapshot
      if (user) {
        StorageService.saveSnapshot(snapshot)
          .then(savedSnapshot => {
            setSnapshots(prev => [savedSnapshot, ...prev]);
          })
          .catch(err => {
            console.error('Failed to save snapshot:', err);
          });
      } else {
        // For non-logged in users, just add to local state without saving
        setSnapshots(prev => [{
          id: `temp-${Date.now()}`,
          ...snapshot,
          createdAt: new Date().toISOString()
        }, ...prev]);
      }

      return snapshot;
    } catch (err) {
      console.error('Error taking snapshot:', err);
      return null;
    }
  };

  const togglePlayback = () => {
    if (!viewerRef.current) return;
    
    if (isPlaying) {
      viewerRef.current.pauseAnimation();
    } else {
      viewerRef.current.playAnimation();
    }
    
    setIsPlaying(!isPlaying);
  };

  return {
    asset,
    loading,
    error,
    previewData,
    viewerRef,
    currentCamera,
    setCurrentCamera,
    isPlaying,
    togglePlayback,
    takeSnapshot,
    snapshots
  };
}