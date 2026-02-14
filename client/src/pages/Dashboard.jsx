import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService, selectionService, matchService } from '../services/apiService';
import CountdownTimer from '../components/CountdownTimer';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [currentEvent, setCurrentEvent] = useState(null);
    const [mySelection, setMySelection] = useState(null);
    const [requestCount, setRequestCount] = useState(0);
    const [matchCount, setMatchCount] = useState(0);
    const [canViewMatches, setCanViewMatches] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();

        // Refresh match data every minute
        const interval = setInterval(() => {
            loadMatchData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            const [eventData, selectionData, requestData, matchData] = await Promise.all([
                eventService.getCurrentEvent(),
                selectionService.getMySelection(),
                selectionService.getRequestCount(),
                matchService.getMatchCount()
            ]);

            setCurrentEvent(eventData.event);
            setMySelection(selectionData.hasSelection ? selectionData.selection : null);
            setRequestCount(requestData.count);
            setMatchCount(matchData.count);
            setCanViewMatches(matchData.canView);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMatchData = async () => {
        try {
            const matchData = await matchService.getMatchCount();
            setMatchCount(matchData.count);
            setCanViewMatches(matchData.canView);
        } catch (error) {
            console.error('Failed to load match data:', error);
        }
    };

    if (loading) {
        return (
            <div className="dashboard loading">
                <div className="spinner"></div>
                <p>Loading your vibe check...</p>
            </div>
        );
    }

    return (
        <>
            <div className="hearts-bg"></div>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="container">
                        <div className="header-content">
                            <h1>What's good, {user?.name}! 👋</h1>
                            <button className="btn btn-secondary" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content container">
                    {currentEvent && (
                        <div className="countdown-section">
                            <CountdownTimer targetTime={currentEvent.matchTime} />
                        </div>
                    )}

                    <div className="dashboard-grid">
                        <div className="stat-card card-glass">
                            <div className="stat-icon">📥</div>
                            <div className="stat-value">{requestCount}</div>
                            <div className="stat-label">People Picked You</div>
                            <p className="stat-hint">Someone's interested... 👀</p>
                        </div>

                        <div className="stat-card card-glass">
                            <div className="stat-icon">{mySelection ? '✅' : '⏳'}</div>
                            <div className="stat-label">Your Pick</div>
                            {mySelection ? (
                                <div className="selection-info">
                                    <p className="selection-status locked">🔒 Locked & Loaded</p>
                                    <p className="selected-name">{mySelection.selectedUser.name}</p>
                                    <p className="selection-hint">Now we wait... 💭</p>
                                </div>
                            ) : (
                                <>
                                    <p className="stat-hint mb-3">Haven't chosen yet? Clock's ticking bestie</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/search')}
                                    >
                                        Pick Someone
                                    </button>
                                </>
                            )}
                        </div>

                        {canViewMatches && (
                            <div className="stat-card card-glass match-card">
                                <div className="stat-icon">💝</div>
                                <div className="stat-value match-number">{matchCount}</div>
                                <div className="stat-label">
                                    {matchCount === 1 ? 'Match Found!' : matchCount > 1 ? 'Matches Found!' : 'No Matches'}
                                </div>
                                {matchCount > 0 ? (
                                    <>
                                        <p className="stat-hint">It's mutual! Let's gooo 🎉</p>
                                        <button
                                            className="btn btn-success mt-3"
                                            onClick={() => navigate('/matches')}
                                        >
                                            See Who Matched →
                                        </button>
                                    </>
                                ) : (
                                    <p className="stat-hint">No matches yet, but your secret's safe 🤫</p>
                                )}
                            </div>
                        )}
                    </div>

                    {!mySelection && (
                        <div className="cta-section card-glass">
                            <div className="cta-icon">🎯</div>
                            <h2>Ready to shoot your shot?</h2>
                            <p>Browse the vibe, pick your person, and lock it in. One choice. Make it count.</p>
                            <button
                                className="btn btn-primary btn-large"
                                onClick={() => navigate('/search')}
                            >
                                Browse People
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
