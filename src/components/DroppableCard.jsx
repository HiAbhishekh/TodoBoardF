import React from 'react';
import { useDrop } from 'react-dnd';
import { PlusCircle, X } from 'lucide-react';
import Card from './Card';
import DraggableItem from './DraggableItem';

const ItemTypes = { CARD_ITEM: 'card_item' };

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

export default DroppableCard;