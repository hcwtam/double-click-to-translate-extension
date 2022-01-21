const fastify = require("fastify");

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

  app.get("/translate", { schema }, async function (request, reply) {
    return { translatedText: "world" };
  });

  return app;
}

module.exports = build;
