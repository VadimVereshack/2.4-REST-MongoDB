import express from 'express';
import {login, logout, register, getItems, postItems, putItems, deleteItems} from '../controllers/controller';
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/items", getItems);
router.post("/items", postItems);
router.put("/items", putItems);
router.delete("/items", deleteItems);

export default router;