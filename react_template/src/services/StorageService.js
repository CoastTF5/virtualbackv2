// src/services/StorageService.js
import { v4 as uuidv4 } from 'uuid';
import { getPlaceholderImageUrl } from '../data/mockData';

class StorageService {
  constructor() {
    // In a real app, these would be fetched from a backend database
    // For the prototype, we'll use localStorage to persist data
    this.assets = null;
    this.snapshots = null;
    this.moodboards = null;
    
    // Initialize storage
    this.initStorage();
  }

  // Initialize local storage
  initStorage() {
    try {
      // Load assets
      const savedAssets = localStorage.getItem('virtualBacklot_assets');
      this.assets = savedAssets ? JSON.parse(savedAssets) : this.generateMockAssets();
      
      // Load snapshots
      const savedSnapshots = localStorage.getItem('virtualBacklot_snapshots');
      this.snapshots = savedSnapshots ? JSON.parse(savedSnapshots) : [];
      
      // Load moodboards
      const savedMoodboards = localStorage.getItem('virtualBacklot_moodboards');
      this.moodboards = savedMoodboards ? JSON.parse(savedMoodboards) : [];

      // Save generated assets if they didn't exist
      if (!savedAssets) {
        this.saveToStorage('assets', this.assets);
      }
    } catch (e) {
      console.error('Error initializing storage:', e);
      this.assets = this.generateMockAssets();
      this.snapshots = [];
      this.moodboards = [];
    }
  }

  // Save data to localStorage
  saveToStorage(key, data) {
    try {
      localStorage.setItem(`virtualBacklot_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // Generate mock assets for the prototype
  generateMockAssets() {
    const categories = [
      'environments', 
      'vehicles', 
      'props', 
      'characters', 
      'promos'
    ];
    
    const formats = [
      'Unreal Engine 5',
      'FBX',
      'GLB/GLTF',
      'OBJ',
      'USD'
    ];

    const tags = [
      'outdoor', 'indoor', 'urban', 'rural', 'futuristic', 'vintage',
      'sci-fi', 'modern', 'historical', 'fantasy', 'photorealistic',
      'stylized', 'dystopian', 'utopian', 'nature', 'industrial'
    ];

    const assets = [];

    // Generate environment assets
    const environments = [
      { title: 'Downtown NYC Pack', desc: 'Highly detailed New York City street environment' },
      { title: 'Futuristic City Skyline', desc: 'Cyberpunk-inspired cityscape with neon lights' },
      { title: 'Suburban Neighborhood', desc: 'Typical American suburb with residential houses' },
      { title: 'Historical London Streets', desc: 'Victorian era London streets and buildings' },
      { title: 'Tropical Beach Resort', desc: 'Paradise beach with palm trees and luxury cabins' },
      { title: 'Mountain Wilderness', desc: 'Rugged mountain terrain with forests and rivers' },
      { title: 'Desert Landscape', desc: 'Arid desert environment with rock formations' },
      { title: 'Space Station Interior', desc: 'Sci-fi space station corridors and rooms' },
      { title: 'Nagoya Downtown', desc: 'Detailed urban environment of downtown Nagoya, Japan' }
    ];

    // Generate vehicle assets
    const vehicles = [
      { title: '1960s Classic Cars Collection', desc: 'Vintage automobile pack with multiple variations' },
      { title: 'Modern Supercars Bundle', desc: 'High-performance sports cars with detailed interiors' },
      { title: 'NYC Yellow Cab', desc: 'Highly detailed New York taxi with interior' },
      { title: 'Sci-Fi Hover Vehicles', desc: 'Futuristic flying cars and transporters' },
      { title: 'Vintage Spacecraft', desc: 'Retro-futuristic space rockets and shuttles' },
      { title: 'BMW X7 M60i', desc: 'Luxury SAV with powerful engine and premium features' },
      { title: 'Old Rusty Car', desc: 'Vintage abandoned vehicle with weathered details' }
    ];

    // Generate props assets
    const props = [
      { title: 'Sci-Fi Laboratory Props', desc: 'Futuristic lab equipment and machinery' },
      { title: 'Office Furniture Pack', desc: 'Modern office desks, chairs and accessories' },
      { title: 'Medieval Weapons Collection', desc: 'Historical armory with swords and shields' },
      { title: 'Kitchen Appliances Bundle', desc: 'Domestic kitchen items and appliances' },
      { title: 'Cartoonic Pirates Ship', desc: 'Stylized pirate ship model with cartoon-like features' }
    ];

    // Generate character assets
    const characters = [
      { title: 'Cyberpunk Character Pack', desc: 'Futuristic characters with customizable features' },
      { title: 'Period Drama Extras', desc: 'Historical background characters in period costume' },
      { title: 'Crowd Simulation Pack', desc: 'Diverse characters for populating scenes' }
    ];

    // Generate promo assets
    const promos = [
      { title: 'Summer Blockbuster Kit', desc: 'Promotional elements for action movie marketing' },
      { title: 'TV Series Launch Pack', desc: 'Elements for television show promotion' },
      { title: 'Streaming Release Bundle', desc: 'Digital marketing assets for online releases' }
    ];

    // Add all environments
    environments.forEach((env, i) => {
      const id = `environment-${i+1}`;
      assets.push(this.createAsset(
        id, 
        env.title, 
        env.desc, 
        'environments',
        getPlaceholderImageUrl('environments', id),
        this.getRandomTags(tags, 3, 5),
        this.getRandomFormat(formats),
        i % 3 === 0 // some have animations
      ));
    });

    // Add all vehicles
    vehicles.forEach((vehicle, i) => {
      const id = `vehicle-${i+1}`;
      assets.push(this.createAsset(
        id, 
        vehicle.title, 
        vehicle.desc, 
        'vehicles',
        getPlaceholderImageUrl('vehicles', id),
        this.getRandomTags(tags, 2, 4),
        this.getRandomFormat(formats),
        i % 2 === 0 // some have animations
      ));
    });
    
    // Add BMW i8 Liberty Walk special asset with actual 3D model path
    assets.push(this.createAsset(
      'vehicle-bmw-i8', 
      'BMW i8 Liberty Walk', 
      'Photorealistic BMW i8 with Liberty Walk custom body kit', 
      'vehicles',
      getPlaceholderImageUrl('vehicles', 'bmw-i8'),
      ['luxury', 'sports', 'modern', 'photorealistic', 'custom'],
      'GLB/GLTF',
      true,
      '/assets/models/bmw_i8_liberty_walk.glb' // actual model path
    ));
    
    // Add BMW X7 M60i special asset
    assets.push(this.createAsset(
      'vehicle-bmw-x7', 
      'BMW X7 M60i', 
      'Luxury SAV with powerful engine and premium features', 
      'vehicles',
      getPlaceholderImageUrl('vehicles', 'bmw-x7'),
      ['luxury', 'suv', 'modern', 'premium'],
      'GLB/GLTF',
      true,
      '/assets/models/bmw_x7_m60i.glb' // actual model path
    ));
    
    // Add Old Rusty Car special asset
    assets.push(this.createAsset(
      'vehicle-rusty-car', 
      'Old Rusty Car', 
      'Vintage abandoned vehicle with weathered details', 
      'vehicles',
      getPlaceholderImageUrl('vehicles', 'rusty-car'),
      ['vintage', 'weathered', 'abandoned', 'rustic'],
      'GLB/GLTF',
      false,
      '/assets/models/old_rusty_car.glb' // actual model path
    ));
    
    // Add Nagoya Downtown environment
    assets.push(this.createAsset(
      'environment-nagoya', 
      'Nagoya Downtown', 
      'Detailed urban environment of downtown Nagoya, Japan', 
      'environments',
      getPlaceholderImageUrl('environments', 'nagoya'),
      ['urban', 'japan', 'city', 'modern', 'photorealistic'],
      'GLB/GLTF',
      false,
      '/assets/models/nagoya_downtown.glb' // actual model path
    ));
    
    // Add Pirates Ship prop
    assets.push(this.createAsset(
      'prop-pirates-ship', 
      'Cartoonic Pirates Ship', 
      'Stylized pirate ship model with cartoon-like features', 
      'props',
      getPlaceholderImageUrl('props', 'pirates-ship'),
      ['pirate', 'ship', 'stylized', 'cartoon', 'fantasy'],
      'GLB/GLTF',
      true,
      '/assets/models/catroonic_pirates_ship.glb' // actual model path
    ));

    // Add all props
    props.forEach((prop, i) => {
      const id = `prop-${i+1}`;
      assets.push(this.createAsset(
        id, 
        prop.title, 
        prop.desc, 
        'props',
        getPlaceholderImageUrl('props', id),
        this.getRandomTags(tags, 2, 4),
        this.getRandomFormat(formats),
        false // props don't have animations
      ));
    });

    // Add all characters
    characters.forEach((char, i) => {
      const id = `character-${i+1}`;
      assets.push(this.createAsset(
        id, 
        char.title, 
        char.desc, 
        'characters',
        getPlaceholderImageUrl('characters', id),
        this.getRandomTags(tags, 2, 4),
        this.getRandomFormat(formats),
        true // characters have animations
      ));
    });

    // Add all promos
    promos.forEach((promo, i) => {
      const id = `promo-${i+1}`;
      assets.push(this.createAsset(
        id, 
        promo.title, 
        promo.desc, 
        'promos',
        getPlaceholderImageUrl('promos', id),
        this.getRandomTags(tags, 2, 4),
        this.getRandomFormat(formats),
        false // promos don't have animations
      ));
    });

    return assets;
  }

  // Helper to create an asset object
  createAsset(id, title, description, category, thumbnail, tags, format, hasAnimations = false, modelPath = null) {
    const creators = ['Paramount Studios', 'Digital Arts Team', 'VFX Department', 'External Vendor'];
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 6));
    
    return {
      id,
      title,
      description,
      category,
      thumbnail,
      tags,
      format,
      hasAnimations,
      modelPath, // Actual 3D model path if available
      creator: creators[Math.floor(Math.random() * creators.length)],
      createdAt: pastDate.toISOString(),
      updatedAt: now.toISOString(),
      polycount: `${Math.floor(Math.random() * 90 + 10)}K`,
      fileSize: `${Math.floor(Math.random() * 900 + 100)} MB`,
      availableFormats: [
        { id: 'ue5', name: 'Unreal Engine 5', size: '245 MB' },
        { id: 'fbx', name: 'FBX', size: '120 MB' },
        { id: 'gltf', name: 'glTF', size: '85 MB' },
      ]
    };
  }

  // Helper to get random tags
  getRandomTags(allTags, min, max) {
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const shuffled = [...allTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Helper to get random format
  getRandomFormat(formats) {
    return formats[Math.floor(Math.random() * formats.length)];
  }

  // Get assets with optional filters
  async getAssets(options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.assets];
        
        // Apply query filter
        if (options.query) {
          const query = options.query.toLowerCase();
          results = results.filter(asset => 
            asset.title.toLowerCase().includes(query) || 
            asset.description.toLowerCase().includes(query) ||
            asset.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        // Apply category filter
        if (options.category) {
          results = results.filter(asset => 
            asset.category === options.category
          );
        }
        
        // Apply format filter
        if (options.format) {
          results = results.filter(asset => 
            asset.format === options.format
          );
        }
        
        // Apply date range filter
        if (options.dateRange) {
          // Implementation simplified for prototype
          if (options.dateRange === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            results = results.filter(asset => 
              new Date(asset.createdAt) >= oneWeekAgo
            );
          } else if (options.dateRange === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            results = results.filter(asset => 
              new Date(asset.createdAt) >= oneMonthAgo
            );
          }
          // Add more date filters as needed
        }
        
        // Apply sorting
        if (options.sortBy) {
          switch (options.sortBy) {
            case 'newest':
              results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'popular':
              // In a real app, this would sort by popularity metrics
              // For the prototype, we'll use a pseudo-random "popularity"
              results.sort(() => 0.5 - Math.random());
              break;
            case 'downloads':
              // For the prototype, just another random sort
              results.sort(() => 0.5 - Math.random());
              break;
          }
        }
        
        // Apply pagination
        if (options.limit) {
          results = results.slice(0, options.limit);
        }
        
        resolve(results);
      }, 600);
    });
  }

  // Get a specific asset by ID
  async getAsset(assetId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const asset = this.assets.find(a => a.id === assetId);
        
        if (asset) {
          resolve(asset);
        } else {
          reject(new Error(`Asset with ID ${assetId} not found`));
        }
      }, 300);
    });
  }

  // Get preview data for an asset
  async getAssetPreviewData(assetId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const asset = this.assets.find(a => a.id === assetId);
        
        if (!asset) {
          reject(new Error(`Asset with ID ${assetId} not found`));
          return;
        }
        
        // Special case for BMW i8 model with actual path
        if (assetId === 'vehicle-bmw-i8') {
          resolve({
            modelUrl: asset.modelPath || '/assets/models/bmw_i8_liberty_walk.glb',
            previewImages: [
              asset.thumbnail,
              asset.thumbnail, // Duplicate as placeholder
              asset.thumbnail  // Duplicate as placeholder
            ],
            textures: [
              { type: 'diffuse', url: `/textures/${assetId}_diffuse.jpg` },
              { type: 'normal', url: `/textures/${assetId}_normal.jpg` },
              { type: 'roughness', url: `/textures/${assetId}_roughness.jpg` }
            ],
            isRealModel: true
          });
          return;
        }
        
        // For other assets, return mock data
        resolve({
          modelUrl: `/models/${assetId}.glb`, // Mock URL
          previewImages: [
            asset.thumbnail,
            asset.thumbnail, // Duplicate as placeholder
            asset.thumbnail  // Duplicate as placeholder
          ],
          textures: [
            { type: 'diffuse', url: `/textures/${assetId}_diffuse.jpg` },
            { type: 'normal', url: `/textures/${assetId}_normal.jpg` },
            { type: 'roughness', url: `/textures/${assetId}_roughness.jpg` }
          ]
        });
      }, 500);
    });
  }

  // Visual search using AI (mock implementation)
  async visualSearch(description) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would use AI to find matching assets
        // For the prototype, just return some random assets
        const shuffledAssets = [...this.assets].sort(() => 0.5 - Math.random());
        resolve(shuffledAssets.slice(0, 6));
      }, 1500); // Longer delay to simulate AI processing
    });
  }

  // Save a snapshot
  async saveSnapshot(snapshotData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSnapshot = {
          id: snapshotData.id || `snapshot-${uuidv4()}`,
          assetId: snapshotData.assetId,
          assetTitle: snapshotData.assetTitle,
          imageUrl: snapshotData.imageUrl,
          title: snapshotData.title || `Snapshot of ${snapshotData.assetTitle}`,
          description: snapshotData.description || '',
          cameraPosition: snapshotData.cameraPosition || { x: 0, y: 0, z: 0 },
          createdAt: new Date().toISOString(),
          createdBy: snapshotData.createdBy || 'current-user'
        };
        
        this.snapshots.push(newSnapshot);
        this.saveToStorage('snapshots', this.snapshots);
        
        resolve(newSnapshot);
      }, 300);
    });
  }

  // Delete a snapshot
  async deleteSnapshot(snapshotId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.snapshots.findIndex(s => s.id === snapshotId);
        
        if (index !== -1) {
          this.snapshots.splice(index, 1);
          this.saveToStorage('snapshots', this.snapshots);
          resolve(true);
        } else {
          reject(new Error(`Snapshot with ID ${snapshotId} not found`));
        }
      }, 300);
    });
  }

  // Get snapshots for a user
  async getUserSnapshots(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would filter by user ID
        // For the prototype, just return all snapshots
        resolve([...this.snapshots]);
      }, 300);
    });
  }

  // Save a mood board
  async saveMoodBoard(moodboardData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if this is an update to an existing mood board
        const existingIndex = this.moodboards.findIndex(mb => mb.id === moodboardData.id);
        
        if (existingIndex !== -1) {
          // Update existing mood board
          this.moodboards[existingIndex] = {
            ...this.moodboards[existingIndex],
            ...moodboardData,
            updatedAt: new Date().toISOString()
          };
        } else {
          // Create new mood board
          this.moodboards.push({
            ...moodboardData,
            id: moodboardData.id || `moodboard-${uuidv4()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        this.saveToStorage('moodboards', this.moodboards);
        
        resolve(existingIndex !== -1 ? this.moodboards[existingIndex] : this.moodboards[this.moodboards.length - 1]);
      }, 500);
    });
  }

  // Delete a mood board
  async deleteMoodBoard(moodboardId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.moodboards.findIndex(mb => mb.id === moodboardId);
        
        if (index !== -1) {
          this.moodboards.splice(index, 1);
          this.saveToStorage('moodboards', this.moodboards);
          resolve(true);
        } else {
          reject(new Error(`Moodboard with ID ${moodboardId} not found`));
        }
      }, 300);
    });
  }

  // Get a specific mood board
  async getMoodBoard(moodboardId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const moodboard = this.moodboards.find(mb => mb.id === moodboardId);
        
        if (moodboard) {
          resolve(moodboard);
        } else {
          reject(new Error(`Moodboard with ID ${moodboardId} not found`));
        }
      }, 300);
    });
  }

  // Get all mood boards for a user
  async getUserMoodBoards(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would filter by user ID
        // For the prototype, just return all mood boards
        resolve([...this.moodboards]);
      }, 400);
    });
  }
}

// Create singleton instance
const storageService = new StorageService();

export { storageService as StorageService };