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

  await queries('pages').insert([
    {id: 1, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:c2852ca76b', notepadID: 1},
    {id: 2, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3a3510ae29', notepadID: 1},
    {id: 3, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:616cfc2163', notepadID: 1},
    {id: 4, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:41f4fa7a45', notepadID: 1},
    {id: 5, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:41099dc2a9', notepadID: 1},
    {id: 6, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3d0215f577', notepadID: 1},
    {id: 7, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:376ecc831f', notepadID: 1},
    {id: 8, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:0912ba6403', notepadID: 1},
    {id: 9, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:e749683256', notepadID: 1},
    {id: 10, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:220df6e440', notepadID: 1},
    {id: 11, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:10e52513ea', notepadID: 1},
    {id: 12, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:65806ad17f', notepadID: 1},
    {id: 13, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3a7c5f9aa8', notepadID: 1},
    {id: 14, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:36f01f86b5', notepadID: 1},
    {id: 15, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:592be83d30', notepadID: 1},
    {id: 16, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:ca20a8760e', notepadID: 1},
    {id: 17, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:30d9f14ed3', notepadID: 1},
    {id: 18, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:efdceba2a1', notepadID: 1},
    {id: 19, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:27805bc40d', notepadID: 1},
    {id: 20, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:9915c88519', notepadID: 1},
    {id: 21, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4a3c930d73', notepadID: 1},
    {id: 22, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:9e6a55850b', notepadID: 1},
    {id: 23, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:c6946f0d25', notepadID: 1},
    {id: 24, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:84631c3398', notepadID: 1},
    {id: 25, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:57916a4526', notepadID: 1},
    {id: 26, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:167e659302', notepadID: 1},
    {id: 27, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:389aae9559', notepadID: 1},
    {id: 28, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:cd9c7970a2', notepadID: 1},
    {id: 29, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:eb5c609264', notepadID: 1},
    {id: 30, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:f34444a3b9', notepadID: 1},
    {id: 31, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:92c7be7ff4', notepadID: 1},
    {id: 32, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:03f075a6b1', notepadID: 1},
    {id: 33, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:275a729fc1', notepadID: 1},
    {id: 34, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:b4813df1bb', notepadID: 1},
    {id: 35, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:678e0d46b7', notepadID: 1},
    {id: 36, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3abc027c23', notepadID: 1},
    {id: 37, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:94dd37ea21', notepadID: 1},
    {id: 38, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:d761cb5354', notepadID: 1},
    {id: 39, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:b6886b113e', notepadID: 1},
    {id: 40, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:8d7d5c810e', notepadID: 1},
    {id: 41, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:8a8b87bf16', notepadID: 1},
    {id: 42, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:7c3576f760', notepadID: 1},
    {id: 43, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4958ecbe3b', notepadID: 1},
    {id: 44, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:2ff0481280', notepadID: 1},
    {id: 45, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:174c0e4efb', notepadID: 1},
    {id: 46, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4604b29991', notepadID: 1},
    {id: 47, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:74a027b550', notepadID: 1},
    {id: 48, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3c9416c617', notepadID: 1},
    {id: 49, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4ac6e17866', notepadID: 1},
    {id: 50, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:175d381e76', notepadID: 1},
    {id: 51, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:4950a93286', notepadID: 1},
    {id: 52, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:2321a47e55', notepadID: 1},
    {id: 53, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:7515d8ff5f', notepadID: 1},
    {id: 54, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:b78209fc09', notepadID: 1},
    {id: 55, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:5ab539c58f', notepadID: 1},
    {id: 56, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:3954e470aa', notepadID: 1},
    {id: 57, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:af01eb7236', notepadID: 1},
    {id: 58, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:a260c113c4', notepadID: 1},
    {id: 59, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:77c742d127', notepadID: 1},
    {id: 60, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:9cec00eabe', notepadID: 1},
    {id: 61, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:ce11f76bd0', notepadID: 1},
    {id: 62, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:c4039fa037', notepadID: 1},
    {id: 63, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:d9e0c45117', notepadID: 1},
    {id: 64, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:194e52d37f', notepadID: 1},
    {id: 65, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:d53ec0abbd', notepadID: 1},
    {id: 66, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:cfcd1a06d5', notepadID: 1},
    {id: 67, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:ca42281478', notepadID: 1},
    {id: 68, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:64a1265409', notepadID: 1},
    {id: 69, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:2abd845e17', notepadID: 1},
    {id: 70, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:b9949b2f3b', notepadID: 1},
    {id: 71, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:642b72da3b', notepadID: 1},
    {id: 72, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:e75c7f3aea', notepadID: 1},
    {id: 73, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:bfdee0ae9c', notepadID: 1},
    {id: 74, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:25163a8895', notepadID: 1},
    {id: 75, created_at: '2024-05-29 05:43:35', updated_at: '2024-05-29 05:43:35', name: 'text:269dc6a2b6', notepadID: 1},
  ])

  await queries('notes').insert([
    {
      "id": 1,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:teoGsC8JN6\"}]}]",
      "pageID": null
    },
    {
      "id": 2,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:7kzdNpzAQm\"}]}]",
      "pageID": null
    },
    {
      "id": 3,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:iPXlWl2bHW\"}]}]",
      "pageID": null
    },
    {
      "id": 4,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:llkoBwYbz1\"}]}]",
      "pageID": null
    },
    {
      "id": 5,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:pQZVLYeXEY\"}]}]",
      "pageID": null
    },
    {
      "id": 6,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:Q5jziUNye1\"}]}]",
      "pageID": null
    },
    {
      "id": 7,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:LsNDFzeVq5\"}]}]",
      "pageID": null
    },
    {
      "id": 8,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:h5AsmW3VKK\"}]}]",
      "pageID": null
    },
    {
      "id": 9,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:ofbRHCuDJr\"}]}]",
      "pageID": null
    },
    {
      "id": 10,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:Bd09MTriqb\"}]}]",
      "pageID": null
    },
    {
      "id": 11,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:z5GWaJVLJB\"}]}]",
      "pageID": null
    },
    {
      "id": 12,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:7XMS9HxqMh\"}]}]",
      "pageID": null
    },
    {
      "id": 13,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:5kBAdpOnvs\"}]}]",
      "pageID": null
    },
    {
      "id": 14,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:lXk4My0JBD\"}]}]",
      "pageID": null
    },
    {
      "id": 15,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:dDSo3b93y2\"}]}]",
      "pageID": null
    },
    {
      "id": 16,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:OoPwavfytI\"}]}]",
      "pageID": null
    },
    {
      "id": 17,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:pZaWh8owv7\"}]}]",
      "pageID": null
    },
    {
      "id": 18,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:OvSBQUB9Eb\"}]}]",
      "pageID": null
    },
    {
      "id": 19,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:XEmA5DCnJB\"}]}]",
      "pageID": null
    },
    {
      "id": 20,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:zkdsNziaWg\"}]}]",
      "pageID": null
    },
    {
      "id": 21,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:kniQ8WTUrj\"}]}]",
      "pageID": null
    },
    {
      "id": 22,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:5VYnIOy9g3\"}]}]",
      "pageID": null
    },
    {
      "id": 23,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:5IteXEt8gw\"}]}]",
      "pageID": null
    },
    {
      "id": 24,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:orlZ8fLGQB\"}]}]",
      "pageID": null
    },
    {
      "id": 25,
      "created_at": "2024-05-29 05:43:35",
      "updated_at": "2024-05-29 05:43:35",
      "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"text:V5BfHdvxKv\"}]}]",
      "pageID": null
    }
  ])
}