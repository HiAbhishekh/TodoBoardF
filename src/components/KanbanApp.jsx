import React, { useState, useEffect } from 'react';
import  Card  from './Card';
import { PlusCircle, X, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';


const API_BASE_URL = 'http://54.226.210.242:5000/api';

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

  // Fetch boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/boards`);
      setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };
  useEffect(() => {
    if (boards.length > 0) {
      const defaultBoard = boards.find((board) => board.title === 'MyBoard');
      setActiveBoard(defaultBoard?.id || boards[0].id);
    }
  }, [boards]);
  
  const addNewBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/boards`, {
        title: newBoardTitle
      });

      const newBoard = response.data;
      newBoard.cards = [];
      
      setBoards(prev => [...prev, newBoard]);
      setActiveBoard(newBoard.id);
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
        title: newItemTitle
      });

      const newItem = response.data;

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
        {boards.map((board) => (
  <button
    key={board.id}
    onClick={() => setActiveBoard(board.id)}
    className={`w-full text-left p-3 flex items-center gap-2 hover:bg-gray-100 ${
      activeBoard === board.id ? 'bg-blue-50 text-blue-600' : ''
    } ${board.title === 'MyBoard' ? 'font-bold text-blue-500' : ''}`} // Style for default board
  > 
    
    <div className="flex w-full justify-between items-center">
    <div className="flex items-center gap-2">
      <Layout size={16} />
      {isSidebarOpen && (
        <span className="truncate">{board.title}</span>
      )}
    </div>

    {/* Delete button at the right corner */}
    <button
      className="text-red-500 hover:text-red-700"
      onClick={(e) => {
        e.stopPropagation(); // Prevents triggering the board selection
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Add Board Form */}
        {isAddingBoard && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="p-4 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Board</h2>
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter board title..."
                autoFocus
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

        {/* Board Content */}
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

            {/* Add Card Form */}
            {addingCardTo === activeBoard && (
    <Card className="p-4 mb-6">
      <input
        type="text"
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter card title..."
        autoFocus
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
      <Card 
        key={card.id} 
        className="p-4 relative"
        style={{ backgroundColor: card.color }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{card.title}</h3>
          <div className="flex gap-2">
            <div className="relative group">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                title="Change color"
              >
                🎨
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10">
                <div className="flex gap-1 flex-wrap w-24">
                  {cardColors.map(({ id, color, name }) => (
                    <button
                      key={id}
                      className="w-6 h-6 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                      onClick={() => updateCardColor(activeBoard, card.id, color)}
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
              onClick={() => deleteCard(activeBoard, card.id)}
            >
              <X size={16} />
            </button>
          </div>
        </div>

                  {/* Add Item Form */}
                  {addingItemTo === card.id && (
                    <div className="mb-3">
                      <input
                        type="text"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Enter item..."
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => addNewItem(activeBoard, card.id)}
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

                  {/* Items List */}
                  <ul className="space-y-2">
                    {card.items.map(item => (
                      <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.title}</span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteItem(activeBoard, card.id, item.id)}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
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
  );
};

export default KanbanApp;