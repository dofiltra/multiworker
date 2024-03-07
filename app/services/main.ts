import os from 'os'
import { DowsClient, DoredisaClient, DomongoClient } from 'doback'
import { Dodecorator } from 'dprx-types'
import { Multiworker } from './multiworker'

export class App {
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
  static async startTimer({}: {}) {
    await Multiworker.createWorker({
      filepath: `/modules/doextractor/worker.ts`,
      data: { o: 'Sent from main thread!' },
      events: {
        onMessage: async ({ data }) => {
          console.log(data)
          return {}
        },
      },
    })
  }
}
