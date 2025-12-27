import express from 'express';

const router = express.Router();

// Logout endpoint
router.post('/api/user/logout', (_req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Send a success response
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to log out' });
  }
});

export { router as logoutRouter };
