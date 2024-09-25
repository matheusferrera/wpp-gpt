import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cria ou conecta valores padrão para a tabela Tag
  const defaultTags = [
    { name: "VIP" },
    { name: "Cliente Fiel" },
    { name: "Bot" },
  ];

  for (const tag of defaultTags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log("Valores padrão de Tag inseridos no banco de dados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
