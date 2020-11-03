import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import { sendSecretMail } from "./utils";
// import passport from 'passport';
import "./passport";
import { authenticateJWT } from "./passport";
import { isAuthenticated } from "./middleware";

const PORT = process.env.PORT;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }),
});

server.express.use(logger("dev"));
server.express.use(authenticateJWT);
server.start({ port: PORT }, () =>
  console.log(`Server running on port ${PORT}`)
);
