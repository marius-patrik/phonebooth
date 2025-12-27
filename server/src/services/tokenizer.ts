export const tokenizer = (token: string | undefined): number => {
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    // Decode the token (assuming it's a JWT) to extract the user ID
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );

    if (payload && typeof payload.id === 'number') {
      return payload.id;
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Invalid token');
  }
};
