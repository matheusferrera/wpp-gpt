import express, { Router } from "express";
import ClientController from "../controllers/clients";

const router: Router = express.Router();


// GET /clients
router.get('/', ClientController.getClients);

// POST /clients
router.post('/', ClientController.createClients);

// POST /clients/activeClient/{clientId}
router.post('/activeClient/:clientId', ClientController.activeClients);

// GET /clients/{clientId}
router.get('/:clientId', ClientController.getClients);

// PUT /clients/{clientId}
router.put('/:clientId', ClientController.changeClients);

// DELETE /clients/{clientId}
router.delete('/:clientId', ClientController.deleteClients);


export default router;