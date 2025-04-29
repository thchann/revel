const BACKEND_URL = 'https://782d-131-194-168-66.ngrok-free.app'; // replace with your real current URL

export const fetchAllEvents = async () => {
  const response = await fetch(`${BACKEND_URL}/events/all_events`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fetchAllEvents] Failed: ${response.status} ${errorText}`);
    throw new Error('Failed to fetch events');
  }
  const events = await response.json();

  // Transform if necessary
  return events.map((event: any) => ({
    ...event,
  }));
};
