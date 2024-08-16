// import React from 'react';
// import ReactDOM from 'react-dom/client'

import "./Dashboard.css"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventType } from '../../types/api';

export default function Dashboard() {
    // Check if logged in or continued as non-member
    const [allEvents, setAllEvents] = useState<eventType[]>([]);
    const navigateTo = useNavigate();

    async function dashboardComponents() {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/events/`, {
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

        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    }

    useEffect(() => {
        dashboardComponents();
    }, []);

    return (
        <div>
            {allEvents.length > 0 ? (
                allEvents.map(event => (
                    <div key={event.event_Id} className="event">
                        <h2>{event.name}</h2>
                        <p>{event.description}</p>
                        <img src={event.media[0]} alt="Event" className="event-image"></img>
                        <button onClick={() => navigateTo(`/events/${event.event_Id}`)}>
                            Register
                        </button>
                    </div>
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}


// MAIN PRIORITIES:
// 1. call Event page - DONE
// display Event page's details - DONE
// have a 'register' button - DONE
// 2. At CSS, button to hover to Events section + profile
// 3. Set persistance - check if logged in or continued as non-member
// 4. When clicked 'register':
//      if member, add member_id into eventDetails page (and do not display it in public!)
//      if non-member, ...?