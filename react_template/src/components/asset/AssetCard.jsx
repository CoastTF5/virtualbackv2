import React from 'react';
import { Link } from 'react-router-dom';

function AssetCard({ asset }) {
  return (
    <Link 
      to={`/assets/${asset.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img 
          src={asset.thumbnail} 
          alt={asset.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {asset.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {asset.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {asset.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AssetCard;