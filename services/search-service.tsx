const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app';

export const fetchAllEvents = async () => {
  const response = await fetch(`${BACKEND_URL}/events/all_events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

export const fetchAllUsers = async () => {
  const response = await fetch(`${BACKEND_URL}/users/all`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};
