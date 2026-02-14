import './SelectionConfirmModal.css';

const SelectionConfirmModal = ({ user, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal selection-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">🔒</div>

                <h2 className="modal-title">Confirm Your Selection</h2>

                <div className="selected-user-info">
                    <div className="selected-avatar">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} />
                        ) : (
                            <div className="avatar-placeholder">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h3>{user.name}</h3>
                </div>

                <div className="warning-box">
                    <p>⚠️ <strong>Important:</strong> Once confirmed, your selection will be <strong>locked permanently</strong>.</p>
                    <p>You cannot change or withdraw your choice.</p>
                </div>

                <p className="modal-message">
                    Are you sure you want to select <strong>{user.name}</strong>?
                </p>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        Confirm &amp; Lock
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectionConfirmModal;
