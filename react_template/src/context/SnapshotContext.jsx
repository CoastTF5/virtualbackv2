// src/context/SnapshotContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { useAuth } from './AuthContext';

// Create context
const SnapshotContext = createContext();

export const SnapshotProvider = ({ children }) => {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's snapshots when user changes
  useEffect(() => {
    if (user) {
      fetchSnapshots();
    } else {
      setSnapshots([]);
    }
  }, [user]);

  // Fetch all snapshots for the current user
  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      if (!user) {
        setSnapshots([]);
        return [];
      }
      
      const userSnapshots = await StorageService.getUserSnapshots(user.id);
      setSnapshots(userSnapshots);
      return userSnapshots;
    } catch (err) {
      console.error('Error fetching snapshots:', err);
      setError('Failed to load snapshots');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Save a new snapshot
  const saveSnapshot = async (snapshotData) => {
    try {
      setLoading(true);
      const newSnapshot = await StorageService.saveSnapshot(snapshotData);
      setSnapshots(prev => [newSnapshot, ...prev]);
      return newSnapshot;
    } catch (err) {
      console.error('Error saving snapshot:', err);
      setError('Failed to save snapshot');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a snapshot
  const deleteSnapshot = async (snapshotId) => {
    try {
      setLoading(true);
      await StorageService.deleteSnapshot(snapshotId);
      setSnapshots(prev => prev.filter(snap => snap.id !== snapshotId));
      return true;
    } catch (err) {
      console.error('Error deleting snapshot:', err);
      setError('Failed to delete snapshot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Find snapshot by ID
  const getSnapshotById = (snapshotId) => {
    return snapshots.find(snap => snap.id === snapshotId) || null;
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <SnapshotContext.Provider
      value={{
        snapshots,
        loading,
        error,
        fetchSnapshots,
        saveSnapshot,
        deleteSnapshot,
        getSnapshotById,
        clearError
      }}
    >
      {children}
    </SnapshotContext.Provider>
  );
};

// Custom hook to use the snapshot context
export const useSnapshot = () => {
  const context = useContext(SnapshotContext);
  if (!context) {
    throw new Error('useSnapshot must be used within a SnapshotProvider');
  }
  return context;
};