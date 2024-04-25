import express, { Router } from "express";
import ContactsController from "../controllers/contacts";

const router: Router = express.Router();


// GET /Contacts

// POST /Contacts
router.post('/', ContactsController.createContacts);

// GET /Contacts/{userId}
router.get('/:userId', ContactsController.getContacts);

// GET /Contacts/{wppNumber}
router.get('/:userId/:wppNumber', ContactsController.getContacts);

// PUT /Contacts/{userId}
router.put('/:userId/:wppNumber', ContactsController.changeContacts);

// DELETE /Contacts/{userId}
router.delete('/:userId/:wppNumber', ContactsController.deleteContacts);


export default router;