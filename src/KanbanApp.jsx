import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import Boards from './components/Board';
import Card from './components/Card';

const API_BASE_URL = process.env.REACT_APP_API_URL;//


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
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          boards={boards}
          isSidebarOpen={isSidebarOpen}
          activeBoard={activeBoard}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsAddingBoard={setIsAddingBoard}
          handleBoardClick={handleBoardClick}
          deleteBoard={deleteBoard}
        />

        {!activeBoard ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">No Board Selected</h2>
              <p>Create a new board or select an existing one to get started</p>
            </div>
          </div>
        ) : (
          <Boards
            activeboardData={activeboardData}
            activeBoard={activeBoard}
            addingCardTo={addingCardTo}
            setAddingCardTo={setAddingCardTo}
            newCardTitle={newCardTitle}
            setNewCardTitle={setNewCardTitle}
            addNewCard={addNewCard}
            deleteBoard={deleteBoard}
            cardColors={cardColors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            deleteCard={deleteCard}
            updateCardColor={updateCardColor}
            addNewItem={addNewItem}
            addingItemTo={addingItemTo}
            setAddingItemTo={setAddingItemTo}
            newItemTitle={newItemTitle}
            setNewItemTitle={setNewItemTitle}
            deleteItem={deleteItem}
            moveItem={moveItem}
          />
        )}

        {/* Add Board Modal */}
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
      </div>
    </DndProvider>
  );
};

export default KanbanApp;