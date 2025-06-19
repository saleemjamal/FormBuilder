'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, DocumentTextIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Form } from '@/types/form'
import toast from 'react-hot-toast'

export function DashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchForms()
    }
  }, [user])

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('created_by', user?.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setForms(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch forms')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId)

      if (error) throw error
      
      setForms(forms.filter(form => form.id !== formId))
      toast.success('Form deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete form')
      console.error('Error:', error)
    }
  }
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your forms and view submissions</p>
          </div>
          <button
            onClick={() => router.push('/builder/new')}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Form
          </button>
        </div>
        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">Create your first form to get started</p>
            <button
              onClick={() => router.push('/builder/new')}
              className="btn-primary"
            >
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div key={form.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {form.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {form.description || 'No description'}
                    </p>
                  </div>
                  <span className={getStatusBadge(form.status)}>
                    {form.status}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Updated {new Date(form.updated_at).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/forms/${form.id}`)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/builder/${form.id}`)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
