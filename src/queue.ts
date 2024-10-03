import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { getOrCreateWhatsAppClient } from ".";

// Criação da fila de mensagens
const messageQueue = new Queue("messageQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Processamento da fila
messageQueue.process("Massive messages", async (job) => {
  const clientWpp = await getOrCreateWhatsAppClient(job.data.clientId);
  const userContact = await clientWpp.getNumberId(job.data.to);
  const formatedRemoteId = userContact?._serialized as string;

  try {
    const responseSendMessage = await clientWpp.sendMessage(formatedRemoteId, job.data.content);
    console.log("Mensagem enviada com sucesso:", formatedRemoteId);
    
    job.log(`Mensagem enviada com sucesso para ${formatedRemoteId}`);
    
    await job.update({
      ...job.data,
      status: 'success',
      response: responseSendMessage
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    let errorMessage = "Erro desconhecido";
    if (error instanceof Error) {
      errorMessage = error.message.includes("wid error: invalid wid")
        ? "Número de telefone inválido ou não registrado no WhatsApp"
        : error.message;
    }
    
    job.log(`Erro ao enviar mensagem para ${job.data.to}: ${errorMessage}`);
    
    await job.update({
      ...job.data,
      status: 'error',
      error: errorMessage
    });
  }
});

// Configuração do Bull Dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(messageQueue)],
  serverAdapter: serverAdapter,
});

export { messageQueue, serverAdapter };