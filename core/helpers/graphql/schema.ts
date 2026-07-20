import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Product {
    id: Int!
    clave: String!
    codigoFabricante: String
    descripcion: String!
    marca: String!
    principal: String!
    grupo: String!
    garantia: String!
    clase: String!
    requiereSerie: Boolean!
    imagen: String
    brandImage: String
    precio: Float
    moneda: Moneda
    disponible: Int!
    disponibleCD: Int!
    fechaSync: String
  }

  enum Moneda {
    Pesos
    Dolares
  }

  type PaginatedProducts {
    data: [Product!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  input ProductFilterInput {
    q: String
    marca: String
    grupo: String
    principal: String
    moneda: Moneda
    soloDisponibles: Boolean
    page: Int
    pageSize: Int
  }

  type Query {
    products(filter: ProductFilterInput): PaginatedProducts!
    product(id: Int!): Product
    marcas: [String!]!
    grupos: [String!]!
  }
`;
