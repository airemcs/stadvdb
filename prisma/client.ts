import { PrismaClient } from '@prisma/client';

const main_node = new PrismaClient({
  datasources: {
    db: {
      url: process.env.main_node,
    },
  },
});

const node_2 = new PrismaClient({
  datasources: {
    db: {
      url: process.env.node_2,
    },
  },
});

export { main_node, node_2 };