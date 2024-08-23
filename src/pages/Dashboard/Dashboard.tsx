
import "./Dashboard.css"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventType } from '../../types/api';
import { auth } from "../../../firebase"

export default function Dashboard() {
    // Check if logged in or continued as non-member
    const [allEvents, setAllEvents] = useState<eventType[]>([]);
    const navigateTo = useNavigate();
    const [welcomeMessage, setWelcomeMessage] = useState<string>('Welcome guest');

    async function dashboardComponents() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Fetching all events was not ok');
            }

            const allEvents = await response.json();
            setAllEvents(allEvents);
            const message = auth.currentUser != null ? `Welcome ${auth.currentUser.displayName}` : "Welcome guest";
            setWelcomeMessage(message);

        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    }

    useEffect(() => {
        dashboardComponents();
    }, []);

    return (
        <div className="background-dashboard">
            <div>
                <div className="header">
                    <div className="header-icon">
                        <a href="/"><img src="./src/assets/pmclogo.svg" className="logo" ></img></a>
                    </div>
                    <nav className="header-nav">
                        <a href="/dashboard" className="header-link">Events</a>
                        <div>
                            {auth.currentUser != null ? (
                                <a href="/profile" className="header-link">Profile</a>
                            ) : (
                                <a href="/" className="header-link">Profile</a>
                            )}
                        </div>
                        <div>
                            {auth.currentUser != null ? (
                                <a className="header-button">Sign out</a>
                            ) : (
                                <a href="/" className="header-button">Sign in</a>
                            )}
                        </div>
                    </nav>
                </div>
            </div>

            <div id="upcoming-events">
                <h2 className="upcoming-events">Upcoming Events</h2>
            </div>

            <div className="welcome-message">
                <h3>{welcomeMessage}</h3>
            </div>

            <div className="events-container">
                <div>
                    {allEvents.length > 0 ? (
                        allEvents.map(event => (
                            <div
                                key={event.event_Id}
                                className="card"
                                onClick={() => {
                                    if (auth.currentUser) {
                                        navigateTo(`/events/${event.event_Id}`);
                                    }
                                }}>
                                <div className="event-date">
                                    <h2>{new Date(event.date).toDateString()}</h2>
                                </div>

                                <div className={`event ${!event.non_member_price ? "disabled-card" : "event"}`}>
                                    <h2>{event.name}</h2>
                                    <p>{event.description}</p>
                                    <img src={event.media[0]} alt="Event" className="event-image"></img>
                                    <button className="event-button" onClick={(e) => e.stopPropagation()}>
                                        Register
                                    </button>
                                    {!event.non_member_price && (
                                        <div className="overlay">
                                            <p className="disabled-comment">Please sign in to your PMC account to view the details for this event.</p>
                                        </div>
                                    )}
                                </div>


                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'white' }}>No events found.</p>
                    )}
                </div>

            </div>

        </div>
    )
}


// MAIN PRIORITIES:
// 1. Only display member_only pop-up events in dashboard (if they don't have a non-member price, its member-only!)
// 2. fix UI of event detail page
// 3. Change header Sign in UI + functionality to end session for signing out