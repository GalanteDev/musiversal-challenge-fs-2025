// test-utils/setup/postgres.testcontainer.ts
import { GenericContainer } from "testcontainers";

export const startTestDatabase = async () => {
  const container = await new GenericContainer("postgres:15")
    .withEnvironment({
      POSTGRES_USER: "test",
      POSTGRES_PASSWORD: "test",
      POSTGRES_DB: "musicapp_test",
    })
    .withExposedPorts(5432)
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();
  const url = `postgresql://test:test@${host}:${port}/musicapp_test`;

  process.env.DATABASE_URL = url;

  // 👇 Agregá `stop` acá
  return {
    container,
    url,
    stop: async () => {
      await container.stop();
    },
  };
};
