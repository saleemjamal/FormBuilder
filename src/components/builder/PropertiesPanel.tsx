'use client'

import { useState, useEffect } from 'react'
import { Form, FormElement } from '@/types/form'
import { FormElementOption } from '@/types/form'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface PropertiesPanelProps {
  form: Partial<Form>
  selectedElement: string | null
  elements: FormElement[]
  onUpdateForm: (updates: Partial<Form>) => void
  onUpdateElement: (elementId: string, updates: Partial<FormElement>) => void
}

export function PropertiesPanel({
  form,
  selectedElement,
  elements,
  onUpdateForm,
  onUpdateElement,
}: PropertiesPanelProps) {
  console.log('PropertiesPanel selectedElement:', selectedElement)
  const currentElement = elements.find(el => el.id === selectedElement)
  console.log('PropertiesPanel currentElement:', currentElement)
  const [activeTab, setActiveTab] = useState<'form' | 'element'>('form')
  
  // Always switch to element tab when a new element is selected
  useEffect(() => {
    if (selectedElement && currentElement) {
      setActiveTab('element')
    } else {
      setActiveTab('form')
    }
  }, [selectedElement, currentElement])

  const addOption = () => {
    if (!currentElement) return
    
    const newOption: FormElementOption = {
      id: `option-${Date.now()}`,
      value: `option-${(currentElement.options?.length || 0) + 1}`,
      label: `Option ${(currentElement.options?.length || 0) + 1}`,
    }
    
    onUpdateElement(currentElement.id, {
      options: [...(currentElement.options || []), newOption]
    })
  }

  const updateOption = (index: number, updates: Partial<FormElementOption>) => {
    if (!currentElement?.options) return
    
    const updatedOptions = currentElement.options.map((option, i) =>
      i === index ? { ...option, ...updates } : option
    )
    
    onUpdateElement(currentElement.id, { options: updatedOptions })
  }

  const removeOption = (index: number) => {
    if (!currentElement?.options) return
    
    const updatedOptions = currentElement.options.filter((_, i) => i !== index)
    onUpdateElement(currentElement.id, { options: updatedOptions })
  }

  // Options for select/radio/checkbox
  const hasOptions = currentElement && ['select', 'radio', 'checkbox'].includes(currentElement.type);

  return (
    <div className="space-y-6">
      {/* Form Settings Tab */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Form Settings
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="form-label">Description</label>
              <input
                type="text"
                value={form.description || ''}
                onChange={e => onUpdateForm({ description: e.target.value })}
                className="form-input"
                placeholder="Enter form description"
              />
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                value={form.status || 'draft'}
                onChange={(e) => onUpdateForm({ status: e.target.value as any })}
                className="form-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Branding Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Branding</h4>
            <div className="space-y-4">
              <div>
                <label className="form-label">Primary Color</label>
                <input
                  type="color"
                  value={form.branding?.primaryColor || '#3b82f6'}
                  onChange={(e) => onUpdateForm({
                    branding: { ...form.branding, primaryColor: e.target.value }
                  })}
                  className="form-input h-10"
                />
              </div>

              <div>
                <label className="form-label">Logo URL</label>
                <input
                  type="url"
                  value={form.branding?.logo || ''}
                  onChange={(e) => onUpdateForm({
                    branding: { ...form.branding, logo: e.target.value }
                  })}
                  className="form-input"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Element Settings Tab */}
      {activeTab === 'element' && (
        <div className="space-y-6">
          {currentElement ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Element Settings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Editing: {currentElement.type} field
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Label</label>
                  <input
                    type="text"
                    value={currentElement.label}
                    onChange={(e) => onUpdateElement(currentElement.id, { label: e.target.value })}
                    className="form-input"
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <label className="form-label">Placeholder</label>
                  <input
                    type="text"
                    value={currentElement.placeholder || ''}
                    onChange={(e) => onUpdateElement(currentElement.id, { placeholder: e.target.value })}
                    className="form-input"
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentElement.required}
                      onChange={(e) => onUpdateElement(currentElement.id, { required: e.target.checked })}
                      className="text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Required field</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentElement.repeatable}
                      onChange={(e) => onUpdateElement(currentElement.id, { repeatable: e.target.checked })}
                      className="text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Repeatable</span>
                  </label>
                </div>
              </div>

              {/* Options for select/radio/checkbox */}
              {hasOptions && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900">Options</h4>
                    <button
                      onClick={addOption}
                      className="btn-primary text-sm py-1 px-2 inline-flex items-center"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentElement.options?.map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => updateOption(index, { label: e.target.value })}
                          className="form-input flex-1"
                          placeholder="Option label"
                        />
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateOption(index, { value: e.target.value })}
                          className="form-input w-24"
                          placeholder="Value"
                        />
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Rules */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Validation</h4>
                <div className="space-y-4">
                  {(['text', 'textarea'].includes(currentElement.type)) && (
                    <>
                      <div>
                        <label className="form-label">Min Length</label>
                        <input
                          type="number"
                          value={currentElement.validation?.minLength || ''}
                          onChange={(e) => onUpdateElement(currentElement.id, {
                            validation: {
                              ...currentElement.validation,
                              minLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                          className="form-input"
                          placeholder="Minimum characters"
                        />
                      </div>
                      <div>
                        <label className="form-label">Max Length</label>
                        <input
                          type="number"
                          value={currentElement.validation?.maxLength || ''}
                          onChange={(e) => onUpdateElement(currentElement.id, {
                            validation: {
                              ...currentElement.validation,
                              maxLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                          className="form-input"
                          placeholder="Maximum characters"
                        />
                      </div>
                    </>
                  )}
                  {currentElement.type === 'number' && (
                    <>
                      <div>
                        <label className="form-label">Minimum Value</label>
                        <input
                          type="number"
                          value={currentElement.validation?.min || ''}
                          onChange={(e) => onUpdateElement(currentElement.id, {
                            validation: {
                              ...currentElement.validation,
                              min: e.target.value ? parseFloat(e.target.value) : undefined
                            }
                          })}
                          className="form-input"
                          placeholder="Minimum value"
                        />
                      </div>
                      <div>
                        <label className="form-label">Maximum Value</label>
                        <input
                          type="number"
                          value={currentElement.validation?.max || ''}
                          onChange={(e) => onUpdateElement(currentElement.id, {
                            validation: {
                              ...currentElement.validation,
                              max: e.target.value ? parseFloat(e.target.value) : undefined
                            }
                          })}
                          className="form-input"
                          placeholder="Maximum value"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select an element to edit its properties</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
