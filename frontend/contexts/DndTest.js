import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialItems = [
  { id: 'item-1', content: 'آیتم ۱ (قابل حرکت)' },
  { id: 'item-2', content: 'آیتم ۲ (قابل حرکت)' },
  { id: 'item-3', content: 'آیتم ۳ (قابل حرکت)' },
];

export default function DndTest() {
    const [isClient, setIsClient] = useState(false);
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    };

    if (!isClient) {
        return null; // or a loading indicator
    }

    return (
        <div className="p-8 bg-gray-100 rounded-lg border">
            <h2 className="font-bold text-xl mb-4">تست Drag and Drop</h2>
            <p className="text-sm mb-4">اگر می‌توانید آیتم‌های زیر را جابجا کنید، پکیج به درستی نصب شده است.</p>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="test-droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 p-4 bg-white rounded-md shadow">
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="p-4 bg-blue-100 border border-blue-300 rounded-md shadow-sm"
                                        >
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}