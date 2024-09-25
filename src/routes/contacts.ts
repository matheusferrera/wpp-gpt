import { PaginationDto } from "../dto/query/pagination.dto";
import express, { Router } from "express";
import ContactController from "../controllers/contacts";
import {
  validationMiddleware,
  validationMiddlewareGet,
} from "../validation.middleware";
import { PatchContactDto } from "../dto/contact/PatchContact.dto";
import { CreateContactDto } from "../dto/contact/CreateContact.dto";

const router: Router = express.Router();

// GET contacts (com paginação)
router.get(
  "/",
  validationMiddlewareGet(PaginationDto),
  ContactController.getContacts.bind(ContactController)
);

// POST contacts (criação de novos contatos)
router.post(
  "/",
  validationMiddleware(CreateContactDto),
  ContactController.createContact.bind(ContactController)
);

// // PATCH contacts (atualização de contato)
// router.patch(
//   "/:id",
//   validationMiddleware(PatchContactDto),
//   ContactController.patchContact.bind(ContactController)
// );

// // DELETE contacts (remoção de contato)
// router.delete("/:id", ContactController.deleteContact.bind(ContactController));

export default router;
