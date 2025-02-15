import { defineConfig } from 'cypress'

export default defineConfig({
  fileServerFolder: 'dist',
  fixturesFolder: false,
  projectId: 'etow1b',
  e2e: {
    baseUrl: 'http://localhost:4173/',
    specPattern: 'cypress/e2e/**/*.ts',
    retries: {
      runMode: 2,
      openMode: 0
    },
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32
  }
})
