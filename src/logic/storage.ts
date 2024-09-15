import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { SyncConfigItem } from '~/types'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')
export const settingTableData = useWebExtensionStorage<SyncConfigItem[]>('setting-table-data', [{
  from: '.example.com',
  to: 'localhost',
  include: [],
  exclude: [],
  editing: false,
}])
