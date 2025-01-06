export const Login = async (password: string, email: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: 'include',
    });

    const responseBody = await response.json(); // Vänta på JSON-svaret
    

    if (response.ok) {
      console.log('Login success:', responseBody);
      return true;
    } else {
      console.error('Error', responseBody.message || response.statusText);
      return false;
    }
  } catch (error) {
    console.error('ERROR', error);
    return false;
  }
};