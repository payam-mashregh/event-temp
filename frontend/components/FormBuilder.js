// upto/frontend/components/FormBuilder.js
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';

// یک آیتم قابل کشیدن (مثلا یک فیلد متنی)
const DraggableField = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-2 mb-2 bg-gray-200 rounded cursor-move border"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {type}
    </div>
  );
};

// بوم اصلی که فیلدها روی آن رها می‌شوند
const Canvas = ({ fields, setFields }) => {
  const [, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item) => {
      setFields((prevFields) => [...prevFields, { id: Date.now(), ...item }]);
    },
  }));

  return (
    <div ref={drop} className="w-2/3 p-4 bg-white border-dashed border-2 min-h-[400px]">
      {fields.length === 0 ? (
        <p className="text-gray-400">Drag fields from the right panel and drop them here.</p>
      ) : (
        fields.map((field) => (
          <div key={field.id} className="p-4 mb-2 bg-blue-100 rounded">
            A '{field.type}' field.
          </div>
        ))
      )}
    </div>
  );
};

// کامپوننت اصلی فرم‌ساز
export default function FormBuilder() {
  const [fields, setFields] = useState([]);

  const fieldTypes = ['Text Input', 'Email', 'Number', 'Date', 'File Upload'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex p-4 space-x-4 bg-gray-50">
        {/* پنل تنظیمات در آینده اینجا قرار می‌گیرد */}
        <div className="w-1/4 p-4 bg-white border rounded">
          <h3 className="font-bold mb-4">Settings</h3>
          <p className="text-sm text-gray-500">Select a field to see its properties.</p>
        </div>

        <Canvas fields={fields} setFields={setFields} />

        <div className="w-1/4 p-4 bg-white border rounded">
          <h3 className="font-bold mb-4">Components</h3>
          {fieldTypes.map((type) => (
            <DraggableField key={type} type={type} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}