"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Form, FormElement } from '@/types/form'
import toast from 'react-hot-toast'

export default function PublicFormPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter()
  const [form, setForm] = useState<Form | null>(null)
  const [elements, setElements] = useState<FormElement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState<Record<string, any>>({})

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true)
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()
      if (formError || !formData) {
        toast.error('Form not found or not published')
        setLoading(false)
        return
      }
      setForm(formData)
      const { data: elementsData, error: elementsError } = await supabase
        .from('form_elements')
        .select('*')
        .eq('form_id', id)
        .order('position', { ascending: true })
      if (elementsError) {
        toast.error('Failed to load form elements')
        setLoading(false)
        return
      }
      setElements(elementsData || [])
      setLoading(false)
    }
    fetchForm()
  }, [id])

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Insert into form_submissions
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({ form_id: id })
      .select()
      .single()
    if (submissionError || !submission) {
      toast.error('Failed to submit form')
      setSubmitting(false)
      return
    }
    // Insert responses
    const responses = elements.map(el => ({
      submission_id: submission.id,
      element_id: el.id,
      value: values[el.id] ?? null,
    }))
    const { error: responsesError } = await supabase
      .from('submission_responses')
      .insert(responses)
    if (responsesError) {
      toast.error('Failed to save responses')
      setSubmitting(false)
      return
    }
    toast.success('Form submitted!')
    setSubmitting(false)
    router.push('/') // Or redirect to a thank you page
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  if (!form) {
    return <div className="min-h-screen flex items-center justify-center">Form not found or not published.</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-xl" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        <p className="mb-6 text-gray-600">{form.description}</p>
        {elements.map(el => (
          <div key={el.id} className="mb-4">
            <label className="block font-medium mb-1">
              {el.label}
              {el.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {el.type === 'text' && (
              <input type="text" className="form-input w-full" required={el.required} placeholder={el.placeholder || ''} value={values[el.id] || ''} onChange={e => handleChange(el.id, e.target.value)} />
            )}
            {el.type === 'number' && (
              <input type="number" className="form-input w-full" required={el.required} placeholder={el.placeholder || ''} value={values[el.id] || ''} onChange={e => handleChange(el.id, e.target.value)} />
            )}
            {el.type === 'textarea' && (
              <textarea className="form-input w-full" required={el.required} placeholder={el.placeholder || ''} value={values[el.id] || ''} onChange={e => handleChange(el.id, e.target.value)} />
            )}
            {el.type === 'select' && el.options && (
              <select className="form-input w-full" required={el.required} value={values[el.id] || ''} onChange={e => handleChange(el.id, e.target.value)}>
                <option value="">Select...</option>
                {Array.isArray(el.options) ? JSON.parse(typeof el.options === 'string' ? el.options : JSON.stringify(el.options)).map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                )) : null}
              </select>
            )}
            {el.type === 'radio' && el.options && (
              <div>
                {Array.isArray(el.options) ? JSON.parse(typeof el.options === 'string' ? el.options : JSON.stringify(el.options)).map((opt: any) => (
                  <label key={opt.value} className="inline-flex items-center mr-4">
                    <input type="radio" name={el.id} value={opt.value} checked={values[el.id] === opt.value} onChange={e => handleChange(el.id, opt.value)} required={el.required} />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                )) : null}
              </div>
            )}
            {el.type === 'checkbox' && el.options && (
              <div>
                {Array.isArray(el.options) ? JSON.parse(typeof el.options === 'string' ? el.options : JSON.stringify(el.options)).map((opt: any) => (
                  <label key={opt.value} className="inline-flex items-center mr-4">
                    <input type="checkbox" value={opt.value} checked={Array.isArray(values[el.id]) && values[el.id].includes(opt.value)} onChange={e => {
                      const checked = e.target.checked
                      setValues(prev => {
                        const arr = Array.isArray(prev[el.id]) ? prev[el.id] : []
                        if (checked) return { ...prev, [el.id]: [...arr, opt.value] }
                        else return { ...prev, [el.id]: arr.filter((v: any) => v !== opt.value) }
                      })
                    }} />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                )) : null}
              </div>
            )}
            {/* Add more field types as needed */}
          </div>
        ))}
        <button type="submit" className="btn-primary w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  )
} 