import { PrismaClient, Prisma } from "@prisma/client";
import { PaginationDto } from "../dto/query/pagination.dto";
import { PatchMessageDto } from "../dto/message/PatchMessage.dto";

const prisma = new PrismaClient();

const getMessages = async (pagination: PaginationDto) => {
  const page = parseInt(pagination.page, 10);
  const pageSize = parseInt(pagination.pageSize, 10);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const messages = await prisma.message.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc", // Supondo que você queira ordenar as mensagens pela data de criação
      },
    });

    return messages;
  } catch (e: any) {
    console.log("ERROR -> ", e);
    throw e; // Re-lançando o erro para tratamento posterior, se necessário
  }
};

const patchMessages = async (data: PatchMessageDto) => {
  console.log("DATA NO PATCH -> ", data);
  try {
    const { id, ...updateData } = data; // Remove o id do data e mantém o restante para update

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: updateData as Prisma.MessageUpdateInput,
    });

    return updatedMessage;
  } catch (e: any) {
    console.log("ERROR -> ", e);
    throw e; // Re-lançando o erro para tratamento posterior, se necessário
  }
};

const MessageService = {
  getMessages,
  patchMessages,
};

export default MessageService;
