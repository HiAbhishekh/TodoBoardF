import React from 'react';
import { useDrag } from 'react-dnd';
import { X } from 'lucide-react';

const ItemTypes = { CARD_ITEM: 'card_item' };

const DraggableItem = ({ item, cardId, boardId, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
  
    return `${day}/${month}/${year}`;
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD_ITEM,
    item: { id: item.id, sourceCardId: cardId, sourceBoardId: boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <li 
      ref={drag}
      className={`flex justify-between items-center p-4 bg-gray-50 rounded ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-gray-500">
          {formatDate(item.createdTime || item.created_time)}
        </span>
        <span className="font-semibold text-lg">{item.title}</span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="mr-2">{item.owner}</span>
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

export default DraggableItem;