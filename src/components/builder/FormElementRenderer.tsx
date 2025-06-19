'use client'

import { FormElement } from '@/types/form'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface FormElementRendererProps {
  element: FormElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormElement>) => void
  onRemove: () => void
}

export function FormElementRenderer({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
}: FormElementRendererProps) {
  const renderInput = () => {
    const baseClasses = "form-input w-full"
    
    switch (element.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={element.placeholder || 'Enter text...'}
            className={baseClasses}
            disabled
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder || 'Enter text...'}
            className={`${baseClasses} min-h-[100px]`}
            disabled
          />
        )
      case 'number':
        return (
          <input
            type="number"
            placeholder={element.placeholder || 'Enter number...'}
            className={baseClasses}
            disabled
          />
        )
      case 'email':
        return (
          <input
            type="email"
            placeholder={element.placeholder || 'Enter email...'}
            className={baseClasses}
            disabled
          />
        )
      case 'url':
        return (
          <input
            type="url"
            placeholder={element.placeholder || 'Enter URL...'}
            className={baseClasses}
            disabled
          />
        )
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            disabled
          />
        )
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className={baseClasses}
            disabled
          />
        )
      case 'time':
        return (
          <input
            type="time"
            className={baseClasses}
            disabled
          />
        )
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option>Choose an option...</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={element.id}
                  value={option.value}
                  className="text-primary-600"
                  disabled
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  className="text-primary-600 rounded"
                  disabled
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )
      case 'file':
      case 'image':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">Click to upload or drag files here</p>
          </div>
        )
      case 'dynamic_dropdown':
        return (
          <select className={baseClasses} disabled>
            <option>Loading options...</option>
          </select>
        )
      case 'repeating_section':
        return (
          <div className="border-2 border-dashed border-primary-300 rounded-lg p-4">
            <p className="text-primary-600 font-medium mb-2">Repeating Section</p>
            <p className="text-gray-500 text-sm">
              Users can add multiple instances of this section
            </p>
          </div>
        )
      default:
        return (
          <input
            type="text"
            placeholder="Unknown field type"
            className={baseClasses}
            disabled
          />
        )
    }
  }
  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={onSelect}
    >
      {/* Element Controls */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Open properties panel (already selected)
            }}
            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
          >
            <PencilIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1 bg-white rounded shadow-sm hover:bg-red-50 text-red-600"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Element Label */}
      <div className="mb-2">
        <label className="form-label">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Element Input */}
      {renderInput()}

      {/* Repeatable indicator */}
      {element.repeatable && (
        <div className="mt-2 text-xs text-primary-600 font-medium">
          ↻ Repeatable field
        </div>
      )}
    </div>
  )
}
