import { Dodecorator, type TResultError } from 'dprx-types'
import path from 'path'

export class Multiworker {
  static get rootPath() {
    return path.resolve(import.meta.dir, '..')
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
