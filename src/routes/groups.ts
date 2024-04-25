import express, { Router } from "express";
import GroupController from "../controllers/groups";

const router: Router = express.Router();


// GET /groups/{clientId}
router.get('/:clientId', GroupController.getGroups);

// POST /groups/{clientId}
router.post('/:clientId', GroupController.createGroups);

// GET /groups/{clientId}/{remoteId}
router.get('/:clientId/:remoteId', GroupController.getGroups);

// DELETE /groups/{clientId}/{remoteId}
router.delete('/:clientId/:remoteId', GroupController.deleteGroups);


export default router;