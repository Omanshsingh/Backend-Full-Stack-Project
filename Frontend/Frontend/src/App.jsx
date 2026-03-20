import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import CreatePost from "./Pages/CreatePost.jsx";
import Feed from "./Pages/Feed.jsx";

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/feed" className="navbar-logo">
          <span className="logo-icon">✦</span>
          Postly
        </Link>
        <div className="navbar-links">
          <Link
            to="/feed"
            className={`nav-link ${location.pathname === "/feed" ? "active" : ""}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Feed
          </Link>
          <Link
            to="/create-post"
            className={`nav-link create-btn ${
              location.pathname === "/create-post" || location.pathname === "/createpost"
                ? "active"
                : ""
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Post
          </Link>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route
              path="*"
              element={
                <div className="empty-state">
                  <div className="empty-icon">✦</div>
                  <h2>Page not found</h2>
                  <p>This page doesn't exist</p>
                  <Link to="/feed" className="empty-cta">Go to Feed</Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;