const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app'; // add /users because your router is /users

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error('[UserService] Failed to fetch Auth0 profile');
  return await response.json();
};

export const saveUserToBackend = async (userProfile: any) => {
  const userPayload = {
    email: userProfile.email,
    name: userProfile.nickname || userProfile.name,
    image: userProfile.picture || "",
    friends: [],
    clubs: [],
  };

  console.log('[saveUserToBackend] Sending:', userPayload);

  const response = await fetch(`${BACKEND_URL}/users/add_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save user');
  }

  const data = await response.json();
  console.log('data:', data);
  return data;
};


// Fetch a user by **email** (for login flow)
export const fetchUserByEmail = async (email: string) => {
  const url = `${BACKEND_URL}/users/by_email/${encodeURIComponent(email)}`;
  console.log('[fetchUserByEmail] Fetching:', url);
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    console.error(`[fetchUserByEmail] Failed: ${response.status} ${response.statusText}. Body: ${text}`);
    throw new Error('Failed to fetch user by email');
  }
  return await response.json();
};


export const fetchUserById = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user by ID');
  return await response.json();
};

export const updateUserName = async (userId: string, newName: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_name: newName }),
  });

  if (!response.ok) throw new Error('Failed to update user name');
  return await response.json();
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete user');
  return await response.json();
};

export const updateUserFriends = async (userId: string, friends: string[]) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/friends`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(friends),
  });

  if (!response.ok) throw new Error('Failed to update friends list');
  return await response.json();
};

export const addFriend = async (userId: string, friendId: string) => {
  const response = await fetch(`${BACKEND_URL}/users/${userId}/friends`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(friendId),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[addFriend] Failed:', response.status, error);
    throw new Error('Failed to add friend');
  }

  return await response.json();
};

export const updateUserEvents = async (userId: string, events: string[]) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/events`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  });

  if (!response.ok) throw new Error('Failed to update events');
  return await response.json();
};

export const fetchUserEvents = async (userId: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/events`);
  if (!response.ok) throw new Error('Failed to fetch user events');
  return await response.json();
};

export const updateUserImage = async (userId: string, newImageUrl: string) => {
  const response = await fetch(`${BACKEND_URL}/${userId}/image`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newImageUrl),
  });

  if (!response.ok) throw new Error('Failed to update user image');
  return await response.json();
};
