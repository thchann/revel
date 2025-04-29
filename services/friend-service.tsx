const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app'; // add /users because your router is /users
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

  export const inviteFriend = async (userId: string, friendId: string) => {
    const response = await fetch(`${BACKEND_URL}/users/${userId}/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `"${friendId}"`, // <<< RAW STRING manually quoted!
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[inviteFriend] Failed:', response.status, errorText);
      throw new Error('Failed to send friend request');
    }
  
    return response.json();
  };
  
  
  
