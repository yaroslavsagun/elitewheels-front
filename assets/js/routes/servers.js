import { Router } from "express";

import { createUser, login, getCars } from "../controllers/server_controller.js";

const router = Router();

router.put('/api/auth/register', createUser);
router.post('/api/auth/login', login);
router.get('/api/products', getCars);

export default router;