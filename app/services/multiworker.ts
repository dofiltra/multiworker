import { Dodecorator, type TResultError } from 'dprx-types'
import path from 'path'

export class Multiworker {
  static get rootPath() {
    return path.resolve(import.meta.dir, '..')
  }

  @Dodecorator.doretry({})
  static async createWorker({
    filepath,
    data,
    events,
  }: {
    filepath: string
    data?: any
    events?: {
      onMessage?: (o: { data: any }) => TResultError<any>
    }
  }): TResultError<Worker> {
    const workerURL = new URL(`../${filepath}`, import.meta.url).href
    const worker = new Worker(workerURL)

    worker.addEventListener('open', () => {
      console.log('worker is open!')
    })
    worker.addEventListener('close', (event: CloseEvent) => {
      console.log('worker is being closed')
    })
    worker.addEventListener('message', async (event: MessageEvent) => {
      await events?.onMessage?.({ data: event.data })

      if (event.data?.done) {
        worker.terminate()
      }
    })
    worker.postMessage(data)

    return { result: worker }
  }
}
