import React from 'react';
// import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventType } from '../../types/api';
import "./Event.css"
import "./Dashboard.css"
import logo from '/assets/pmc_logo.svg';


const Event: React.FC = () => {
    const [event, setEvent] = useState<eventType | null>(null);
    const { event_id } = useParams<{ event_id: string }>();
    const [loading, setLoading] = useState(true);
    const [memberId, setMemberId] = useState<string | undefined>(undefined);
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigateTo = useNavigate();

    function checkMember() {
        try {
            const loggedIn = localStorage.getItem('member_id') !== null;
            const id = localStorage.getItem('member_id') ?? undefined;
            const displayName = localStorage.getItem('member_name') ?? "guest";

            setIsLoggedIn(loggedIn);
            setMemberId(id);
            setDisplayName(displayName);
        } catch (error) {
            console.error('Error checking user status (member/nonmember): ', error);
        }
    }

    async function fetchEvent() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${event_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: eventType = await response.json();
            setEvent({
                ...data,
                date: new Date(data.date),
            });
            console.log(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkMember();
        fetchEvent();
    }, [event_id]);

    if (loading) return <p>Loading...</p>;
    if (!event) return <p>No event details available.</p>;

    return (
        <div className="background-event">
            <div className="header">
                <div className="header-icon">
                    <a href="/"><img src="./src/assets/pmc_logo.svg" className="logo" ></img></a>
                </div>
                <nav className="header-nav">
                    <a href="#upcoming-events" className="header-link">Events</a>
                    <div>
                        {isLoggedIn ? (
                            <a href="/profile" className="header-link">Profile</a>
                        ) : (
                            <a href="/" className="header-link">Profile</a>
                        )}
                    </div>
                    {/* <a href="/" className="header-link">Profile</a> */}
                </nav>
            </div>



            <div className="event-container">
                <h2 className="event-title">{event.name}</h2>
                <div className="event-details-container">
                    <div className="event-details">
                        <p>{event.date.toDateString()}</p>
                        <p>{event.location}</p>
                        <p>member price: ${event.member_price !== undefined ? event.member_price.toFixed(2) : "N/A"}</p>
                        <p>non-member price: ${event.non_member_price !== undefined ? event.non_member_price.toFixed(2) : "N/A"}</p>
                        {event.attendees ? (
                            <div>
                                <p>{event.attendees.length}/50 spots filled</p>
                                {/* {event.attendees.length > 0 ? (
                                    <ul>
                                        {event.attendees.map((attendee) => (
                                            <li key={attendee.id}>{attendee.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>no attendees in this event...</p>
                                )} */}
                            </div>
                        ) : (
                            <p>no attendees signed up yet...</p>
                        )}
                    </div>
                </div>
            </div>
            <button className="signup-button" onClick={() => navigateTo(`/dashboard`)}>
                Sign up
            </button>
            <img src={event.media[0]} alt="Event" className="event-photo"></img>
            <div className="event-desc">
                <h3>About the event</h3>
                <p>{event.description}</p>
            </div>


            {/* <h1>{event.name}</h1>
            <p><strong>Date:</strong> {event.date.toDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Member Price:</strong> ${event.member_price !== undefined ? event.member_price.toFixed(2) : "N/A"}</p>
            <p><strong>Non-Member Price:</strong> ${event.non_member_price !== undefined ? event.non_member_price.toFixed(2) : "N/A"}</p>
            <p><strong>Member Only:</strong> {event.member_only ? "Yes" : "No"}</p> */}

            {/* <div>
                <h2>Media</h2>
                {event.media.length > 0 ? (
                    <ul>
                        {event.media.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">Media {index + 1}</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No media available</p>
                )}
            </div> */}

            {/* <div>
                <h2>Attendees</h2>
                {event && event.attendees && event.attendees.length > 0 ? (
                    <ul>
                        {event.attendees.map((attendee) => (
                            <li key={attendee.id}>{attendee.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>There are no attendees in this event...</p>
                )}
            </div> */}
        </div>
    );
}

export default Event;