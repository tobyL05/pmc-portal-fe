import React from 'react';
// import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventType } from '../../types/api';

export default function Dashboard() {
    // Check if logged in or continued as non-member
    const [allEvents, setAllEvents] = useState<eventType[]>([]);
    // const { event_id } = useParams<{ event_id: string }>();
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
                    <div key={event.event_Id}>
                        <h2>{event.name}</h2>
                        <p>{event.description}</p>
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
// 1. call Event page
// display Event page's details
// have a 'register' button
// 2. At CSS, button to hover to Events section + profile
// 3. Set persistance - check if logged in or continued as non-member