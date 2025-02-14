//without naming convention old db
/*
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './Card';
import { PlusCircle, X, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

//const API_BASE_URL = 'http://localhost:5000/api';
const domain = "cbsl.teamob.in"; // Extracts domain dynamically
const API_BASE_URL = `https://${domain}/gpt/route/api`;

const ItemTypes = { CARD_ITEM: 'card_item' };
const DraggableItem = ({ item, cardId, boardId, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD_ITEM,
    item: { id: item.id, sourceCardId: cardId, sourceBoardId: boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [isChecked, setIsChecked] = useState(item.completed || false);
  const [priority, setPriority] = useState(item.priority || 'low');

  // Handle checkbox change
  const handleCheckboxChange = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/items/${item.id}`, {
        completed: !isChecked
      });
      setIsChecked(!isChecked);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority) => {
    try {
      await axios.patch(`${API_BASE_URL}/items/${item.id}`, {
        priority: newPriority
      });
      setPriority(newPriority);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    return `${day}/${month}/${year}`;
  };

  const getPriorityStyles = (priority) => {
    const baseStyles = "text-xs px-2 py-1 rounded-full font-medium";
    switch (priority) {
      case 'high':
        return `${baseStyles} bg-red-100 text-red-700`;
      case 'medium':
        return `${baseStyles} bg-yellow-100 text-yellow-700`;
      default: // low
        return `${baseStyles} bg-green-100 text-green-700`;
    }
  };

  return (
    <li 
      ref={drag}
      className={`flex justify-between items-center p-4 bg-gray-50 rounded ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(item.createdTime || item.created_time)}
            </span>
            <div className="relative group">
              <span className={getPriorityStyles(priority)}>
                {priority}
              </span>
              <div className="absolute left-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handlePriorityChange('low')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    Low
                  </button>
                  <button 
                    onClick={() => handlePriorityChange('medium')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => handlePriorityChange('high')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>
        
          <span className={`font-semibold text-lg ${isChecked ? 'line-through text-gray-400' : ''}`}>
            {item.title}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(boardId, cardId, item.id)}
        >
          <X size={14} />
        </button>
      </div>
    </li>
  );
};

// Droppable Card Component
const DroppableCard = ({
  card,
  boardId,
  onDeleteCard,
  onColorChange,
  onAddItem,
  addingItemTo,
  newItemTitle,
  setAddingItemTo,
  setNewItemTitle,
  onDeleteItem,
  cardColors,
  moveItem
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD_ITEM,
    drop: (item) => {
      if (item.sourceCardId !== card.id) {
        moveItem(item.id, item.sourceCardId, card.id, boardId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Card
      ref={drop}
      className={`p-4 relative ${isOver ? 'border-2 border-blue-500' : ''}`}
      style={{ backgroundColor: card.color }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-xl">{card.title}</h3>
        <div className="flex gap-2">
          <div className="relative group">
            <button className="p-1 hover:bg-gray-100 rounded" title="Change color">
              🎨
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10">
              <div className="flex gap-1 flex-wrap w-24">
                {cardColors.map(({ id, color, name }) => (
                  <button
                    key={id}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(boardId, card.id, color)}
                    title={name}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setAddingItemTo(card.id)}
          >
            <PlusCircle size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => onDeleteCard(boardId, card.id)}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {addingItemTo === card.id && (
        <div className="mb-3">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter item..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddItem(boardId, card.id); // Call the function to add a new item
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onAddItem(boardId, card.id)}
            >
              Add
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                setAddingItemTo(null);
                setNewItemTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {card.items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            cardId={card.id}
            boardId={boardId}
            onDelete={onDeleteItem}
          />
        ))}
      </ul>
    </Card>
  );
};
const KanbanApp = () => {

  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [addingCardTo, setAddingCardTo] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [addingItemTo, setAddingItemTo] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  //  cardColors array
  const cardColors = [
    { id: 1, color: '#ffffff', name: 'White' },
    { id: 2, color: '#fecaca', name: 'Light Pink' },
    { id: 3, color: '#fdba74', name: 'Light Orange' },
    { id: 4, color: '#bef264', name: 'Green' },
    { id: 5, color: '#99f6e4', name: 'Light Blue' },
    { id: 6, color: '#c084fc', name: 'Purple' },
    { id: 7, color: '#c4b5fd', name: 'Pink' },
    { id: 8, color: '#d1d5db', name: 'Gray' }
  ];

  const moveItem = async (itemId, sourceCardId, targetCardId, boardId) => {
    try {
      await axios.patch(`${API_BASE_URL}/items/${itemId}/move`, {
        targetCardId
      });

      setBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === sourceCardId) {
                return {
                  ...card,
                  items: card.items.filter(item => item.id !== itemId)
                };
              }
              if (card.id === targetCardId) {
                const movedItem = board.cards
                  .find(c => c.id === sourceCardId)
                  .items.find(item => item.id === itemId);
                return {
                  ...card,
                  items: [...card.items, movedItem]
                };
              }
              return card;
            })
          };
        }
        return board;
      }));
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/boards`);
      setBoards(response.data);

      const savedActiveBoard = localStorage.getItem('activeBoard');
      if (savedActiveBoard && response.data.some((board) => board.id === savedActiveBoard)) {
        setActiveBoard(savedActiveBoard);
      } else if (response.data.length > 0) {
        setActiveBoardAndPersist(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const setActiveBoardAndPersist = (boardId) => {
    setActiveBoard(boardId);
    localStorage.setItem('activeBoard', boardId);
  };

  const handleBoardClick = (boardId) => {
    setActiveBoardAndPersist(boardId);
  };

  const addNewBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/boards`, {
        title: newBoardTitle,
      });

      const newBoard = response.data;
      newBoard.cards = [];

      setBoards((prev) => [...prev, newBoard]);
      setActiveBoardAndPersist(newBoard.id);
      setNewBoardTitle('');
      setIsAddingBoard(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const addNewCard = async (boardId) => {
    if (!newCardTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/boards/${boardId}/cards`, {
        title: newCardTitle,
        color: selectedColor
      });

      const newCard = response.data;
      newCard.items = [];

      setBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: [...board.cards, newCard]
          };
        }
        return board;
      }));

      setNewCardTitle('');
      setAddingCardTo(null);
      setSelectedColor('#ffffff');
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const updateCardColor = async (boardId, cardId, color) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/cards/${cardId}/color`, {
        color
      });

      setBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === cardId) {
                return { ...card, color: response.data.color };
              }
              return card;
            })
          };
        }
        return board;
      }));
    } catch (error) {
      console.error('Error updating card color:', error);
    }
  };

  const addNewItem = async (boardId, cardId) => {
    if (!newItemTitle.trim()) return;
  
    try {
      const response = await axios.post(`${API_BASE_URL}/cards/${cardId}/items`, {
        title: newItemTitle,
        completed: false  
      });
  
      const newItem = response.data;
      console.log('New item created:', newItem);
      setBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  items: [...card.items, newItem]
                };
              }
              return card;
            })
          };
        }
        return board;
      }));
  
      setNewItemTitle('');
      setAddingItemTo(null);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await axios.delete(`${API_BASE_URL}/boards/${boardId}`);
      setBoards(prev => prev.filter(b => b.id !== boardId));
      setActiveBoard(null);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const deleteCard = async (boardId, cardId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`);
      setBoards(prev => prev.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            cards: b.cards.filter(c => c.id !== cardId)
          };
        }
        return b;
      }));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const deleteItem = async (boardId, cardId, itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${itemId}`);
      setBoards(prev => prev.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            cards: b.cards.map(c => {
              if (c.id === cardId) {
                return {
                  ...c,
                  items: c.items.filter(i => i.id !== itemId)
                };
              }
              return c;
            })
          };
        }
        return b;
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
 
  const activeboardData = boards.find(board => board.id === activeBoard);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
     
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
    .sort((a, b) => (a.title === 'MyBoard' ? -1 : b.title === 'MyBoard' ? 1 : 0)) // Sort "MyBoard" to the top
    .map((board) => (
            <button
            key={board.id}
            onClick={() => handleBoardClick(board.id)}
            className={`w-full text-left p-3 font-bold  flex items-center gap-2 hover:bg-gray-100 ${
              activeBoard === board.id ? 'bg-blue-50 text-blue-600' : ''
            } ${board.title === 'MyBoard' ? 'font-bold ' : ''}`}
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

       
        <div className="flex-1 overflow-hidden flex flex-col">
         
          {isAddingBoard && (
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    
              <Card className="p-4 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Board</h2>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Enter board title..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addNewBoard();
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={addNewBoard}
                  >
                    Create Board
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setIsAddingBoard(false);
                      setNewBoardTitle('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            </div>
          )}

         
          {activeBoard ? (
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{activeboardData?.title}</h2>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setAddingCardTo(activeBoard)}
                  >
                    <PlusCircle size={16} />
                    Add Card
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteBoard(activeBoard)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

           
              {addingCardTo === activeBoard && (
                <Card className="p-4 mb-6">
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    className="w-40 p-2 border rounded mb-2"
                    placeholder="Enter card title..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewCard(activeBoard);
                      }
                    }}
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">Select card color:</span>
                    <div className="flex gap-2">
                      {cardColors.map(({ id, color, name }) => (
                        <button
                          key={id}
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedColor === color ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          title={name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => addNewCard(activeBoard)}
                    >
                      Add Card
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => {
                        setAddingCardTo(null);
                        setNewCardTitle('');
                        setSelectedColor('#ffffff');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Card>
              )}

     
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeboardData?.cards.map(card => (
                  <DroppableCard
                    key={card.id}
                    card={card}
                    boardId={activeBoard}
                    onDeleteCard={deleteCard}
                    onColorChange={updateCardColor}
                    onAddItem={addNewItem}
                    addingItemTo={addingItemTo}
                    newItemTitle={newItemTitle}
                    setAddingItemTo={setAddingItemTo}
                    setNewItemTitle={setNewItemTitle}
                    onDeleteItem={deleteItem}
                    cardColors={cardColors}
                    moveItem={moveItem}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h2 className="text-xl font-semibold mb-2">No Board Selected</h2>
                <p>Create a new board or select an existing one to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanApp;
*/





//upd. db_column names ..31jan

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './Card';
import { PlusCircle, X, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

//const API_BASE_URL = 'http://localhost:5000/api';
const domain = "cbsl.teamob.in"; // Extracts domain dynamically
const API_BASE_URL = `https://${domain}/gpt/route/api`;
const ItemTypes = { CARD_ITEM: 'card_item' };

const DraggableItem = ({ item, cardId, boardId, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD_ITEM,
    item: { id: item.id, sourceCardId: cardId, sourceBoardId: boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [isChecked, setIsChecked] = useState(item.completed || false);
  const [priority, setPriority] = useState(item.priority || 'low');

  // Handle checkbox change
  const handleCheckboxChange = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/kanban_items/${item.id}`, {
        completed: !isChecked
      });
      setIsChecked(!isChecked);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority) => {
    try {
      await axios.patch(`${API_BASE_URL}/kanban_items/${item.id}`, {
        priority: newPriority
      });
      setPriority(newPriority);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    return `${day}/${month}/${year}`;
  };

  const getPriorityStyles = (priority) => {
    const baseStyles = "text-xs px-2 py-1 rounded-full font-medium";
    switch (priority) {
      case 'high':
        return `${baseStyles} bg-red-100 text-red-700`;
      case 'medium':
        return `${baseStyles} bg-yellow-100 text-yellow-700`;
      default: // low
        return `${baseStyles} bg-green-100 text-green-700`;
    }
  };

  return (
    <li 
      ref={drag}
      className={`flex justify-between items-center p-4 bg-gray-50 rounded ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(item.createdTime || item.created_time)}
            </span>
            <div className="relative group">
              <span className={getPriorityStyles(priority)}>
                {priority}
              </span>
              <div className="absolute left-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handlePriorityChange('low')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    Low
                  </button>
                  <button 
                    onClick={() => handlePriorityChange('medium')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => handlePriorityChange('high')}
                    className="text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>
        
          <span className={`font-semibold text-lg ${isChecked ? 'line-through text-gray-400' : ''}`}>
            {item.title}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(boardId, cardId, item.id)}
        >
          <X size={14} />
        </button>
      </div>
    </li>
  );
};

const DroppableCard = ({
  card,
  boardId,
  onDeleteCard,
  onColorChange,
  onAddItem,
  addingItemTo,
  newItemTitle,
  setAddingItemTo,
  setNewItemTitle,
  onDeleteItem,
  cardColors,
  moveItem
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD_ITEM,
    drop: (item) => {
      if (item.sourceCardId !== card.id) {
        moveItem(item.id, item.sourceCardId, card.id, boardId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Card
      ref={drop}
      className={`p-4 relative ${isOver ? 'border-2 border-blue-500' : ''}`}
      style={{ backgroundColor: card.color }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-xl">{card.title}</h3>
        <div className="flex gap-2">
          <div className="relative group">
            <button className="p-1 hover:bg-gray-100 rounded" title="Change color">
              🎨
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10">
              <div className="flex gap-1 flex-wrap w-24">
                {cardColors.map(({ id, color, name }) => (
                  <button
                    key={id}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(boardId, card.id, color)}
                    title={name}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setAddingItemTo(card.id)}
          >
            <PlusCircle size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => onDeleteCard(boardId, card.id)}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {addingItemTo === card.id && (
        <div className="mb-3">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter item..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddItem(boardId, card.id);
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onAddItem(boardId, card.id)}
            >
              Add
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                setAddingItemTo(null);
                setNewItemTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {card.items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            cardId={card.id}
            boardId={boardId}
            onDelete={onDeleteItem}
          />
        ))}
      </ul>
    </Card>
  );
};

const KanbanApp = () => {
  const [kanbanBoards, setKanbanBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [addingCardTo, setAddingCardTo] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [addingItemTo, setAddingItemTo] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardColors = [
    { id: 1, color: '#ffffff', name: 'White' },
    { id: 2, color: '#fecaca', name: 'Light Pink' },
    { id: 3, color: '#fdba74', name: 'Light Orange' },
    { id: 4, color: '#bef264', name: 'Green' },
    { id: 5, color: '#99f6e4', name: 'Light Blue' },
    { id: 6, color: '#c084fc', name: 'Purple' },
    { id: 7, color: '#c4b5fd', name: 'Pink' },
    { id: 8, color: '#d1d5db', name: 'Gray' }
  ];
  
  const moveItem = async (itemId, sourceCardId, targetCardId, boardId) => {
    try {
      await axios.patch(`${API_BASE_URL}/kanban_items/${itemId}/move`, {
        targetCardId
      });

      setKanbanBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === sourceCardId) {
                return {
                  ...card,
                  items: card.items.filter(item => item.id !== itemId)
                };
              }
              if (card.id === targetCardId) {
                const movedItem = board.cards
                  .find(c => c.id === sourceCardId)
                  .items.find(item => item.id === itemId);
                return {
                  ...card,
                  items: [...card.items, movedItem]
                };
              }
              return card;
            })
          };
        }
        return board;
      }));
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/kanban_boards`);
      setKanbanBoards(response.data || []);

      const savedActiveBoard = localStorage.getItem('activeBoard');
      if (savedActiveBoard && response.data?.some((board) => board.id === savedActiveBoard)) {
        setActiveBoard(savedActiveBoard);
      } else if (response.data?.length > 0) {
        setActiveBoardAndPersist(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to load boards. Please try again later.');
      setKanbanBoards([]);
    } finally {
      setIsLoading(false);
    }
  };


  const setActiveBoardAndPersist = (boardId) => {
    setActiveBoard(boardId);
    localStorage.setItem('activeBoard', boardId);
  };

  const handleBoardClick = (boardId) => {
    setActiveBoardAndPersist(boardId);
  };

  const addNewBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/kanban_boards`, {
        title: newBoardTitle,
      });

      const newBoard = response.data;
      newBoard.cards = [];

      setKanbanBoards((prev) => [...prev, newBoard]);
      setActiveBoardAndPersist(newBoard.id);
      setNewBoardTitle('');
      setIsAddingBoard(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const addNewCard = async (boardId) => {
    if (!newCardTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/kanban_boards/${boardId}/kanban_cards`, {
        title: newCardTitle,
        color: selectedColor
      });

      const newCard = response.data;
      console.log("newCard", newCard)
      newCard.items = [];

      setKanbanBoards(prev => prev.map(board => {
        console.log("board", board)
        if (board.id === boardId) {
          return {
            ...board,
            cards: [...board.cards, newCard]
          };
        }
        return board;
      }));

      setNewCardTitle('');
      setAddingCardTo(null);
      setSelectedColor('#ffffff');
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const updateCardColor = async (boardId, cardId, color) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/kanban_cards/${cardId}/color`, {
        color
      });

      setKanbanBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === cardId) {
                        return { ...card, color: response.data.color };
              }
              return card;
            })
          };
        }
        return board;
      }));
    } catch (error) {
      console.error('Error updating card color:', error);
    }
  };

  const addNewItem = async (boardId, cardId) => {
    if (!newItemTitle.trim()) return;
  
    try {
      const response = await axios.post(`${API_BASE_URL}/kanban_cards/${cardId}/kanban_items`, {
        title: newItemTitle,
        completed: false  
      });
  
      const newItem = response.data;
      console.log('New item created:', newItem);
      setKanbanBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  items: [...card.items, newItem]
                };
              }
              return card;
            })
          };
        }
        return board;
      }));
  
      setNewItemTitle('');
      setAddingItemTo(null);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await axios.delete(`${API_BASE_URL}/kanban_boards/${boardId}`);
      setKanbanBoards(prev => prev.filter(b => b.id !== boardId));
      setActiveBoard(null);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const deleteCard = async (boardId, cardId) => {
    try {
      await axios.delete(`${API_BASE_URL}/kanban_cards/${cardId}`);
      setKanbanBoards(prev => prev.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            cards: b.cards.filter(c => c.id !== cardId)
          };
        }
        return b;
      }));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const deleteItem = async (boardId, cardId, itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/kanban_items/${itemId}`);
      setKanbanBoards(prev => prev.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            cards: b.cards.map(c => {
              if (c.id === cardId) {
                return {
                  ...c,
                  items: c.items.filter(i => i.id !== itemId)
                };
              }
              return c;
            })
          };
        }
        return b;
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
 
  const activeboardData = kanbanBoards.find(board => board.id === activeBoard) || null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
     
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

      <div className="flex-1 overflow-hidden flex flex-col">
      
        {isAddingBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <Card className="p-4 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Board</h2>
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter board title..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addNewBoard();
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={addNewBoard}
                >
                  Create Board
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setIsAddingBoard(false);
                    setNewBoardTitle('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        )}


        {activeBoard && activeboardData ? (
          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{activeboardData?.title}</h2>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setAddingCardTo(activeBoard)}
                >
                  <PlusCircle size={16} />
                  Add Card
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteBoard(activeBoard)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

        
            {addingCardTo === activeBoard && (
              <Card className="p-4 mb-6">
                <input
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="w-40 p-2 border rounded mb-2"
                  placeholder="Enter card title..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addNewCard(activeBoard);
                    }
                  }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Select card color:</span>
                  <div className="flex gap-2">
                    {cardColors.map(({ id, color, name }) => (
                      <button
                        key={id}
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedColor === color ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => addNewCard(activeBoard)}
                  >
                    Add Card
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setAddingCardTo(null);
                      setNewCardTitle('');
                      setSelectedColor('#ffffff');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            )}

          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeboardData.cards?.map(card => (
                <DroppableCard
                  key={card.id}
                  card={card}
                  boardId={activeBoard}
                  onDeleteCard={deleteCard}
                  onColorChange={updateCardColor}
                  onAddItem={addNewItem}
                  addingItemTo={addingItemTo}
                  newItemTitle={newItemTitle}
                  setAddingItemTo={setAddingItemTo}
                  setNewItemTitle={setNewItemTitle}
                  onDeleteItem={deleteItem}
                  cardColors={cardColors}
                  moveItem={moveItem}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">No Board Selected</h2>
              <p>Create a new board or select an existing one to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </DndProvider>
);
};

export default KanbanApp;
