'use client'

import { useState, useEffect, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAuth } from '@/hooks/useAuth'
import { Form, FormElement, FormBuilderState } from '@/types/form'
import { ElementPalette } from './ElementPalette'
import { FormCanvas } from './FormCanvas'
import { PropertiesPanel } from './PropertiesPanel'
import { FormBuilderHeader } from './FormBuilderHeader'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface FormBuilderProps {
  formId?: string
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const { user } = useAuth()
  const [builderState, setBuilderState] = useState<FormBuilderState>({
    form: {
      title: 'Untitled Form',
      description: '',
      status: 'draft',
      elements: [],
      version: 1,
    },
    selectedElement: null,
    draggedElement: null,
    isDirty: false,
  })

  useEffect(() => {
    if (formId && formId !== 'new') {
      loadForm(formId)
    }
  }, [formId])

  const loadForm = async (id: string) => {
    // TODO: Implement form loading from Supabase
    console.log('Loading form:', id)
  }

  const addElement = (elementType: string, position: number) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type: elementType as any,
      label: `New ${elementType}`,
      placeholder: '',
      required: false,
      repeatable: false,
      position,
    }

    setBuilderState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        elements: [
          ...prev.form.elements!.slice(0, position),
          newElement,
          ...prev.form.elements!.slice(position)
        ].map((el, idx) => ({ ...el, position: idx }))
      },
      selectedElement: newElement.id,
      isDirty: true,
    }))
  }
  const updateElement = (elementId: string, updates: Partial<FormElement>) => {
    setBuilderState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        elements: prev.form.elements!.map(el =>
          el.id === elementId ? { ...el, ...updates } : el
        )
      },
      isDirty: true,
    }))
  }

  const removeElement = (elementId: string) => {
    setBuilderState(prev => ({
      ...prev,
      form: {
        ...prev.form,
        elements: prev.form.elements!.filter(el => el.id !== elementId)
          .map((el, idx) => ({ ...el, position: idx }))
      },
      selectedElement: prev.selectedElement === elementId ? null : prev.selectedElement,
      isDirty: true,
    }))
  }

  const moveElement = (fromIndex: number, toIndex: number) => {
    setBuilderState(prev => {
      const elements = [...prev.form.elements!]
      const [movedElement] = elements.splice(fromIndex, 1)
      elements.splice(toIndex, 0, movedElement)
      
      return {
        ...prev,
        form: {
          ...prev.form,
          elements: elements.map((el, idx) => ({ ...el, position: idx }))
        },
        isDirty: true,
      }
    })
  }

  const selectElement = (elementId: string | null) => {
    setBuilderState(prev => ({ ...prev, selectedElement: elementId }))
  }

  // Save form and elements to Supabase
  const saveForm = async (statusOverride?: 'draft' | 'published' | 'archived') => {
    if (!user) {
      console.log('User not authenticated')
      return
    }
    const { elements, ...formWithoutElements } = builderState.form;
    const formToSave = {
      ...formWithoutElements,
      status: statusOverride || builderState.form.status || 'draft',
      created_by: user.id,
    }
    let formId = builderState.form.id
    let upsertedForm
    try {
      // Upsert form
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .upsert([formToSave], { onConflict: 'id' })
        .select()
      if (formError) throw formError
      upsertedForm = formData && formData[0]
      formId = upsertedForm?.id || formId
      // Upsert form elements
      if (formId && builderState.form.elements) {
        // Remove all existing elements for this form (for simplicity)
        await supabase.from('form_elements').delete().eq('form_id', formId)
        // Insert all elements
        const elementsToInsert = builderState.form.elements.map(el => ({
          ...el,
          form_id: formId,
          options: el.options ? JSON.stringify(el.options) : null,
          validation: el.validation ? JSON.stringify(el.validation) : null,
        }))
        if (elementsToInsert.length > 0) {
          const { error: elError } = await supabase.from('form_elements').insert(elementsToInsert)
          if (elError) throw elError
        }
      }
      setBuilderState(prev => ({ ...prev, form: { ...prev.form, id: formId }, isDirty: false }))
      console.log('Form saved successfully!')
      toast.success('Form saved successfully!')
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error saving form:', err.message, err.stack);
        toast.error(`Error saving form: ${err.message}`)
      } else {
        console.error('Error saving form:', JSON.stringify(err, null, 2));
        toast.error('Error saving form!')
      }
    }
  }

  // Debounced auto-save (10s)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (builderState.isDirty) {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      saveTimeout.current = setTimeout(() => {
        saveForm()
      }, 10000)
    }
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [builderState.form, builderState.isDirty])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <FormBuilderHeader
          form={builderState.form}
          isDirty={builderState.isDirty}
          onSave={() => saveForm('draft')}
          onPreview={() => {/* TODO: Implement preview */}}
          onPublish={() => saveForm('published')}
          onUpdateForm={(updates) => setBuilderState(prev => ({
            ...prev,
            form: { ...prev.form, ...updates },
            isDirty: true,
          }))}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Element Palette */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <ElementPalette onAddElement={addElement} />
          </div>

          {/* Center - Form Canvas */}
          <div className="flex-1 overflow-y-auto">
            <FormCanvas
              elements={builderState.form.elements || []}
              selectedElement={builderState.selectedElement}
              onSelectElement={selectElement}
              onAddElement={addElement}
              onUpdateElement={updateElement}
              onRemoveElement={removeElement}
              onMoveElement={moveElement}
            />
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertiesPanel
              form={builderState.form}
              selectedElement={builderState.selectedElement}
              elements={builderState.form.elements || []}
              onUpdateForm={(updates) => setBuilderState(prev => ({
                ...prev,
                form: { ...prev.form, ...updates },
                isDirty: true,
              }))}
              onUpdateElement={updateElement}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
