export const changePassword = async (newPassword: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:4000/user/updatePassword', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({
        password: newPassword,
      }),
      
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to change password', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error changing password', error);
    return false;
  }
};