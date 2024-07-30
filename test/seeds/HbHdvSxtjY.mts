import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>) {
  await queries('notes').insert([
    {
      id: 1, 
      created_at: '2024-05-29 05:43:35', 
      updated_at: '2024-05-29 05:43:35', 
      content: '[{"type":"paragraph","children":[{"text":"text:NXIdNyzgq9"}]}]', 
      pageID: null
    },
  ])
}