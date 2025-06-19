'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/auth/AuthModal'

export function FormBuilderHero() {
  const router = useRouter()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCreateForm = () => {
    if (user) {
      router.push('/builder/new')
    } else {
      setShowAuthModal(true)
    }
  }

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Dynamic Forms',
      description: 'Create forms with repeating sections, conditional logic, and database-driven dropdowns'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track submissions, analyze data, and export results with powerful filtering options'
    },
    {
      icon: PlusIcon,
      title: 'Easy Builder',
      description: 'Drag-and-drop interface with real-time preview and custom branding options'
    }
  ]

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-100 opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Content */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Build Forms
            <span className="text-primary-600"> Beyond Limits</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create sophisticated data collection forms with repeating sections, 
            dynamic dropdowns, and advanced validation. Go beyond Google Forms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleCreateForm}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <PlusIcon className="w-6 h-6 mr-2" />
              Create Form
            </button>
            {user && (
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}
