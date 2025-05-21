// Mock data for the Virtual Backlot prototype
// This file provides static data for demonstration purposes

// Asset categories
export const assetCategories = [
  'environments',
  'vehicles',
  'props',
  'characters',
  'promos'
];

// Asset formats
export const assetFormats = [
  'Unreal Engine 5',
  'FBX',
  'GLB/GLTF',
  'OBJ',
  'USD'
];

// User personas for demonstration
export const userPersonas = [
  {
    id: '1',
    name: 'Marketing Executive',
    email: 'marketing@paramount.com',
    role: 'marketing',
    description: 'Uses Virtual Backlot to find assets for marketing materials and promotional content.',
    permissions: ['view', 'snapshot', 'export'],
    avatar: 'M'
  },
  {
    id: '2',
    name: 'Showrunner',
    email: 'showrunner@paramount.com',
    role: 'showrunner',
    description: 'Creates mood boards to communicate visual ideas to production team.',
    permissions: ['view', 'snapshot', 'moodboard', 'share', 'analytics'],
    avatar: 'S'
  },
  {
    id: '3',
    name: 'Director of Photography',
    email: 'dp@paramount.com',
    role: 'dp',
    description: 'Uses Virtual Backlot to scout virtual locations and plan shots.',
    permissions: ['view', 'snapshot', 'camera_control', 'analytics'],
    avatar: 'DP'
  },
  {
    id: '4',
    name: '3D Artist',
    email: '3dartist@paramount.com',
    role: '3d_artist',
    description: 'Creates and uploads 3D assets to the Virtual Backlot.',
    permissions: ['view', 'snapshot', 'download'],
    avatar: '3D'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@paramount.com',
    role: 'admin',
    description: 'Manages the Virtual Backlot platform, users, and content.',
    permissions: ['view', 'snapshot', 'moodboard', 'share', 'download', 'analytics', 'admin'],
    avatar: 'A'
  }
];

// Sample helper functions for filtering/searching
export const filterAssetsByCategory = (assets, category) => {
  if (!category || category === 'all') return assets;
  return assets.filter(asset => asset.category === category);
};

export const searchAssets = (assets, query) => {
  if (!query) return assets;
  
  const lowerQuery = query.toLowerCase();
  return assets.filter(asset => 
    asset.title.toLowerCase().includes(lowerQuery) ||
    asset.description.toLowerCase().includes(lowerQuery) ||
    asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Sample camera presets for the 3D viewer
export const cameraPresets = {
  'default': {
    position: { x: 0, y: 5, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    fov: 45
  },
  'front': {
    position: { x: 0, y: 2, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    fov: 45
  },
  'side': {
    position: { x: 10, y: 2, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 45
  },
  'top': {
    position: { x: 0, y: 10, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 60
  },
  'closeup': {
    position: { x: 2, y: 2, z: 3 },
    target: { x: 0, y: 0, z: 0 },
    fov: 35
  }
};

// Helper function to generate placeholder URLs for thumbnails
export const getPlaceholderImageUrl = (category, id) => {
  // Special cases for our specific models
  if (id === 'vehicle-bmw-i8' || id === 'bmw-i8') {
    return `https://source.unsplash.com/300x200/?bmw,i8,supercar`;
  }
  
  if (id === 'vehicle-bmw-x7' || id === 'bmw-x7') {
    return `https://source.unsplash.com/300x200/?bmw,x7,luxury,suv`;
  }
  
  if (id === 'vehicle-rusty-car' || id === 'rusty-car') {
    return `https://source.unsplash.com/300x200/?rusty,abandoned,car,vintage`;
  }
  
  if (id === 'environment-nagoya' || id === 'nagoya') {
    return `https://source.unsplash.com/300x200/?nagoya,japan,downtown,city`;
  }
  
  if (id === 'environment-nyc-manhattan' || id === 'nyc-manhattan') {
    return `https://source.unsplash.com/300x200/?newyork,manhattan,skyline,city`;
  }
  
  if (id === 'prop-pirates-ship' || id === 'pirates-ship') {
    return `https://source.unsplash.com/300x200/?pirate,ship,cartoon`;
  }
  
  const categories = {
    'environments': 'city',
    'vehicles': 'car',
    'props': 'object',
    'characters': 'people',
    'promos': 'marketing'
  };
  
  const seed = categories[category] || 'abstract';
  return `https://source.unsplash.com/300x200/?${seed},${id}`;
};