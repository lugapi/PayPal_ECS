// templateRoutes.js
import express from 'express';
import { renderHome, renderRegistration } from '../controllers/templateController.js';

const router = express.Router();

router.get('/', renderHome);
router.get('/registration', renderRegistration);

export default router;
