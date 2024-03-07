import { Dodecorator, sleep, type TResultError } from 'dprx-types'

declare var self: Worker

class Doextractor {
  @Dodecorator.doretry({})
  static async exec({ container }: { container: any }): TResultError<any> {
    const { _id: containerId = '', token = '' } = { ...container }

    await sleep(5e3)
    return { result: 'finish' }
  }
}

self.addEventListener('message', async (event) => {
  console.log('worker.ts! starting with data:', event.data)

  await sleep(5e3)
  postMessage({ ...(await Doextractor.exec({ container: event.data })), done: true })
})
