import { Request, Response } from "express";
import ContactService from "../services/contacts";
import { PaginationDto } from "../dto/query/pagination.dto";
import { plainToInstance } from "class-transformer";
import { PatchContactDto } from "../dto/contact/PatchContact.dto";
import { CreateContactDto } from "../dto/contact/CreateContact.dto";
import { PaginationContactQueryDto } from "../dto/query/pagination.contact.dto";

const getContacts = async (req: Request, res: Response) => {
  try {
    const dtoInstance = plainToInstance(PaginationContactQueryDto, req.query as object);
    const response = await ContactService.getContacts(dtoInstance);
    res.send(response);
  } catch (e: any) {
    console.error("Error in getContacts: ", e);
    res.status(500).send(e.toString());
  }
};

const createContact = async (req: Request, res: Response) => {
  try {
    const dtoInstance = plainToInstance(CreateContactDto, req.body as object);
    console.log("DTO -> ", dtoInstance);
    const response = await ContactService.createContact(dtoInstance);
    res.status(201).send(response);
  } catch (e: any) {
    console.error("Error in createContact: ", e);
    res.status(500).send(e.toString());
  }
};

const patchContact = async (req: Request, res: Response) => {
  try {
    const dtoInstance = plainToInstance(PatchContactDto, req.body as object);
    // const response = await ContactService.patchContact(req.params.id, dtoInstance);
    // res.send(response);
  } catch (e: any) {
    console.error("Error in patchContact: ", e);
    res.status(500).send(e.toString());
  }
};

const deleteContact = async (req: Request, res: Response) => {
  try {
    // await ContactService.deleteContact(req.params.id);
    res.status(204).send(); // No content
  } catch (e: any) {
    console.error("Error in deleteContact: ", e);
    res.status(500).send(e.toString());
  }
};

const ContactController = {
  getContacts,
  createContact,
  patchContact,
  deleteContact,
};

export default ContactController;
