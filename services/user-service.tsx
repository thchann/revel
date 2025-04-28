const AUTH0_DOMAIN = 'dev-sb38zfhoymytmq0h.us.auth0.com/users'
const BACKEND_URL = 'https://488b-131-194-168-66.ngrok-free.app'

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
  const response = await fetch(`${BACKEND_URL}/users/add_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userProfile.email,
      name: userProfile.nickname || userProfile.name,
      friends: [],
      clubs: [],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save user');
  }

  return await response.json();
};

// Fetch a user by user ID
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
