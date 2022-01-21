const fastify = require("fastify");
const axios = require("axios");
require('dotenv').config();

function build(opts = {}) {
  const app = fastify(opts);

  const translateBodyJsonSchema = {
    type: "object",
    requred: ["text", "target"],
    properties: {
      text: { type: "string" },
      source: { type: "string" },
      target: { type: "string" },
    },
  };

  const translateResponseJsonSchema = {
    200: {
      type: "object",
      properties: {
        translatedText: { type: "string" },
      },
    },
  };

  const schema = {
    body: translateBodyJsonSchema,
    response: translateResponseJsonSchema,
  };

  app.post("/translate", { schema }, async function (request, reply) {
    const res = await axios
      .post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.API_KEY}`,
        {
          q: request.body.text,
          target: request.body.target,
          ...(request.body.source !== "detect" && {
            source: request.body.source,
          }),
        }
      )
      .catch((e) => {
        console.log(e);
      });

    return { translatedText: res.data.data.translations[0].translatedText }; // res.data.data.translations[0] = { translatedText: "Hallo", detectedSourceLanguage: "en" }
  });

  return app;
}

module.exports = build;
