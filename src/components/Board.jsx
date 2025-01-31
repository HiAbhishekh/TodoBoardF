import React from 'react';
import { PlusCircle, X } from 'lucide-react';
import Card from './Card';
import DroppableCard from './DroppableCard';

const Boards = ({
  activeboardData,
  activeBoard,
  addingCardTo,
  setAddingCardTo,
  newCardTitle,
  setNewCardTitle,
  addNewCard,
  deleteBoard,
  cardColors,
  selectedColor,
  setSelectedColor,
  deleteCard,
  updateCardColor,
  addNewItem,
  addingItemTo,
  setAddingItemTo,
  newItemTitle,
  setNewItemTitle,
  deleteItem,
  moveItem
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      {activeboardData && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{activeboardData.title}</h2>
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
                className="w-full p-2 border rounded mb-2"
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
            {activeboardData.cards.map(card => (
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
        </>
      )}
    </div>
  );
};

export default Boards;