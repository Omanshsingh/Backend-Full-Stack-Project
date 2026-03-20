import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import axios from 'axios'

const normalizePost = (post) => ({
  id: post._id || post.id,
  img: post.Image || post.img,
  caption: post.caption,
})

const PostCard = ({ post, index }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount] = useState(Math.floor(Math.random() * 120) + 1)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <article className="post-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="post-image-wrap">
        {!imageLoaded && <div className="image-skeleton" />}
        <img
          src={post.img}
          alt={post.caption}
          className={`post-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="post-overlay">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(!liked)}
            aria-label="Like post"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{liked ? likeCount + 1 : likeCount}</span>
          </button>
        </div>
      </div>
      {post.caption && (
        <div className="post-caption-wrap">
          <p className="post-caption">{post.caption}</p>
        </div>
      )}
    </article>
  )
}

const Feed = () => {
  const location = useLocation()
  const initialNewPost = location.state?.newPost ? normalizePost(location.state.newPost) : null

  const [posts, setPosts] = useState(() => (initialNewPost ? [initialNewPost] : []))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    axios.get(`${import.meta.env.VITE_API_URL}/posts`)
      .then((response) => {
        if (cancelled) return

        const fetched = response.data?.posts ?? []
        const normalized = fetched.map(normalizePost)

        if (initialNewPost) {
          const alreadyIncluded = normalized.some((p) => p.id === initialNewPost.id)
          setPosts(alreadyIncluded ? normalized : [initialNewPost, ...normalized])
        } else {
          setPosts(normalized)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1 className="feed-title">Your Feed</h1>
        <p className="feed-subtitle">See what's been shared lately</p>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <h2>Nothing here yet</h2>
          <p>Be the first to share something beautiful</p>
          <Link to="/create-post" className="empty-cta">Create a post</Link>
        </div>
      )}
    </div>
  )
}

export default Feed