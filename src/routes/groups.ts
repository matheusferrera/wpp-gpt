import express, { Router } from "express";
import GroupController from "../controllers/groups";

const router: Router = express.Router();


// GET /groups/{clientId}
router.get('/:clientId', GroupController.getGroups);

// GET /groups/{clientId}/{remoteId}
router.get('/:clientId/:remoteId', GroupController.getGroups);

// POST /groups
router.post('/', GroupController.createGroups);

// DELETE /groups/{clientId}
router.delete('/:clientId', GroupController.deleteGroups);

// DELETE /groups/{clientId}/{remoteId}
router.delete('/:clientId/:remoteId', GroupController.deleteGroups);


export default router;