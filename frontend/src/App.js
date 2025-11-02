import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapPin, Navigation, LogOut } from "lucide-react";

// Styles
const styles = `
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .leaflet-container {
    height: 100vh !important;
    width: 100vw !important;
    z-index: 1 !important;
  }
  
  .top-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10000;
  }
  
  .control-row {
    display: flex;
    gap: 10px;
  }
  
  .button {
    padding: 10px 16px;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: all 0.2s;
  }
  
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .login-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .register-btn {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  .location-btn {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  .logout-btn {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }
  
  .user-info {
    background: white;
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-weight: 600;
    color: #333;
  }
  
  .authOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 19999;
    animation: fadeIn 0.3s;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .authCard {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 16px;
    width: 340px;
    z-index: 20000;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -45%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  
  .authCard h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  
  .authCard input {
    width: 100%;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 15px;
    font-size: 14px;
    transition: border 0.2s;
  }
  
  .authCard input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .authCard .submit-btn {
    width: 100%;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
    transition: transform 0.2s;
  }
  
  .authCard .submit-btn:hover {
    transform: translateY(-2px);
  }
  
  .authClose {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    color: #999;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }
  
  .authClose:hover {
    background: #f0f0f0;
    color: #333;
  }
  
  .card {
    min-width: 220px;
  }
  
  .card label {
    font-weight: 600;
    font-size: 11px;
    color: #667eea;
    margin-top: 8px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .card h4 {
    margin: 4px 0 8px 0;
    color: #333;
    font-size: 16px;
  }
  
  .card p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  .rating-stars {
    font-size: 16px;
    margin: 4px 0;
  }
  
  .card .info-text {
    font-size: 13px;
    color: #888;
    margin-top: 8px;
  }
  
  .pin-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 240px;
  }
  
  .pin-form label {
    font-weight: 600;
    font-size: 12px;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .pin-form input,
  .pin-form textarea,
  .pin-form select {
    padding: 8px 10px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .pin-form input:focus,
  .pin-form textarea:focus,
  .pin-form select:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .pin-form textarea {
    min-height: 60px;
    resize: vertical;
  }
  
  .pin-form button {
    padding: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 5px;
  }
  
  .pin-form button:hover {
    transform: translateY(-1px);
  }
  
  .error {
    color: #f5576c;
    font-size: 13px;
    margin-top: 5px;
    font-weight: 500;
  }
  
  .success {
    color: #4caf50;
    font-size: 13px;
    margin-top: 5px;
    font-weight: 500;
  }
  
  .category-select {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }
  
  .category-btn {
    padding: 6px 12px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
  }
  
  .category-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
  
  .floating-badge {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.5);
    z-index: 10000;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-10px) rotate(5deg);
    }
    50% {
      transform: translateY(0px) rotate(0deg);
    }
    75% {
      transform: translateY(-5px) rotate(-5deg);
    }
  }
  
  .floating-badge:hover {
    transform: scale(1.1) rotate(360deg);
    box-shadow: 0 6px 25px rgba(108, 117, 125, 0.7);
  }
  
  .floating-badge .tooltip {
    position: absolute;
    bottom: 60px;
    right: 0;
    transform: scale(0);
    transform-origin: bottom right;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    opacity: 0;
  }
  
  .floating-badge .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 20px;
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
  
  .floating-badge:hover .tooltip {
    transform: scale(1);
    opacity: 1;
  }
  
  .leaflet-control-attribution {
    display: none !important;
  }
`;

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: "",
  });
};

const currentLocationIcon = L.divIcon({
  html: `<div style="background: #4facfe; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 3px #4facfe40, 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: "",
});

// Map center updater
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// Register Component
function Register({ setShowRegister, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.username === username)) {
      setError("Username already exists!");
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess(true);
    setTimeout(() => {
      setShowRegister(false);
      onRegisterSuccess();
    }, 1000);
  };

  return (
    <>
      <div className="authOverlay" onClick={() => setShowRegister(false)} />
      <div className="authCard">
        <span className="authClose" onClick={() => setShowRegister(false)}>
          ×
        </span>
        <h2>Create Account</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Register
          </button>
          {error && <div className="error">{error}</div>}
          {success && (
            <div className="success">Registration successful! 🎉</div>
          )}
        </div>
      </div>
    </>
  );
}

// Login Component
function Login({ setShowLogin, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", username);
      onLoginSuccess(username);
      setShowLogin(false);
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    <>
      <div className="authOverlay" onClick={() => setShowLogin(false)} />
      <div className="authCard">
        <span className="authClose" onClick={() => setShowLogin(false)}>
          ×
        </span>
        <h2>Welcome Back</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Login
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </>
  );
}

const categories = ["Hotel", "Mall", "Restaurant", "Park", "Hospital", "Other"];

function App() {
  const [currentUsername, setCurrentUsername] = useState(
    localStorage.getItem("currentUser")
  );
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pins, setPins] = useState(
    JSON.parse(localStorage.getItem("pins") || "[]")
  );
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Hotel");
  const [rating, setRating] = useState(3);

  useEffect(() => {
    if (currentUsername && !currentLocation) {
      getCurrentLocation();
    }
  }, [currentUsername]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setCurrentLocation({ lat: 17.385, lng: 78.486 });
        }
      );
    } else {
      setCurrentLocation({ lat: 17.385, lng: 78.486 });
    }
  };

  const handleAddPin = () => {
    if (!currentLocation) return;
    setNewPlace(currentLocation);
  };

  const handleSubmit = () => {
    if (!title || !desc) return;

    const newPin = {
      id: Date.now().toString(),
      username: currentUsername,
      title,
      desc,
      category,
      rating: parseInt(rating),
      lat: newPlace.lat,
      lng: newPlace.lng,
      createdAt: new Date().toISOString(),
    };

    const updatedPins = [...pins, newPin];
    setPins(updatedPins);
    localStorage.setItem("pins", JSON.stringify(updatedPins));

    setNewPlace(null);
    setTitle("");
    setDesc("");
    setCategory("Hotel");
    setRating(3);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUsername(null);
    setCurrentLocation(null);
  };

  const getTimeSince = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const mapCenter = currentLocation || { lat: 20.5937, lng: 78.9629 };

  return (
    <>
      <style>{styles}</style>
      <div>
        <div className="top-controls">
          {currentUsername ? (
            <>
              <div className="user-info">👋 Hello, {currentUsername}!</div>
              <div className="control-row">
                <button
                  className="button location-btn"
                  onClick={getCurrentLocation}>
                  <Navigation size={18} />
                  Update Location
                </button>
                <button className="button logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
              <button className="button login-btn" onClick={handleAddPin}>
                <MapPin size={18} />
                Mark This Location
              </button>
            </>
          ) : (
            <div className="control-row">
              <button
                className="button login-btn"
                onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button
                className="button register-btn"
                onClick={() => setShowRegister(true)}>
                Register
              </button>
            </div>
          )}
        </div>

        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={currentLocation ? 13 : 5}
          doubleClickZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapUpdater
            center={
              currentLocation
                ? [currentLocation.lat, currentLocation.lng]
                : null
            }
          />

          {currentLocation && (
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={currentLocationIcon}>
              <Popup>
                <div
                  style={{ padding: "8px", fontWeight: 600, color: "#4facfe" }}>
                  📍 Your Current Location
                </div>
              </Popup>
            </Marker>
          )}

          {pins.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={createCustomIcon(
                currentUsername === p.username ? "#f5576c" : "#667eea"
              )}
              eventHandlers={{
                click: () => setCurrentPlaceId(p.id),
              }}>
              {currentPlaceId === p.id && (
                <Popup onClose={() => setCurrentPlaceId(null)}>
                  <div className="card">
                    <label>{p.category}</label>
                    <h4>{p.title}</h4>
                    <label>Review</label>
                    <p>{p.desc}</p>
                    <label>Rating</label>
                    <div className="rating-stars">{"⭐".repeat(p.rating)}</div>
                    <div className="info-text">
                      By <b>{p.username}</b> • {getTimeSince(p.createdAt)}
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}

          {newPlace && (
            <Marker
              position={[newPlace.lat, newPlace.lng]}
              icon={createCustomIcon("#4caf50")}>
              <Popup onClose={() => setNewPlace(null)}>
                <div className="pin-form">
                  <label>Category</label>
                  <div className="category-select">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`category-btn ${
                          category === cat ? "active" : ""
                        }`}
                        onClick={() => setCategory(cat)}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  <label>Place Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Grand Hotel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label>Review / Description</label>
                  <textarea
                    placeholder="Share your experience..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />

                  <label>Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}>
                    <option value="1">⭐ Poor</option>
                    <option value="2">⭐⭐ Fair</option>
                    <option value="3">⭐⭐⭐ Good</option>
                    <option value="4">⭐⭐⭐⭐ Very Good</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  </select>

                  <button onClick={handleSubmit}>Add Pin</button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {showRegister && (
          <Register
            setShowRegister={setShowRegister}
            onRegisterSuccess={() => setShowLogin(true)}
          />
        )}

        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            onLoginSuccess={(username) => setCurrentUsername(username)}
          />
        )}

        {currentUsername && (
          <div className="floating-badge">
            <div className="tooltip">Made By KamalHussain </div>K
          </div>
        )}
      </div>
    </>
  );
}

export default App;
