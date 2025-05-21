// src/services/AnalyticsService.js
// Analytics service for handling metrics and data analysis

class AnalyticsService {
  // Get global analytics across all assets
  async getGlobalAnalytics(dateRange = { start: null, end: null }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would make an API call with the date range
        resolve({
          totalViews: 2340,
          viewsChange: 12.5,
          totalDownloads: 376,
          downloadsChange: 8.2,
          totalFavorites: 485,
          favoritesChange: 15.3,
          viewsOverTime: [
            { date: '2024-01-01', views: 120 },
            { date: '2024-01-15', views: 145 },
            { date: '2024-02-01', views: 190 },
            { date: '2024-02-15', views: 210 },
            { date: '2024-03-01', views: 250 },
            { date: '2024-03-15', views: 275 },
            { date: '2024-04-01', views: 310 },
            { date: '2024-04-15', views: 340 },
            { date: '2024-05-01', views: 380 },
            { date: '2024-05-15', views: 420 }
          ],
          downloadsOverTime: [
            { date: '2024-01-01', downloads: 20 },
            { date: '2024-01-15', downloads: 25 },
            { date: '2024-02-01', downloads: 35 },
            { date: '2024-02-15', downloads: 40 },
            { date: '2024-03-01', downloads: 55 },
            { date: '2024-03-15', downloads: 60 },
            { date: '2024-04-01', downloads: 70 },
            { date: '2024-04-15', downloads: 85 },
            { date: '2024-05-01', downloads: 95 },
            { date: '2024-05-15', downloads: 110 }
          ],
          categoryDistribution: [
            { category: 'Environments', value: 45 },
            { category: 'Vehicles', value: 15 },
            { category: 'Props', value: 20 },
            { category: 'Characters', value: 10 },
            { category: 'Promos', value: 10 }
          ],
          // Available assets for filtering
          availableAssets: [
            { id: 'asset-001', title: 'Downtown NYC Pack' },
            { id: 'asset-002', title: '1960s Classic Cars Collection' },
            { id: 'asset-003', title: 'Futuristic City Skyline' },
            { id: 'asset-004', title: 'Suburban Neighborhood' },
            { id: 'asset-005', title: 'Sci-Fi Laboratory Props' }
          ]
        });
      }, 800);
    });
  }

  // Get analytics for a specific asset pack
  async getPackAnalytics(assetId, dateRange = { start: null, end: null }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!assetId) {
          reject(new Error('Asset ID is required'));
          return;
        }

        // In a real app, this would make an API call with the asset ID and date range
        resolve({
          assetId,
          totalViews: 342,
          viewsChange: 8.7,
          totalDownloads: 56,
          downloadsChange: 12.0,
          totalFavorites: 78,
          favoritesChange: 5.4,
          viewsOverTime: [
            { date: '2024-01-01', views: 15 },
            { date: '2024-01-15', views: 22 },
            { date: '2024-02-01', views: 31 },
            { date: '2024-02-15', views: 40 },
            { date: '2024-03-01', views: 47 },
            { date: '2024-03-15', views: 55 },
            { date: '2024-04-01', views: 64 },
            { date: '2024-04-15', views: 75 },
            { date: '2024-05-01', views: 83 },
            { date: '2024-05-15', views: 95 }
          ],
          downloadsOverTime: [
            { date: '2024-01-01', downloads: 2 },
            { date: '2024-01-15', downloads: 4 },
            { date: '2024-02-01', downloads: 7 },
            { date: '2024-02-15', downloads: 9 },
            { date: '2024-03-01', downloads: 12 },
            { date: '2024-03-15', downloads: 16 },
            { date: '2024-04-01', downloads: 20 },
            { date: '2024-04-15', downloads: 24 },
            { date: '2024-05-01', downloads: 27 },
            { date: '2024-05-15', downloads: 32 }
          ],
          userBreakdown: {
            roles: [
              { role: 'Marketing', percentage: 35 },
              { role: 'Directors', percentage: 25 },
              { role: 'Showrunners', percentage: 20 },
              { role: '3D Artists', percentage: 15 },
              { role: 'Others', percentage: 5 }
            ]
          },
          // Available assets for filtering
          availableAssets: [
            { id: 'asset-001', title: 'Downtown NYC Pack' },
            { id: 'asset-002', title: '1960s Classic Cars Collection' },
            { id: 'asset-003', title: 'Futuristic City Skyline' },
            { id: 'asset-004', title: 'Suburban Neighborhood' },
            { id: 'asset-005', title: 'Sci-Fi Laboratory Props' }
          ]
        });
      }, 800);
    });
  }

  // Get most popular assets
  async getPopularAssets(dateRange = { start: null, end: null }, limit = 10) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would make an API call with the date range and limit
        resolve([
          {
            id: 'asset-001',
            title: 'Downtown NYC Pack',
            category: 'Environments',
            thumbnail: '/assets/images/asset-thumbnails/nyc_downtown.jpg',
            views: 342,
            downloads: 56,
            favorites: 78
          },
          {
            id: 'asset-008',
            title: 'Cyberpunk Character Pack',
            category: 'Characters',
            thumbnail: '/assets/images/asset-thumbnails/cyberpunk_chars.jpg',
            views: 267,
            downloads: 41,
            favorites: 59
          },
          {
            id: 'asset-003',
            title: 'Futuristic City Skyline',
            category: 'Environments',
            thumbnail: '/assets/images/asset-thumbnails/future_city.jpg',
            views: 287,
            downloads: 38,
            favorites: 65
          },
          {
            id: 'asset-006',
            title: 'Historical London Streets',
            category: 'Environments',
            thumbnail: '/assets/images/asset-thumbnails/london_victorian.jpg',
            views: 231,
            downloads: 34,
            favorites: 47
          },
          {
            id: 'asset-009',
            title: 'Summer Beach Environment',
            category: 'Environments',
            thumbnail: '/assets/images/asset-thumbnails/tropical_beach.jpg',
            views: 195,
            downloads: 31,
            favorites: 43
          }
        ]);
      }, 800);
    });
  }

  // Log an analytics event
  logEvent(eventType, data) {
    // In a real app, this would send event data to the analytics service
    console.log(`Analytics event: ${eventType}`, data);
    return Promise.resolve();
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export { analyticsService as AnalyticsService };