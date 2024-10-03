import { PrismaClient, Prisma } from "@prisma/client";
import { PaginationDto } from "../dto/query/pagination.dto";
import { PatchContactDto } from "../dto/contact/PatchContact.dto";
import { CreateContactDto } from "../dto/contact/CreateContact.dto";
import { PaginationContactQueryDto } from "../dto/query/pagination.contact.dto";

const prisma = new PrismaClient();

const getContacts = async (pagination: PaginationContactQueryDto) => {
  const page = parseInt(pagination.page, 10);
  const pageSize = parseInt(pagination.pageSize, 10);

  console.log("PAGINATION -> ", pagination)

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    let whereClause = {};

    // if (pagination.search) {
    //   whereClause = {
    //     OR: [
    //       { id: parseInt(pagination.search, 10) || undefined },
    //       { remoteid: { contains: pagination.search, mode: 'insensitive' } },
    //       { tag: { id:  parseInt(pagination.search, 10) || undefined  } }
    //     ]
    //   };
    // }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tag: true, // Incluir a tag relacionada
      },
    });

    return contacts;
  } catch (e: any) {
    console.error("Error in getContacts: ", e);
    throw e;
  }
};

const createContact = async (data: CreateContactDto) => {
  try {
    const contact = await prisma.contact.create({
      data: {
        remoteid: data.remoteid,
        name: data.name,
        obs: data.obs || "",
        tag: {
          connect: { id: data.tag },
        },
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
