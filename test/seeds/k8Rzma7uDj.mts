import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>) {
  await queries('notepads').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:nlYsA3rB31'},
  ])
  await queries('pages').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:g5CtZHIxOv', notepadID: 1},
  ])
}