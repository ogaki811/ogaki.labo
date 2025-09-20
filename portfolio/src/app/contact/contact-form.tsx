'use client'

import { useState } from 'react'
import { CONTACT_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants'

interface FormData {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  hp_field: string // Honeypot field for spam protection
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    hp_field: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitTime] = useState(Date.now())

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (!formData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL
    }

    if (!formData.subject.trim()) {
      newErrors.subject = ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (!formData.message.trim()) {
      newErrors.message = ERROR_MESSAGES.REQUIRED_FIELD
    } else if (formData.message.length > CONTACT_CONFIG.MAX_MESSAGE_LENGTH) {
      newErrors.message = `メッセージは${CONTACT_CONFIG.MAX_MESSAGE_LENGTH}文字以内で入力してください`
    }

    // Spam protection checks
    if (formData.hp_field) {
      newErrors.general = 'スパムの可能性があります'
    }

    const formFillTime = Date.now() - submitTime
    if (formFillTime < CONTACT_CONFIG.SPAM_PROTECTION.MIN_FORM_TIME) {
      newErrors.general = 'フォームの送信が早すぎます'
    }

    if (formFillTime > CONTACT_CONFIG.SPAM_PROTECTION.MAX_FORM_TIME) {
      newErrors.general = 'フォームのセッションが期限切れです'
    }

    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // In a real application, this would send to an API endpoint
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: ERROR_MESSAGES.NETWORK_ERROR })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          メッセージを送信しました
        </h3>
        <p className="text-gray-600 mb-6">
          お問い合わせありがとうございます。24時間以内にご返信いたします。
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({
              name: '',
              email: '',
              company: '',
              subject: '',
              message: '',
              hp_field: ''
            })
          }}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          新しいメッセージを送る
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="hp_field"
        value={formData.hp_field}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="山田太郎"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="example@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          会社名・組織名
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="株式会社サンプル"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          件名 <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.subject ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">件名を選択してください</option>
          <option value="job-opportunity">転職・採用に関するお話</option>
          <option value="project-consultation">プロジェクトのご相談</option>
          <option value="freelance-work">業務委託・フリーランス案件</option>
          <option value="technical-consultation">技術コンサルティング</option>
          <option value="speaking-event">講演・イベント登壇</option>
          <option value="mentoring">メンタリング・コーチング</option>
          <option value="collaboration">コラボレーション</option>
          <option value="other">その他</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          メッセージ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            errors.message ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="お問い合わせ内容を詳しくお聞かせください..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message ? (
            <p className="text-sm text-red-600">{errors.message}</p>
          ) : (
            <div></div>
          )}
          <p className="text-sm text-gray-500">
            {formData.message.length}/{CONTACT_CONFIG.MAX_MESSAGE_LENGTH}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              送信中...
            </div>
          ) : (
            'メッセージを送信'
          )}
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          送信いただいた情報は、お問い合わせ対応のみに使用し、
          第三者への提供は行いません。
        </p>
      </div>
    </form>
  )
}