/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - id
 *         - clientId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the client for MongoDB
 *         clientId:
 *           type: string
 *           description: The ID of your client
 *         name:
 *           type: string
 *           description: The client name
 *       example:
 *         id: d5fE_asz
 *         clientId: client_01
 *         name: Loja 1
 */

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: The clients
 * /clients:
 *   get:
 *     summary: Lists all the clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: The list of the saved clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: The created client.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       500:
 *         description: Some server error
 * /clients/{clientId}:
 *   get:
 *     summary: Get the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: The book was not found
 *   put:
 *    summary: Update the client by the id
 *    tags: [Clients]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The client id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Client'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Client'
 *      404:
 *        description: The client was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *
 *     responses:
 *       200:
 *         description: The client was deleted
 *       404:
 *         description: The client was not found
 */

import express, { Router, Request, Response } from "express";
import ClientModel from "../models/Client";

const router: Router = express.Router();

// GET /clients
router.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await ClientModel.find();
        res.send(clients);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// GET /clients/{clientId}
router.get('/:clientId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const client = await ClientModel.find({ clientId: clientId });
        res.send(client);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// PUT /clients/{clientId}
router.put('/:clientId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const client = await ClientModel.findOneAndUpdate({ clientId: clientId }, { upsert: true, new: true });
        res.send(client);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// DELETE /clients/{clientId}
router.delete('/:clientId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        await ClientModel.deleteOne({ clientId: clientId });
        res.send({"detail": "client deleted"});
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// POST /clients
router.post('/', async (req: Request, res: Response) => {
    try {
        const clientId = req.body.clientId;
        const client = await ClientModel.findOneAndUpdate({ clientId: clientId }, { upsert: true, new: true });
        res.send(client);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

export default router;