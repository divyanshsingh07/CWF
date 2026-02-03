/**
 * Load .env before any other app code runs.
 * Must be the first import in server.js so upload/storage see AWS vars.
 */
import dotenv from 'dotenv';
dotenv.config();
