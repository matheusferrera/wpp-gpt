import express, { Router } from "express";
import GroupController from "../controllers/groups";

const router: Router = express.Router();


// GET /groups/{clientId}
router.get('/:clientId', GroupController.getGroups);

// POST /groups/{clientId}
router.post('/:clientId', GroupController.createGroups);

// GET /groups/{clientId}/{remoteId}
router.get('/:clientId/:remoteId', GroupController.getGroups);

// GET /groups/labels/{clientId}/{remoteId}
router.get('/labels/:clientId/:remoteId', GroupController.getLabels);

// POST /groups/labels/{clientId}/{remoteId}
router.post('/labels/:clientId/:remoteId', GroupController.addLabels);

// DELETE /groups/labels/{clientId}/{remoteId}
router.delete('/labels/:clientId/:remoteId', GroupController.deleteLabels);

// PUT /groups/{clientId}/{remoteId}
router.put('/:clientId/:remoteId', GroupController.updateGroups);

// DELETE /groups/{clientId}/{remoteId}
router.delete('/:clientId/:remoteId', GroupController.deleteGroups);


export default router;