import os from 'os'
import { DowsClient, DoredisaClient, DomongoClient } from 'doback'
import { Dodecorator, sleep } from 'dprx-types'
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

    await sleep(60e3)
    void this.startTimer({})
  }
}
