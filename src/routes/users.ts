import express, { Router } from "express";
import UsersController from "../controllers/users";

const router: Router = express.Router();


// GET /users
router.get('/', UsersController.getUsers);

// POST /users
router.post('/', UsersController.createUsers);

// GET /users/{userId}
router.get('/:userId', UsersController.getUsers);

// PUT /users/{userId}
router.put('/:userId', UsersController.changeUsers);

// DELETE /users/{userId}
router.delete('/:userId', UsersController.deleteUsers);


export default router;