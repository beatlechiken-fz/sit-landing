import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

let client: ApolloClient | null = null;

export function getApolloClient(): ApolloClient {
  if (client) return client;

  client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "/api/graphql",
    }),
    cache: new InMemoryCache({
      typePolicies: {
        PaginatedProducts: {
          // Merge pages en cache para paginación fluida
          fields: {
            data: {
              keyArgs: ["filter", ["q", "marca", "grupo", "moneda"]],
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });

  return client;
}
