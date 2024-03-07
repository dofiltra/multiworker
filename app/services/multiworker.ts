import { Dodecorator, type TResultError } from 'dprx-types'
import path from 'path'
import os from 'os'
import { DowsClient, DoredisaClient, DomongoClient } from 'doback'

export class Multiworker {
  static get rootPath() {
    return path.resolve(import.meta.dir, '..')
  }

  @Dodecorator.doretry({})
  static async build({ wsHost = 'cache.dofiltra.com' }: { wsHost?: string }) {
    console.log('Starting...')
    console.log(
      'WsClient',
      await DowsClient.build({
        host: wsHost,
        token: `${os.hostname().replaceAll('-', '_')}_mutltiworker_${new Date().getTime()}`,
      })
    )
    console.log('RedisClient', await DoredisaClient.build({}))
    console.log('MongoClient', await DomongoClient.build({}))

    // log(await DoredisaClient.subscribe({ rooms: [DolistKey.OpenAiKeys] }))
  }

  @Dodecorator.doretry({})
  static async createWorker({ filepath }: { filepath: string }): TResultError<Worker> {
    const workerURL = new URL(`../${filepath}`, import.meta.url).href
    const worker = new Worker(workerURL)

    worker.addEventListener('open', () => {
      console.log('worker is open!')
    })
    worker.addEventListener('close', (event: CloseEvent) => {
      console.log('worker is being closed')
    })
    worker.addEventListener('message', (event: MessageEvent) => {
      console.log(event.data)
    })

    return { result: worker }
  }
}
