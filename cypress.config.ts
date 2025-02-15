import { defineConfig } from 'cypress'

const RUNMODE = 2
const OPENMODE = 0

export default defineConfig({
  fileServerFolder: 'dist',
  fixturesFolder: false,
  projectId: 'etow1b',
  e2e: {
    baseUrl: 'http://localhost:4173/',
    specPattern: 'cypress/e2e/**/*.ts',
    retries: {
      runMode: RUNMODE,
      openMode: OPENMODE
    },
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32
  }
})
