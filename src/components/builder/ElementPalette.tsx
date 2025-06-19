'use client'

import { useDrag } from 'react-dnd'
import {
  DocumentTextIcon,
  HashtagIcon,
  AtSymbolIcon,
  LinkIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  ListBulletIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const elementTypes = [
  { type: 'text', label: 'Text Input', icon: DocumentTextIcon },
  { type: 'textarea', label: 'Text Area', icon: DocumentTextIcon },
  { type: 'number', label: 'Number', icon: HashtagIcon },
  { type: 'email', label: 'Email', icon: AtSymbolIcon },
  { type: 'url', label: 'URL', icon: LinkIcon },
  { type: 'date', label: 'Date', icon: CalendarIcon },
  { type: 'datetime', label: 'Date & Time', icon: CalendarIcon },
  { type: 'time', label: 'Time', icon: ClockIcon },
  { type: 'select', label: 'Dropdown', icon: ListBulletIcon },
  { type: 'radio', label: 'Radio Buttons', icon: CheckCircleIcon },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckCircleIcon },
  { type: 'file', label: 'File Upload', icon: DocumentArrowUpIcon },
  { type: 'image', label: 'Image Upload', icon: PhotoIcon },
  { type: 'dynamic_dropdown', label: 'Dynamic Dropdown', icon: ListBulletIcon },
  { type: 'repeating_section', label: 'Repeating Section', icon: ArrowPathIcon },
]

interface ElementPaletteProps {
  onAddElement: (type: string, position: number) => void
}

function DraggableElement({ elementType, onAddElement }: { 
  elementType: typeof elementTypes[0], 
  onAddElement: (type: string, position: number) => void 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { elementType: elementType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const Icon = elementType.icon

  return (
    <div
      ref={drag}
      className={`
        flex items-center space-x-3 p-3 rounded-lg cursor-move
        transition-colors duration-200 border-2 border-transparent
        hover:bg-primary-50 hover:border-primary-200
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {elementType.label}
      </span>
    </div>
  )
}
export function ElementPalette({ onAddElement }: ElementPaletteProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Elements</h3>
      <p className="text-sm text-gray-600 mb-6">
        Drag elements to the form canvas to build your form
      </p>
      
      <div className="space-y-2">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Inputs</h4>
          {elementTypes.slice(0, 8).map((elementType) => (
            <DraggableElement
              key={elementType.type}
              elementType={elementType}
              onAddElement={onAddElement}
            />
          ))}
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selection</h4>
          {elementTypes.slice(8, 11).map((elementType) => (
            <DraggableElement
              key={elementType.type}
              elementType={elementType}
              onAddElement={onAddElement}
            />
          ))}
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced</h4>
          {elementTypes.slice(11).map((elementType) => (
            <DraggableElement
              key={elementType.type}
              elementType={elementType}
              onAddElement={onAddElement}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
