
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-8 text-center bg-white border-t">
      <div className="container px-4 mx-auto">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Campus Echo Board. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          A modern notice board system for educational institutions
        </p>
      </div>
    </footer>
  );
};

export default Footer;
