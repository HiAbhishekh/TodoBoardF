import React from 'react';
import { Layout, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaTrashAlt } from 'react-icons/fa';

const Sidebar = ({
  boards,
  isSidebarOpen, 
  activeBoard, 
  setIsSidebarOpen, 
  setIsAddingBoard, 
  handleBoardClick, 
  deleteBoard 
}) => {
  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'} text-lg`}>
          <Layout className="inline-block mr-2" size={20} /> Kanban Board
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isSidebarOpen ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
        </button>
      </div>
      
      <div className="p-4">
        <button
          onClick={() => setIsAddingBoard(true)}
          className="flex items-center gap-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          {isSidebarOpen && 'New Board'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {boards
          .slice()
          .sort((a, b) => (a.title === 'MyBoard' ? -1 : b.title === 'MyBoard' ? 1 : 0))
          .map((board) => (
            <button
              key={board.id}
              onClick={() => handleBoardClick(board.id)}
              className={`w-full text-left p-3 font-bold flex items-center gap-2 hover:bg-gray-100 ${
                activeBoard === board.id ? 'bg-blue-50 text-blue-600' : ''
              } ${board.title === 'MyBoard' ? 'font-bold' : ''}`}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  {isSidebarOpen && (
                    <span className="truncate">{board.title}</span>
                  )}
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBoard(board.id);
                  }}
                >
                  <FaTrashAlt size={13} />
                </button>
              </div>
            </button>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;