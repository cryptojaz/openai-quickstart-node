import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const emoji = req.body.emoji || '';
  if (emoji.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid emoji",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(emoji),
      temperature: 0.25,
      max_tokens: 515,
      top_p: 0.25,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(emoji) {
  const capitalizedemoji =
    emoji[0].toUpperCase() + emoji.slice(1).toLowerCase();
  return `Convert words into emojis.


Word: ${capitalizedemoji}
Emoji:`;
}
 