

const url = '/api/users/register'

export const postUser = async (UserData: { first_name: string; last_name: string; phone_number: string; email: string; password: string; role:string;}) => {
  try {
    if (!url) {
      throw new Error('Base URL not set.');
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(UserData),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: error || response.statusText || `Error ${response.status}: ${response.statusText}` };
    }

    const result = await response.json();
    return { data: result };
  } catch (error) {
    return { error: (error as Error).message || 'An unexpected error occurred. Please try again later.' };
  }
};














