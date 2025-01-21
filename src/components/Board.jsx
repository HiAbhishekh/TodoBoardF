// import React, { useState } from 'react';
// import { PlusCircle, X } from 'lucide-react';
// import axios from 'axios';

// const Board = ({ board, setBoards, activeBoard, setActiveBoard }) => {
    
//   const [addingCardTo, setAddingCardTo] = useState(null);
//   const [newCardTitle, setNewCardTitle] = useState('');
//   const [addingItemTo, setAddingItemTo] = useState(null);
//   const [newItemTitle, setNewItemTitle] = useState('');
// //   if (!board) {
// //     return <div>Loading...</div>;
// //   }
// const handleAddCard = async () => {
//     if (!newCardTitle.trim()) return;
    
//     const newCard = {
//       id: Date.now().toString(),
//       title: newCardTitle,
//       items: []
//     };
  
//     // Optimistic update: add the card to the state before the API call
//     setBoards(prev => prev.map(b => b.id === board.id ? { ...b, cards: [...b.cards, newCard] } : b));
    
//     try {
//       const response = await axios.post(`http://localhost:5000/api/boards/${board.id}/cards`, newCard);
//       setBoards(prev => prev.map(b => b.id === board.id ? { ...b, cards: [...b.cards, response.data] } : b));
//       setNewCardTitle('');
//       setAddingCardTo(null);
//     } catch (error) {
//       console.error("Error adding card:", error);
//     }
//   };
  

//   const handleAddItem = async (cardId) => {
//     if (!newItemTitle.trim()) return;  // Check if item title is empty
    
//     const newItem = {
//       id: Date.now().toString(),  // Generate a unique ID for the new item
//       title: newItemTitle  // Get the title from the input
//     };
    
//     try {
//       // Send a POST request to add the item to the card
//       const response = await axios.post(`http://localhost:5000/api/cards/${cardId}/items`, newItem);
      
//       // Update the state with the new item added to the corresponding card
//       setBoards(prev => prev.map(b => {
//         if (b.id === board.id) {
//           return {
//             ...b,
//             cards: b.cards.map(c => 
//               c.id === cardId ? { ...c, items: [...c.items, response.data] } : c
//             )
//           };
//         }
//         return b;
//       }));
      
//       // Clear the input fields after successful addition
//       setNewItemTitle('');
//       setAddingItemTo(null);
//     } catch (error) {
//       console.error("Error adding item:", error);
//     }
//   };
  

//   const handleDeleteCard = async (cardId) => {
//     try {
//       // Send to backend to delete the card
//       await axios.delete(`http://localhost:5000/api/cards/${cardId}`);
//       // Update the local state by removing the card
//       setBoards(prev => prev.map(b => {
//         if (b.id === board.id) {
//           return {
//             ...b,
//             cards: b.cards.filter(c => c.id !== cardId)
//           };
//         }
//         return b;
//       }));
//     } catch (error) {
//       console.error("Error deleting card:", error);
//     }
//   };

//   const handleDeleteItem = async (cardId, itemId) => {
//     try {
//       // Send to backend to delete the item
//       await axios.delete(`http://localhost:5000/api/items/${itemId}`);
//       // Update the local state by removing the item
//       setBoards(prev => prev.map(b => {
//         if (b.id === board.id) {
//           return {
//             ...b,
//             cards: b.cards.map(c => c.id === cardId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c)
//           };
//         }
//         return b;
//       }));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <div className="flex-1 h-screen overflow-auto p-4 md:p-6">
//       {/* Board Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sticky top-0 bg-gray-50 p-2 z-10">
//         <h2 className="text-xl md:text-2xl font-bold">{board.title}</h2>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <button
//             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={() => setAddingCardTo(activeBoard)}
//           >
//             <PlusCircle size={16} />
//             <span>Add Card</span>
//           </button>
//           <button
//             className="text-red-500 hover:text-red-700 p-2"
//             onClick={() => {
//               setBoards(prev => prev.filter(b => b.id !== activeBoard));
//               setActiveBoard(null);
//             }}
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Add Card Form */}
//       {addingCardTo === activeBoard && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
//             <input
//               type="text"
//               value={newCardTitle}
//               onChange={(e) => setNewCardTitle(e.target.value)}
//               className="w-full p-2 border rounded mb-2"
//               placeholder="Enter card title..."
//               autoFocus
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={handleAddCard}
//               >
//                 Add Card
//               </button>
//               <button
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                 onClick={() => {
//                   setAddingCardTo(null);
//                   setNewCardTitle('');
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
//         {board.cards.map(card => (
//           <div key={card.id} className="bg-white rounded-lg shadow-lg p-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-semibold truncate">{card.title}</h3>
//               <div className="flex gap-2">
//                 <button
//                   className="text-blue-500 hover:text-blue-700 p-1"
//                   onClick={() => setAddingItemTo(card.id)}
//                 >
//                   <PlusCircle size={16} />
//                 </button>
//                 <button
//                   className="text-red-500 hover:text-red-700 p-1"
//                   onClick={() => handleDeleteCard(card.id)}
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Add Item Form */}
//             {addingItemTo === card.id && (
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   value={newItemTitle}
//                   onChange={(e) => setNewItemTitle(e.target.value)}
//                   className="w-full p-2 border rounded mb-2"
//                   placeholder="Enter item..."
//                   autoFocus
//                 />
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     onClick={() => handleAddItem(card.id)}
//                   >
//                     Add
//                   </button>
//                   <button
//                     className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                     onClick={() => {
//                       setAddingItemTo(null);
//                       setNewItemTitle('');
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Items List */}
//             <ul className="space-y-2">
//               {card.items.map(item => (
//                 <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded group">
//                   <span className="truncate">{item.title}</span>
//                   <button
//                     className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
//                     onClick={() => handleDeleteItem(card.id, item.id)}
//                   >
//                     <X size={14} />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Board;
