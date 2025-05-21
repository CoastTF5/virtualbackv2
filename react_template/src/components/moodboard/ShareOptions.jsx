import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

function ShareOptions({ shareUrl, boardTitle, onClose }) {
  const [copied, setCopied] = useState(false);
  const [shareOption, setShareOption] = useState('link');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setSendComplete(true);
    }, 1500);
  };
  
  return (
    <Modal title="Share Mood Board" onClose={onClose}>
      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShareOption('link')}
            className={`px-4 py-2 rounded-md flex-1 text-center ${
              shareOption === 'link'
                ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Share Link
          </button>
          <button
            onClick={() => setShareOption('email')}
            className={`px-4 py-2 rounded-md flex-1 text-center ${
              shareOption === 'email'
                ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Email
          </button>
        </div>
        
        {shareOption === 'link' && (
          <div>
            <div className="mb-6">
              <label htmlFor="share-link" className="block text-sm font-medium text-gray-700 mb-1">
                Shareable Link
              </label>
              <div className="flex">
                <input
                  id="share-link"
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-l-md"
                />
                <Button
                  onClick={handleCopyLink}
                  className="rounded-l-none"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Share to:</h4>
              <div className="flex space-x-3">
                <button className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                  <span className="text-xs mt-1">Facebook</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.02 10.02 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-xs mt-1">Twitter</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-xs mt-1">LinkedIn</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                  </svg>
                  <span className="text-xs mt-1">Email</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {shareOption === 'email' && (
          <div>
            {!sendComplete ? (
              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label htmlFor="email-recipient" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    id="email-recipient"
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="email-subject"
                    type="text"
                    value={`Check out this mood board: ${boardTitle}`}
                    readOnly
                    className="bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="email-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Add a personal message..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSending || !emailRecipient}
                  >
                    {isSending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Email Sent!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your mood board has been shared with {emailRecipient}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default ShareOptions;