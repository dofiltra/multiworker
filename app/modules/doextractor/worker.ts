import { sleep } from 'dprx-types'

declare var self: Worker

self.addEventListener('message', async (event) => {
  console.log('worker.ts: "message"', event.data)

  await sleep(5e3)
  postMessage('worker.ts: result')
})
