import express from 'express';
import path from 'path';

const router = express.Router();

// Serve the main HTML file
router.get('*', (_, res) => { // Changed 'req' to '_'
    res.sendFile(path.resolve('client', 'dist', 'index.html')); // Adjust path as needed
});

export default router;
