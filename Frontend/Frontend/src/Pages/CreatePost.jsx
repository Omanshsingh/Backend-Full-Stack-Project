import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)
  const fileDataRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    fileDataRef.current = file
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fileDataRef.current) return

    setLoading(true)
    const formData = new FormData()
    formData.append('caption', caption)
    formData.append('image', fileDataRef.current)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-post`, formData)
      const createdPost = response.data?.post
      if (createdPost) {
        navigate('/feed', { state: { newPost: createdPost } })
      } else {
        navigate('/feed')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      const message = error.response?.data?.message || error.message
      alert(`Failed to create post: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-page">
      <div className="create-card">
        <div className="create-header">
          <h1 className="create-title">New Post</h1>
          <p className="create-subtitle">Share a moment with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="preview-img" />
                <div className="preview-overlay">
                  <span>Change photo</span>
                </div>
              </>
            ) : (
              <div className="drop-placeholder">
                <div className="drop-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="drop-text">Drop your photo here</p>
                <p className="drop-sub">or click to browse</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          <div className="caption-group">
            <label className="caption-label" htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              className="caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something about this moment..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !preview}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Share Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost