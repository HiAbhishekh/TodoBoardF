// import React, { useState, useEffect } from 'react';
// import { PlusCircle, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from 'axios';

// const Sidebar = ({ 
//   activeBoard, 
//   setActiveBoard, 
//   isSidebarOpen, 
//   setIsSidebarOpen 
// }) => {
//   const [boards, setBoards] = useState([]);
//   const [isAddingBoard, setIsAddingBoard] = useState(false);
//   const [newBoardTitle, setNewBoardTitle] = useState('');

//   // Fetch boards from the backend
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/boards')
//       .then((response) => {
//         setBoards(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching boards:', error);
//       });
//   }, []);

//   // Create a new board
//   const addNewBoard = () => {
//     if (!newBoardTitle.trim()) return;

//     const newBoard = {
//       title: newBoardTitle,
//       cards: [] // Assuming cards are empty initially
//     };

//     axios.post('http://localhost:5000/api/boards', newBoard)
//       .then((response) => {
//         setBoards(prev => [...prev, response.data]);
//         setActiveBoard(response.data.id); // Set the active board after creation
//         setNewBoardTitle('');
//         setIsAddingBoard(false);
//       })
//       .catch((error) => {
//         console.error('Error creating board:', error);
//       });
//   };

//   return (
//     <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300 flex flex-col`}>
//       <div className="p-4 border-b flex justify-between items-center">
//         <h1 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>
//           <Layout className="inline-block mr-2" size={20} /> Kanban
//         </h1>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-1 hover:bg-gray-100 rounded"
//         >
//           {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </button>
//       </div>

//       <div className="p-4">
//         <button
//           onClick={() => setIsAddingBoard(true)}
//           className="flex items-center gap-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           <PlusCircle size={20} />
//           {isSidebarOpen && 'New Board'}
//         </button>
//       </div>

//       <nav className="flex-1 overflow-y-auto">
//         {boards.map(board => (
//           <button
//             key={board.id}
//             onClick={() => setActiveBoard(board.id)}
//             className={`w-full text-left p-3 flex items-center gap-2 hover:bg-gray-100 ${activeBoard === board.id ? 'bg-blue-50 text-blue-600' : ''}`}
//           >
//             <Layout size={16} />
//             {isSidebarOpen && <span className="truncate">{board.title}</span>}
//           </button>
//         ))}
//       </nav>

//       {/* Overlay for "Create New Board" */}
//       {isAddingBoard && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
//           <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Create New Board</h2>
//             <input
//               type="text"
//               value={newBoardTitle}
//               onChange={(e) => setNewBoardTitle(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Enter board title..."
//               autoFocus
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={addNewBoard}
//               >
//                 Create Board
//               </button>
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                 onClick={() => {
//                   setIsAddingBoard(false);
//                   setNewBoardTitle('');
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
