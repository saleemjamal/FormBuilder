export interface FormElement {
  id: string
  type: FormElementType
  label: string
  placeholder?: string
  required: boolean
  validation?: ValidationRules
  options?: FormElementOption[]
  repeatable: boolean
  position: number
}

export type FormElementType = 
  | 'text'
  | 'number'
  | 'email'
  | 'url'
  | 'date'
  | 'datetime'
  | 'time'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'image'
  | 'dynamic_dropdown'
  | 'repeating_section'

export interface FormElementOption {
  id: string
  value: string
  label: string
}

export interface ValidationRules {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  customMessage?: string
}

export interface FormBranding {
  primaryColor?: string
  secondaryColor?: string
  logo?: string
  fontFamily?: string
  customCss?: string
}

export interface Form {
  id: string;
  title: string;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  branding?: FormBranding | null;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  elements?: FormElement[];
}

export interface FormBuilderState {
  form: Partial<Form>
  selectedElement: string | null
  draggedElement: FormElement | null
  isDirty: boolean
}

export interface DraggedElementData {
  type: 'new' | 'existing'
  elementType?: FormElementType
  element?: FormElement
}

export interface DropZoneData {
  position: number
  sectionId?: string
}
