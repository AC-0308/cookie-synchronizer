import { onMessage, sendMessage } from 'webext-bridge/background'
import { settingTableData } from '~/logic'

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

browser.cookies.onChanged.addListener(({ cookie, removed }) => {
  const { domain, name, value } = cookie
  settingTableData.value.forEach((config) => {
    const { from, to, url, include, exclude, disabled } = config
    if (disabled) {
      return
    }
    const includeMatch = (!include.length || include.some(reg => new RegExp(reg).test(name)))
    const excludeMatch = exclude.some(reg => new RegExp(reg).test(name))
    if (
      domain.endsWith(from)
      && includeMatch
      && !excludeMatch
    ) {
      browser.cookies.set({
        domain: to,
        url,
        name,
        value: removed ? '' : value,
      })
    }
  })
})
