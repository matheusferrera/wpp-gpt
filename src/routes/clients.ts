import express, { Router } from "express";
import ClientController from "../controllers/clients";

const router: Router = express.Router();


// GET /clients
router.get('/', ClientController.getClients);
router.get('/:clientId', ClientController.getClients);

// POST /clients
router.post('/', ClientController.createClients);
router.post('/activeClient/:clientId', ClientController.activeClients);

// PUT /clients
router.put('/:clientId', ClientController.changeClients);

// DELETE /clients
router.delete('/:clientId', ClientController.deleteClients);


export default router;