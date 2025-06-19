'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Form } from '@/types/form'

interface FormBuilderHeaderProps {
  form: Partial<Form>
  isDirty: boolean
  onSave: () => void
  onPreview: () => void
  onPublish: () => void
}

export function FormBuilderHeader({
  form,
  isDirty,
  onSave,
  onPreview,
  onPublish,
}: FormBuilderHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {form.title || 'Untitled Form'}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>
                {form.status === 'draft' && 'Draft'}
                {form.status === 'published' && 'Published'}
                {form.status === 'archived' && 'Archived'}
              </span>
              {isDirty && <span>• Unsaved changes</span>}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onPreview}
            className="btn-secondary inline-flex items-center"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </button>
          
          <button
            onClick={onSave}
            className="btn-secondary"
            disabled={!isDirty}
          >
            Save
          </button>
          
          <button
            onClick={onPublish}
            className="btn-primary inline-flex items-center"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
