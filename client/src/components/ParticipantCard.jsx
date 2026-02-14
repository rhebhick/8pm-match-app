import './ParticipantCard.css';

const ParticipantCard = ({ user, onSelect, isDisabled, isSelected }) => {
    return (
        <div className={`participant-card ${isSelected ? 'selected' : ''}`}>
            <div className="participant-avatar">
                {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                ) : (
                    <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="participant-info">
                <h3 className="participant-name">{user.name}</h3>

                {user.profile?.bio && (
                    <p className="participant-bio">{user.profile.bio}</p>
                )}

                {user.profile?.interests && user.profile.interests.length > 0 && (
                    <div className="participant-interests">
                        {user.profile.interests.slice(0, 3).map((interest, index) => (
                            <span key={index} className="interest-tag">
                                {interest}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <button
                className={`btn ${isSelected ? 'btn-success' : 'btn-primary'}`}
                onClick={() => onSelect(user)}
                disabled={isDisabled && !isSelected}
            >
                {isSelected ? '✓ Selected' : 'Select'}
            </button>
        </div>
    );
};

export default ParticipantCard;
