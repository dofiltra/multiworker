import { Multiworker } from './services/multiworker'

await Multiworker.build({})

const { result: doextractorWorker } = await Multiworker.createWorker({
  filepath: `/modules/doextractor/worker.ts`,
})

doextractorWorker?.postMessage({ o: 'Sent from main thread!' })
