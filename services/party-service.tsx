const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app'; // Update to your real ngrok!

export const createEvent = async (eventData: {
    title: string;
    date: string; // ISO string
    location: string;
    images: string;
    organization?: string;
    description?: string;
    host: string;
    attendees?: string[];
  }) => {
    const response = await fetch(`${BACKEND_URL}/events/create_event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
  
    return await response.json(); // contains the event ID and data
  };

export const fetchAllEvents = async () => {
  const response = await fetch(`${BACKEND_URL}/events/all_events`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchAllEvents] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to fetch events');
  }

  const events = await response.json();

  return events.map((event: any) => ({
    id: event.id,
    title: event.title,
    org: event.organization || '',
    date: new Date(event.date).toLocaleDateString(), // format date
    location: event.location,
    description: event.description,
    imageUrl: event.images || '', // <-- Use the `images` field as URL
    
  }));
};

export const fetchUserEvents = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/users/${userId}/events`);
    if (!response.ok) throw new Error('Failed to fetch user events');
    return await response.json(); // list of event IDs
  };
  
export const fetchEventById = async (eventId: string) => {
    const response = await fetch(`${BACKEND_URL}/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event details');
    return await response.json(); // full event object
  };
