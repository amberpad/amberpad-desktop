import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>) {
  await queries('notepads').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:0VaVib2lEC'},
    {id: 2, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:x6KEsv52cI'},
    {id: 3, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:SPve5hyUxQ'},
    {id: 4, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:ZPazgvmAQ1'},
    {id: 5, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:sFzZbw7Bwg'},
  ])
  await queries('pages').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:8qmFxlN6ah', notepadID: 1},
    {id: 2, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:uyVToBcNtO', notepadID: 2},
    {id: 3, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:kemCkNAyeW', notepadID: 3},
    {id: 4, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:SCJhRsmkxE', notepadID: 4},
    {id: 5, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:9kAG80tFZt', notepadID: 5},
  ])
  await queries('notes').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', content: '[{"type":"paragraph","children":[{"text":"text:jq7UI8KMvB"}]}]', pageID: 1},
    {id: 2, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', content: '[{"type":"paragraph","children":[{"text":"text:gej4OfeeNQ"}]}]', pageID: 2},
    {id: 3, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', content: '[{"type":"paragraph","children":[{"text":"text:l5oTPErF7j"}]}]', pageID: 3},
    {id: 4, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', content: '[{"type":"paragraph","children":[{"text":"text:OAs5IYIKU8"}]}]', pageID: 4},
    {id: 5, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', content: '[{"type":"paragraph","children":[{"text":"text:04v3yu51Hh"}]}]', pageID: 5},
  ])
}