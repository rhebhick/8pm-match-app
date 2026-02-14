import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const { login } = useAuth();

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let frameId;

        // Cursor trail effect
        const createTrail = (x, y) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 800);
        };

        // Cursor glow effect
        const createGlow = (x, y) => {
            const glow = document.createElement('div');
            glow.className = 'cursor-glow';
            glow.style.left = (x - 30) + 'px';
            glow.style.top = (y - 30) + 'px';
            document.body.appendChild(glow);
            setTimeout(() => glow.remove(), 1200);
        };

        const handleMouseMove = (e) => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Create trail particles
            if (distance > 8) {
                createTrail(e.clientX, e.clientY);

                // Create glow effect less frequently
                if (Math.random() > 0.8) {
                    createGlow(e.clientX, e.clientY);
                }
            }

            lastX = e.clientX;
            lastY = e.clientY;
        };

        // Throttle mouse move
        const throttledMouseMove = (e) => {
            if (!frameId) {
                frameId = requestAnimationFrame(() => {
                    handleMouseMove(e);
                    frameId = null;
                });
            }
        };

        document.addEventListener('mousemove', throttledMouseMove);

        // Floating hearts
        const createHeart = () => {
            const heartsContainer = document.querySelector('.hearts-bg');
            if (!heartsContainer) return;

            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = Math.random() > 0.5 ? '💖' : '💘';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heartsContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 10000);
        };

        const heartInterval = setInterval(createHeart, 500);

        return () => {
            document.removeEventListener('mousemove', throttledMouseMove);
            clearInterval(heartInterval);
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, []);

    return (
        <>
            <div className="hearts-bg"></div>
            <div className="landing-page">
                <div className="landing-hero">
                    <div className="hero-content container">
                        <div className="logo bounce">
                            <span className="logo-time">8</span>
                            <span className="logo-pm">PM</span>
                            <span className="logo-heart">💘</span>
                        </div>

                        <h1 className="hero-title fade-in">
                            Find Your
                            <span className="gradient-text"> Valentine</span>
                            <br />
                            Without The Awkward 💕
                        </h1>

                        <p className="hero-subtitle fade-in">
                            Swipe? Nah. Public rejection? Never. Mutual vibes only ✨
                        </p>

                        <div className="hero-features fade-in">
                            <div className="feature card-glass">
                                <div className="feature-icon">🔐</div>
                                <div className="feature-text">
                                    <strong>100% Secret</strong>
                                    <span>Your crush stays private</span>
                                </div>
                            </div>

                            <div className="feature card-glass">
                                <div className="feature-icon">💝</div>
                                <div className="feature-text">
                                    <strong>Mutual Vibes</strong>
                                    <span>Both gotta choose each other</span>
                                </div>
                            </div>

                            <div className="feature card-glass">
                                <div className="feature-icon">🛡️</div>
                                <div className="feature-text">
                                    <strong>No L's Taken</strong>
                                    <span>Zero embarrassment guaranteed</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-large fade-in pulse-btn" onClick={login}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="safety-message fade-in">
                            <p>💖 Built for Gen Z, designed for privacy, powered by mutual respect</p>
                        </div>
                    </div>
                </div>

                <div className="how-it-works">
                    <div className="container">
                        <h2 className="section-title">
                            How It Works
                            <span className="title-emoji">✨</span>
                        </h2>

                        <div className="steps">
                            <div className="step card-glass fade-in">
                                <div className="step-badge">Step 1</div>
                                <div className="step-icon">👀</div>
                                <h3>Pick Your Person</h3>
                                <p>Choose ONE person. Lock it in. No take-backs. We're serious about this.</p>
                            </div>

                            <div className="step card-glass fade-in">
                                <div className="step-badge">Step 2</div>
                                <div className="step-icon">⏰</div>
                                <h3>Wait Till 8PM</h3>
                                <p>Watch the countdown. See how many picked you (but not WHO). Keep you on your toes fr fr.</p>
                            </div>

                            <div className="step card-glass fade-in">
                                <div className="step-badge">Step 3</div>
                                <div className="step-icon">💕</div>
                                <h3>Match or Nah</h3>
                                <p>After 8PM, find out if it's mutual. Match? Let's gooo! No match? Your secret's safe bestie.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vibe-check">
                    <div className="container">
                        <h2 className="section-title gradient-text">The Vibe Check ✅</h2>
                        <div className="vibe-grid">
                            <div className="vibe-item card-glass">
                                <span className="vibe-icon">🚫</span>
                                <span className="vibe-text">No cap, 100% private</span>
                            </div>
                            <div className="vibe-item card-glass">
                                <span className="vibe-icon">💯</span>
                                <span className="vibe-text">Mutual or nothing</span>
                            </div>
                            <div className="vibe-item card-glass">
                                <span className="vibe-icon">🎯</span>
                                <span className="vibe-text">One shot, one choice</span>
                            </div>
                            <div className="vibe-item card-glass">
                                <span className="vibe-icon">🔥</span>
                                <span className="vibe-text">No awkward vibes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
