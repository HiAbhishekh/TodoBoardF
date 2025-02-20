import React from 'react';
import { Layout, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { FaTrashAlt } from 'react-icons/fa';

const KanbanSidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isAddingBoard,
  setIsAddingBoard,
  kanbanBoards, 
  activeBoard,
  setActiveBoard,
  deleteBoard 
}) => {
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  // Handle window resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close sidebar on mobile when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isSidebarOpen && !e.target.closest('.sidebar')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  const handleBoardClick = (boardId) => {
    setActiveBoard(boardId);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar fixed md:relative z-30 h-full ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r transition-all duration-300 flex flex-col ${
          isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'} text-lg`}>
            <Layout className="inline-block mr-2" size={20} /> Kanban Board
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
          </button>
        </div>

        {/* New Board Button */}
        <div className="p-4">
          <button
            onClick={() => setIsAddingBoard(true)}
            className="flex items-center gap-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle size={20} />
            {isSidebarOpen && 'New Board'}
          </button>
        </div>

        {/* Board Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {kanbanBoards.map((board) => (
            <button
              key={board.id}
              onClick={() => handleBoardClick(board.id)}
              className={`w-full text-left p-3 font-bold flex items-center gap-2 hover:bg-gray-100 ${
                activeBoard === board.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="flex w-full justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layout size={16} />
                  {isSidebarOpen && (
                    <span className="truncate">{board.title}</span>
                  )}
                </div>
                {isSidebarOpen && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board.id);
                    }}
                  >
                    <FaTrashAlt size={13} />
                  </button>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile toggle button */}
{isMobile && !isSidebarOpen && (
  <button
    onClick={() => setIsSidebarOpen(true)}
    className="fixed z-20 left-4 top-16 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
    aria-label="Open sidebar"
  >
    <ChevronRight size={25} />
  </button>
)}

    </>
  );
};

export default KanbanSidebar;