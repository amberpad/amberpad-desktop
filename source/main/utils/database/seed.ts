import path from 'node:path'
import knex from "knex";

export default async function (
  queries: knex.Knex<any, unknown[]>, 
  location: string
) {
  const module = await import(`../../../../resources/seeds/${location}`);
  await module.default(queries);
}