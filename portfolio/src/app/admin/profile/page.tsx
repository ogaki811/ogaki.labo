'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProfile } from '@/lib/data'
import type { Profile } from '@/types/portfolio'

export default function AdminProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    const email = localStorage.getItem('admin_email')
    
    if (!token || !email) {
      router.push('/admin/login' as any)
      return
    }

    setIsAuthenticated(true)
    loadProfile()
  }, [router])

  const loadProfile = async () => {
    try {
      const profileData = await getProfile()
      setProfile(profileData)
      setEditedProfile({ ...profileData })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (!editedProfile) return
    
    if (field === 'contact') {
      // Handle nested contact object
      return
    }
    
    setEditedProfile({
      ...editedProfile,
      [field]: value
    })
  }

  const handleContactChange = (field: keyof Profile['contact'], value: string) => {
    if (!editedProfile) return
    
    setEditedProfile({
      ...editedProfile,
      contact: {
        ...editedProfile.contact,
        [field]: value
      }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)

    // In a real application, you would upload the file to your server here
    // For demo purposes, we'll just use the current image path
  }

  const handleSave = async () => {
    if (!editedProfile) return

    setIsSaving(true)
    
    try {
      // In a real application, this would call an API to save the profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setProfile({ ...editedProfile })
      setImagePreview(null)
      alert('プロフィールを更新しました')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (profile) {
      setEditedProfile({ ...profile })
      setImagePreview(null)
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!editedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">プロフィールデータの読み込みに失敗しました</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href={"/admin" as any} className="text-blue-600 hover:text-blue-800 mr-4">
                ← ダッシュボード
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">プロフィール管理</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                プロフィール画像
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={imagePreview || editedProfile.image || '/uploads/profile-photo.jpg'}
                    alt="プロフィール画像"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                  {imagePreview && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    画像を変更
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG、PNG形式で5MB以下
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                名前
              </label>
              <input
                type="text"
                id="name"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                肩書き
              </label>
              <input
                type="text"
                id="title"
                value={editedProfile.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                自己紹介
              </label>
              <textarea
                id="bio"
                rows={4}
                value={editedProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editedProfile.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={editedProfile.contact.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    value={editedProfile.contact.linkedin}
                    onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    id="github"
                    value={editedProfile.contact.github}
                    onChange={(e) => handleContactChange('github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">プレビュー</h4>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={imagePreview || editedProfile.image || '/uploads/profile-photo.jpg'}
                    alt="プロフィール画像"
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900">
                      {editedProfile.name}
                    </h5>
                    <p className="text-gray-600">{editedProfile.title}</p>
                  </div>
                </div>
                <p className="text-gray-700">{editedProfile.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}