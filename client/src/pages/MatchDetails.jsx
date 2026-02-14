import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/apiService';
import './MatchDetails.css';

const MatchDetails = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            const data = await matchService.getMatches();
            setMatches(data.matches);
        } catch (err) {
            console.error('Failed to load matches:', err);
            setError(err.response?.data?.error || 'Failed to load matches');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="match-details loading">
                <div className="spinner"></div>
                <p>Loading your matches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="match-details error-state">
                <div className="container-sm">
                    <h2>⏰ Not Available Yet</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="match-details">
            <div className="match-header">
                <div className="container">
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>

                    <h1>💝 Your Matches</h1>
                </div>
            </div>

            <div className="matches-container container-sm">
                {matches.length === 0 ? (
                    <div className="no-matches">
                        <div className="empty-state">
                            <div className="empty-icon">💙</div>
                            <h2>No Mutual Matches</h2>
                            <p>Unfortunately, there were no mutual matches this time.</p>
                            <p className="hint">Remember: Your selection remains completely private. Keep trying in future events!</p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => navigate('/dashboard')}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="matches-list">
                        <div className="match-intro">
                            <h2>🎉 Congratulations!</h2>
                            <p>You have {matches.length} mutual {matches.length === 1 ? 'match' : 'matches'}!</p>
                        </div>

                        {matches.map((match) => (
                            <div key={match.matchId} className="match-card card-glass">
                                <div className="match-avatar">
                                    {match.matchedUser.profilePicture ? (
                                        <img src={match.matchedUser.profilePicture} alt={match.matchedUser.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {match.matchedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="match-info">
                                    <h3>{match.matchedUser.name}</h3>
                                    <p className="match-email">{match.matchedUser.email}</p>

                                    {match.matchedUser.profile?.bio && (
                                        <p className="match-bio">{match.matchedUser.profile.bio}</p>
                                    )}

                                    {match.matchedUser.profile?.interests && match.matchedUser.profile.interests.length > 0 && (
                                        <div className="match-interests">
                                            {match.matchedUser.profile.interests.map((interest, index) => (
                                                <span key={index} className="interest-tag">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="match-actions">
                                        <a
                                            href={`mailto:${match.matchedUser.email}`}
                                            className="btn btn-primary"
                                        >
                                            📧 Send Email
                                        </a>
                                    </div>

                                    <p className="match-date">
                                        Matched on {new Date(match.matchedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchDetails;
