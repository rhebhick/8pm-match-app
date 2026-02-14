import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, selectionService } from '../services/apiService';
import ParticipantCard from '../components/ParticipantCard';
import SelectionConfirmModal from '../components/SelectionConfirmModal';
import './ParticipantSearch.css';

const ParticipantSearch = () => {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mySelection, setMySelection] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadParticipants();
        loadMySelection();
    }, []);

    const loadParticipants = async (searchQuery = '') => {
        try {
            const data = await userService.getParticipants({ search: searchQuery, limit: 50 });
            setParticipants(data.participants);
        } catch (error) {
            console.error('Failed to load participants:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMySelection = async () => {
        try {
            const data = await selectionService.getMySelection();
            if (data.hasSelection) {
                setMySelection(data.selection);
            }
        } catch (error) {
            console.error('Failed to load selection:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadParticipants(search);
    };

    const handleSelectUser = (user) => {
        if (mySelection) return;
        setSelectedUser(user);
        setShowConfirmModal(true);
    };

    const handleConfirmSelection = async () => {
        if (!selectedUser || submitting) return;

        setSubmitting(true);
        try {
            await selectionService.submitSelection(selectedUser._id);
            alert(`✅ Selection locked! You selected ${selectedUser.name}. Your choice has been saved.`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to submit selection:', error);
            alert(error.response?.data?.error || 'Failed to submit selection. Please try again.');
        } finally {
            setSubmitting(false);
            setShowConfirmModal(false);
        }
    };

    if (loading) {
        return (
            <div className="participant-search loading">
                <div className="spinner"></div>
                <p>Loading participants...</p>
            </div>
        );
    }

    return (
        <div className="participant-search">
            <div className="search-header">
                <div className="container">
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>

                    <h1>Browse Participants</h1>

                    {mySelection ? (
                        <div className="selection-notice">
                            <p>✅ You've already selected <strong>{mySelection.selectedUser.name}</strong></p>
                            <p className="notice-hint">Your selection is locked and cannot be changed</p>
                        </div>
                    ) : (
                        <p className="search-subtitle">Choose ONE person. Your selection will be locked permanently.</p>
                    )}

                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="participants-container container">
                {participants.length === 0 ? (
                    <div className="no-results">
                        <p>No participants found</p>
                    </div>
                ) : (
                    <div className="participants-grid">
                        {participants.map((participant) => (
                            <ParticipantCard
                                key={participant._id}
                                user={participant}
                                onSelect={handleSelectUser}
                                isDisabled={!!mySelection}
                                isSelected={mySelection?.selectedUser.id === participant._id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showConfirmModal && selectedUser && (
                <SelectionConfirmModal
                    user={selectedUser}
                    onConfirm={handleConfirmSelection}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

export default ParticipantSearch;
