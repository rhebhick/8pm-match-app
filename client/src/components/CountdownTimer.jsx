import './CountdownTimer.css';

const CountdownTimer = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(targetTime) - new Date();

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    }

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    if (timeLeft.expired) {
        return (
            <div className="countdown-timer expired">
                <div className="countdown-title">It's 8 PM! 🎉</div>
                <p className="countdown-subtitle">Time to see if it's mutual...</p>
            </div>
        );
    }

    return (
        <div className="countdown-timer card-glass">
            <div className="countdown-title">The Moment of Truth In...</div>
            <div className="countdown-display">
                <div className="time-unit">
                    <div className="time-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="time-label">Hours</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-unit">
                    <div className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="time-label">Minutes</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-unit">
                    <div className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="time-label">Seconds</div>
                </div>
            </div>
            <p className="countdown-subtitle">Stay patient, the wait makes it sweeter 💕</p>
        </div>
    );
};

// Add React import at the top if not already there
import React from 'react';

export default CountdownTimer;
