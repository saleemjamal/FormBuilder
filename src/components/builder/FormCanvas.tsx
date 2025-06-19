'use client'

import { useDrop } from 'react-dnd'
import { FormElement } from '@/types/form'
import { FormElementRenderer } from './FormElementRenderer'
import { DropZone } from './DropZone'

interface FormCanvasProps {
  elements: FormElement[]
  selectedElement: string | null
  onSelectElement: (elementId: string | null) => void
  onAddElement: (type: string, position: number) => void
  onUpdateElement: (elementId: string, updates: Partial<FormElement>) => void
  onRemoveElement: (elementId: string) => void
  onMoveElement: (fromIndex: number, toIndex: number) => void
}

export function FormCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onRemoveElement,
  onMoveElement,
}: FormCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: { elementType: string }, monitor) => {
      if (!monitor.didDrop()) {
        onAddElement(item.elementType, elements.length)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }))

  return (
    <div className="p-8 min-h-full">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Form Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Form Preview
            </h1>
            <p className="text-gray-600">
              This is how your form will appear to users
            </p>
          </div>

          {/* Form Elements */}
          <div ref={drop} className={`space-y-4 ${isOver ? 'bg-primary-50' : ''}`}>
            {elements.length === 0 ? (
              <div className="text-center py-12">
                <div className="drag-area">
                  <p className="text-gray-500 text-lg mb-2">
                    Start building your form
                  </p>
                  <p className="text-gray-400 text-sm">
                    Drag elements from the left panel to add them here
                  </p>
                </div>
              </div>
            ) : (
              elements.map((element, index) => (
                <div key={element.id} className="relative">
                  {/* Drop zone before element */}
                  <DropZone
                    position={index}
                    onDrop={(elementType) => onAddElement(elementType, index)}
                  />
                  
                  {/* Form Element */}
                  <FormElementRenderer
                    element={element}
                    isSelected={selectedElement === element.id}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    onRemove={() => onRemoveElement(element.id)}
                  />
                </div>
              ))
            )}
            
            {/* Drop zone after last element */}
            {elements.length > 0 && (
              <DropZone
                position={elements.length}
                onDrop={(elementType) => onAddElement(elementType, elements.length)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
