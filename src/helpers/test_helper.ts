import { createTestDb, dropTestDb, migrate } from '../db';

export const setupDb = async () => {
  try {
    await createTestDb();
    await migrate();
  } catch (_e) {
    throw new Error('There was a problem while setting up the DB');
  }
};

export const dropDb = async () => {
  try {
    await dropTestDb();
  } catch (e) {
    throw new Error('There was a problem while removing the DB');
  }
};

export const estimateExecutionTime = async (func: any) => {
  const initialTime = new Date().getTime();
  await func;
  const finalTime = new Date().getTime();

  return finalTime - initialTime;
};
