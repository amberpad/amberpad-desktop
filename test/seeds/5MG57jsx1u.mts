import knex from "knex";

export default async function (queries: knex.Knex<any, unknown[]>) {
  await queries('notepads').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:FQigMfgR2T'},
    {id: 2, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:mCcJfjD7aL'},
    {id: 3, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:X9Tmjvs59s'},
    {id: 4, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:dkjifVwWWB'},
    {id: 5, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:CDGjmwckBJ'},
    {id: 6, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:B75IzvFeWm'},
    {id: 7, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:t2DPqARHz3'},
    {id: 8, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:44l7Z2HK1o'},
    {id: 9, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4twzcuOVjO'},
    {id: 10, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:P47NSmceKI'},
    {id: 11, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:xsZO6xO5pW'},
    {id: 12, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:WcAR8NJcvL'},
    {id: 13, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:rGC938fnLy'},
    {id: 14, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4d70Xx4LsV'},
    {id: 15, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:15IPCDcz5o'},
    {id: 16, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:whSzzvOdpr'},
    {id: 17, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:6UnRtNb66d'},
    {id: 18, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:fQelJo32iF'},
    {id: 19, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:iwnJ42RlTu'},
    {id: 20, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:raLB797Kzs'},
    {id: 21, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:ujJ86RWPhY'},
    {id: 22, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:31pfAmt9mJ'},
    {id: 23, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4Pno6jzdvd'},
    {id: 24, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:jjLRj1JzLO'},
    {id: 25, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:sgKR3U3i2Y'},
  ])
}
