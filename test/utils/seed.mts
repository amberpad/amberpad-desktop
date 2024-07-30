import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>, id: string) {
  const module = await import(`../seeds/${id}`);
  await module.default(queries);
}