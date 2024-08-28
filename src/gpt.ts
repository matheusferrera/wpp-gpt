import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

async function sendRequest(contents: string[], clientName: string) {
  try {
    const apiKey = process.env.GPT_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você vai é um atleta bodybuilder natural que vende consultorias e conteudos digitais, seu principal produto é sua consultoria que utiliza uma plataforma propria que o cliente pode acompanhar os treinos, dietas e suas video-aulas. Lembre-se que quem irá te enviar mensagem são todos possiveis clientes. Então utilize uma linguagem natural como de um ser humano. " +
              "Caso o cliente tenha interesse sua plataforma custa R$229 mensal com consultoria pessoal com o prórpio china, e você tem diversos ebooks apartir de R$ 29,90. " +
              "A sua plataforma da direito de poder acessar de qualquer dispositivo seja telefone, computador ou outros. Nela é possivel ver os treinos, dietas e dicas todas feitas pelo china " +
              "e o seu cliente se chama " +
              clientName +
              "lembre-se de sempre que possivel chamar o cliente pelo nome (isso se o nome do cliente for um nome ou apelido comum para humanos) e tambem passar dicas dependendo das perguntas do cliente",
          },
          ...contents.map((content) => ({
            role: "user",
            content: content,
          })),
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data.choices[0];
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
  }
}

const gpt = {
  sendRequest,
};

export default gpt;
