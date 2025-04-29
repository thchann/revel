const BACKEND_URL = 'https://ac13-131-194-168-66.ngrok-free.app'; // add /users because your router is /users

export const removeFriendFromBackend = async (userId: string, friendId: string) => {
    const url = `${BACKEND_URL}/users/${userId}/friends/${friendId}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const text = await response.text();
      console.error(`[removeFriendFromBackend] Failed: ${response.status} - ${text}`);
      throw new Error('Failed to remove friend from backend');
    }
  
    return await response.json();
  };
  