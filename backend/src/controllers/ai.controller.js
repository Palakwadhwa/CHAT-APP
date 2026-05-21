import axios from "axios";

const personalities = {

  music:
    "You are a chill music DJ assistant.",

  study:
    "You are a strict but motivating study mentor.",

  gaming:
    "You are a funny gamer friend full of memes.",

  chill:
    "You are a warm comforting friend.",

  midnight:
    "You are emotional, thoughtful, and poetic.",
};

export const askAI = async (req, res) => {

  try {

    // receive BOTH prompt and room
    const { prompt, room } = req.body;

    // choose personality
    const personality =
      personalities[room] ||
      "You are a friendly AI assistant.";

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",

            content: `
${personality}

User says:
${prompt}
            `,
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }

    );

    res.status(200).json({
      reply:
        response.data.choices[0].message.content,
    });

  } catch (error) {

    console.log(
      "AI ERROR:",
      error.response?.data || error
    );

    res.status(500).json({
      error: "AI failed",
    });

  }

};