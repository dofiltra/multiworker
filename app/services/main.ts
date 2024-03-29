import path from 'path'
import os from 'os'
import { DowsClient, DoredisaClient, DomongoClient } from 'doback'
import { Dodecorator, DoredisaKeyPrefix, ModuleName, sleep } from 'dprx-types'
import { Multiworker } from './multiworker'

type TTimerOpts = { delay?: number }
type TBuildSettings = {
  wsHost?: string
  timerOpts?: TTimerOpts
}

export class App {
  static get rootPath() {
    return path.resolve(import.meta.dir, '..')
  }

  @Dodecorator.doretry({})
  static async build({ wsHost = 'cache.dofiltra.com', timerOpts }: TBuildSettings) {
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

    timerOpts && this.startTimer(timerOpts)
  }

  @Dodecorator.doretry({})
  static async startTimer({ delay = 60e3 }: TTimerOpts) {
    console.log('startTimer')
    const { result: containers = [], error: errorPop } = await DoredisaClient.sPopOne<any>({
      key: `${DoredisaKeyPrefix.NextQueue}${ModuleName.Doextractor}`,
      count: 1,
      timeout: 120e3,
    })

    await Promise.all(
      containers.map(async (container) => {
        await Multiworker.createWorker({
          filepath: `/modules/doextractor/worker.ts`,
          data: container,
          events: {
            onMessage: async ({ data }) => {
              console.log(data)
              return {}
            },
          },
        })
      })
    )

    await sleep(delay)
    void this.startTimer({})
  }
}
