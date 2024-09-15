import { onMessage, sendMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}
browser.runtime.onStartup.addListener(() => {
  if (__DEV__) {
    browser.tabs.create({
      url: browser.runtime.getURL('dist/options/index.html'),
    })
    // browser.tabs.create({
    //   url: 'http://localhost:3303/__devtools__/'
    // })
  }
})
browser.runtime.onInstalled.addListener((): void => {
  browser.tabs.create({
    url: browser.runtime.getURL('dist/options/index.html'),
  })
})

onMessage('get-domain-cookie-keys', async ({ data }) => {
  const cookies = await browser.cookies.getAll(data)
  sendMessage('resolve-domain-cookie-keys', {
    ...data,
    keys: cookies.map(v => v.name),
  }, 'options')
})
