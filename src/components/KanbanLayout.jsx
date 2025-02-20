import React from 'react';
import { Layout } from 'lucide-react';
 // Adjust the path if needed

const KanbanLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-[#357575] text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* <Layout className="w-8 h-8" /> */}
          <img src="/teamob.png" alt="TeamOB" className="w-8 h-8" />
          <span className="text-2xl font-bold">TeamOB</span>
        </div>
        <div className="flex items-center gap-4">
      
        
          <span className="text-lg">Welcome</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white px-4 py-2 flex justify-center items-center text-sm">
        <span>Copyright © 2025 </span>
        <a href="https://www.teamob.co.in" className="text-white hover:underline mx-1">
          www.teamob.co.in
        </a>
        <span>| All Rights Reserved.</span>
      </footer>
    </div>
  );
};

export default KanbanLayout;