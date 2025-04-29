const BACKEND_URL = 'https://782d-131-194-168-66.ngrok-free.app'; // add /users because your router is /users
export const updateFriends = async (userId: string, friends: string[]) => {
    const url = `${BACKEND_URL}/users/${userId}/friends`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(friends),
    });
  
    if (!response.ok) {
      const text = await response.text();
      console.error(`[updateFriends] Failed: ${response.status} ${response.statusText}. Body: ${text}`);
      throw new Error('Failed to update friends');
    }
    
    return await response.json();
  };