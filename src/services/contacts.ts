import { PrismaClient, Prisma } from "@prisma/client";
import { PaginationDto } from "../dto/query/pagination.dto";
import { PatchContactDto } from "../dto/contact/PatchContact.dto";
import { CreateContactDto } from "../dto/contact/CreateContact.dto";

const prisma = new PrismaClient();

const getContacts = async (pagination: PaginationDto) => {
  const page = parseInt(pagination.page, 10);
  const pageSize = parseInt(pagination.pageSize, 10);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const contacts = await prisma.contact.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc", // Ordenar contatos pela data de criação
      },
    });

    return contacts;
  } catch (e: any) {
    console.error("Error in getContacts: ", e);
    throw e; // Re-lançando o erro para tratamento posterior
  }
};

const createContact = async (data: CreateContactDto) => {
  try {
    const contact = await prisma.contact.create({
      data: {
        remoteid: data.remoteid,
        name: data.name,
        obs: data.obs || "",
        ...(data.tags && {
          tags: {
            connect: [{ name: "VIP" }],
          },
        }),
      },
    });

    return contact;
  } catch (e: any) {
    console.error("Error in createContact: ", e);
    throw e; // Re-lançando o erro para tratamento posterior
  }
};

const patchContact = async (id: number, data: PatchContactDto) => {
  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: data as Prisma.ContactUpdateInput,
    });

    return updatedContact;
  } catch (e: any) {
    console.error("Error in patchContact: ", e);
    throw e; // Re-lançando o erro para tratamento posterior
  }
};

const deleteContact = async (id: number) => {
  try {
    await prisma.contact.delete({
      where: { id },
    });
  } catch (e: any) {
    console.error("Error in deleteContact: ", e);
    throw e; // Re-lançando o erro para tratamento posterior
  }
};

const ContactService = {
  getContacts,
  createContact,
  patchContact,
  deleteContact,
};

export default ContactService;
