import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/core/helpers/graphql/schema";
import { resolvers } from "@/core/helpers/graphql/resolvers";
import { NextRequest } from "next/server";
import { requireAuth } from "@/core/helpers/require-auth";

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export async function GET(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  return handler(req);
}
export async function POST(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  return handler(req);
}
