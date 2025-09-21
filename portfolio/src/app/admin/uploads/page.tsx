'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { UPLOAD_CONFIG } from '@/lib/constants'
import { formatFileSize } from '@/lib/utils'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  usedIn: string[]
}

export default function AdminUploadsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    const email = localStorage.getItem('admin_email')
    
    if (!token || !email) {
      router.push('/admin/login' as any)
      return
    }

    setIsAuthenticated(true)
    loadFiles()
  }, [router])

  const loadFiles = async () => {
    try {
      // Mock uploaded files data
      const mockFiles: UploadedFile[] = [
        {
          id: 'file-1',
          name: 'project-1-1.jpg',
          size: 1024 * 500, // 500KB
          type: 'image/jpeg',
          url: '/uploads/project-1-1.jpg',
          uploadedAt: '2024-01-15T10:30:00Z',
          usedIn: ['ECサイトリニューアルプロジェクト']
        },
        {
          id: 'file-2',
          name: 'project-1-2.jpg',
          size: 1024 * 750, // 750KB
          type: 'image/jpeg',
          url: '/uploads/project-1-2.jpg',
          uploadedAt: '2024-01-15T10:31:00Z',
          usedIn: ['ECサイトリニューアルプロジェクト']
        },
        {
          id: 'file-3',
          name: 'profile-photo.jpg',
          size: 1024 * 300, // 300KB
          type: 'image/jpeg',
          url: '/uploads/profile-photo.jpg',
          uploadedAt: '2024-01-10T14:20:00Z',
          usedIn: ['プロフィール']
        }
      ]
      setFiles(mockFiles)
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileUpload(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFileUpload(selectedFiles)
  }

  const handleFileUpload = async (filesToUpload: File[]) => {
    setIsUploading(true)
    
    try {
      for (const file of filesToUpload) {
        // Validate file type
        if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
          alert(`${file.name}: サポートされていないファイル形式です`)
          continue
        }
        
        // Validate file size
        if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
          alert(`${file.name}: ファイルサイズが大きすぎます (最大${formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)})`)
          continue
        }

        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add to files list
        const newFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // In real app, this would be the uploaded URL
          uploadedAt: new Date().toISOString(),
          usedIn: []
        }
        
        setFiles(prev => [newFile, ...prev])
      }
      
      alert(`${filesToUpload.length}件のファイルをアップロードしました`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('アップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId)
      } else {
        return [...prev, fileId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return
    
    if (confirm(`選択した${selectedFiles.length}件のファイルを削除しますか？`)) {
      setFiles(files.filter(f => !selectedFiles.includes(f.id)))
      setSelectedFiles([])
      alert('ファイルを削除しました')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URLをクリップボードにコピーしました')
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
              <h1 className="text-2xl font-bold text-gray-900">画像管理</h1>
            </div>
            <div className="flex items-center space-x-3">
              {selectedFiles.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  選択削除 ({selectedFiles.length})
                </button>
              )}
              <input
                type="file"
                multiple
                accept={UPLOAD_CONFIG.ALLOWED_TYPES.join(',')}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ファイルを選択
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">アップロード中...</p>
            </div>
          ) : (
            <div>
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-gray-600 mb-4">
                または<label htmlFor="file-upload" className="text-blue-600 cursor-pointer">ファイルを選択</label>
              </p>
              <p className="text-sm text-gray-500">
                {UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')} 形式、最大{formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}
              </p>
            </div>
          )}
        </div>

        {/* Search and Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ファイル名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4 ml-6">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedFiles.length === filteredFiles.length ? 'すべて解除' : 'すべて選択'}
              </button>
              <span className="text-sm text-gray-600">
                {filteredFiles.length}件のファイル
              </span>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ファイルがありません
            </h3>
            <p className="text-gray-600">
              上のエリアにファイルをドラッグ&ドロップしてアップロードしてください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-4">
                  {/* Checkbox */}
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="URLをコピー"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('ja-JP')}
                    </p>
                    {file.usedIn.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">使用先:</span>
                        <div className="mt-1">
                          {file.usedIn.map((usage, index) => (
                            <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded mr-1 mb-1">
                              {usage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}