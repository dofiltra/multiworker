import { App } from './services/main'

await App.build({
  timerOpts: {
    delay: 60e3,
  },
})
