import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { useAssetContext } from '../../context/AssetContext';

function AIWandSearch({ onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState([]);
  const [examples] = useState([
    "Urban street with neon signs and futuristic buildings",
    "Mid-century modern home interior with natural lighting",
    "Rustic western town with wooden buildings and desert landscape",
    "Hospital operating room with medical equipment",
    "Vintage 1950s diner with classic booths and checkered floor"
  ]);
  const promptRef = useRef(null);
  const { aiWandSearch } = useAssetContext();
  const navigate = useNavigate();

  // Focus the input when the component mounts
  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const searchResults = await aiWandSearch(prompt);
      setResults(searchResults);
    } catch (err) {
      console.error('AI Wand search failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const handleAssetClick = (asset) => {
    navigate(`/assets/${asset.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4V2" />
              <path d="M15 16v-2" />
              <path d="M8 9h2" />
              <path d="M20 9h2" />
              <path d="M17.8 11.8L19 13" />
              <path d="M15 9h0" />
              <path d="M17.8 6.2L19 5" />
              <path d="M3 21l9-9" />
              <path d="M12.2 6.2L11 5" />
            </svg>
            AI Wand Search
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-2">
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">
                Describe the type of asset you're looking for
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="ai-prompt"
                  ref={promptRef}
                  value={prompt}
                  onChange={handleInputChange}
                  placeholder="E.g., Urban street with neon signs at night..."
                  className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !prompt.trim()}>
                {isSubmitting ? 'Searching...' : 'Search with AI'}
              </Button>
            </div>
          </form>

          {!results.length && !isSubmitting && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Try an example:</h3>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-[50vh]">
            {isSubmitting ? (
              <div className="py-10 text-center">
                <Loading text="Our AI wand is searching for matching assets..." />
                <p className="mt-4 text-sm text-gray-500">This might take a few moments...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((asset) => (
                    <div 
                      key={asset.id}
                      onClick={() => handleAssetClick(asset)}
                      className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{asset.title}</h4>
                        <p className="text-xs text-gray-500">{asset.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AIWandSearch;