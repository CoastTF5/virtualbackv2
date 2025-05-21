import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 text-center text-sm fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} Virtual Backlot | Paramount Global
        </p>
        <p className="text-xs mt-1">
          Prototype Version 0.1
        </p>
      </div>
    </footer>
  );
}

export default Footer;