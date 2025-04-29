const AUTH0_DOMAIN = 'dev-sb38zfhoymytmq0h.us.auth0.com';
const BACKEND_URL = 'https://dcef-131-194-168-66.ngrok-free.app/users'; // add /users because your router is /users

// Fetch user profile from Auth0's /userinfo endpoint
export const getUserInfo = async (accessToken: string) => {
  const response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error('[UserService] Failed to fetch Auth0 profile');
  return await response.json();
};

// Save (create) a user to backend
export const saveUserToBackend = async (userProfile: any) => {
  const userPayload = {
    email: userProfile.email,
    name: userProfile.nickname || userProfile.name,
    image: userProfile.picture || "", 
    friends: [],
    clubs: [],
  };

  console.log('[saveUserToBackend] Sending:', userPayload);

  const response = await fetch(`${BACKEND_URL}/add_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userPayload),
  });

  console.log('[saveUserToBackend] Sending:', userPayload);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save user');
  }

  const data = await response.json();
  console.log('data: ',data)
  return await response.json(); // should contain { id, email, name, friends, clubs }
};

// Fetch a user by **email** (for login flow)
export const fetchUserByEmail = async (email: string) => {
  const url = `${BACKEND_URL}/by_email/${encodeURIComponent(email)}`;
  console.log('[fetchUserByEmail] Fetching:', url);
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    console.error(`[fetchUserByEmail] Failed: ${response.status} ${response.statusText}. Body: ${text}`);
    throw new Error('Failed to fetch user by email');
  }
  return await response.json();
};


// Fetch a user by **ID** (normal use)
export const fetchUserById = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user by ID');
  return await response.json();
};

// Update user's name
export const updateUserName = async (userId: string, newName: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_name: newName }),
  });

  if (!response.ok) throw new Error('Failed to update user name');
  return await response.json();
};

// Delete user by ID
export const deleteUser = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete user');
  return await response.json();
};

// Update a user's friends list
export const updateUserFriends = async (userId: string, friends: string[]) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/friends`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(friends),
  });

  if (!response.ok) throw new Error('Failed to update friends list');
  return await response.json();
};

// Add a friend to a user
export const addFriend = async (userId: string, friendId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/friends`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(friendId),
  });

  if (!response.ok) throw new Error('Failed to add friend');
  return await response.json();
};

// Update a user's events
export const updateUserEvents = async (userId: string, events: string[]) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/events`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  });

  if (!response.ok) throw new Error('Failed to update events');
  return await response.json();
};

// Get a user's events
export const fetchUserEvents = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/events`);
  if (!response.ok) throw new Error('Failed to fetch user events');
  return await response.json();
};

// Update a user's profile image
export const updateUserImage = async (userId: string, newImageUrl: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/image`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newImageUrl),
  });

  if (!response.ok) throw new Error('Failed to update user image');
  return await response.json();
};
