'use client'

import { useDrop } from 'react-dnd'
import { PlusIcon } from '@heroicons/react/24/outline'

interface DropZoneProps {
  position: number
  onDrop: (elementType: string) => void
}

export function DropZone({ position, onDrop }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: { elementType: string }) => {
      onDrop(item.elementType)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`
        relative h-8 flex items-center justify-center
        transition-all duration-200 opacity-0 hover:opacity-100
        ${isOver && canDrop ? 'opacity-100 h-16' : ''}
      `}
    >
      <div
        className={`
          w-full h-1 rounded-full transition-all duration-200
          ${isOver && canDrop 
            ? 'bg-primary-500 h-8 flex items-center justify-center' 
            : 'bg-gray-300'
          }
        `}
      >
        {isOver && canDrop && (
          <div className="flex items-center space-x-2 text-white text-sm font-medium">
            <PlusIcon className="w-4 h-4" />
            <span>Drop element here</span>
          </div>
        )}
      </div>
    </div>
  )
}
