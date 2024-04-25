import express, { Router } from "express";
import GroupController from "../controllers/groups";

const router: Router = express.Router();


// GET /groups/{clientId}
router.get('/:clientId', GroupController.getGroups);

// POST /groups/{clientId}
router.post('/:clientId', GroupController.createGroups);

// GET /groups/{clientId}/{remoteId}
router.get('/:clientId/:remoteId', GroupController.getGroups);

// PUT /groups/{clientId}/{remoteId}
router.put('/:clientId/:remoteId', GroupController.updateGroups);

// DELETE /groups/{clientId}/{remoteId}
router.delete('/:clientId/:remoteId', GroupController.deleteGroups);


export default router;