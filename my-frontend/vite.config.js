import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: [
      'pebble-mocker-sleet.ngrok-free.dev'
    ]
  }
})