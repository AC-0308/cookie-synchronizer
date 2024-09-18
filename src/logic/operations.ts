import { useFileDialog } from '@vueuse/core'
import { saveAs } from 'file-saver'
import { settingTableData } from './storage'
import type { SyncConfigItem } from '~/types'

export function createNewConfig(): SyncConfigItem {
  return {
    from: '',
    to: '',
    url: '',
    editing: false,
    disabled: false,
    include: [],
    exclude: [],
  }
}

export function addConfig(config: SyncConfigItem) {
  settingTableData.value.push(config)
}
export function importConfig(full = false) {
  const { open, onChange } = useFileDialog({
    accept: '.json',
    directory: false,
    multiple: false,
    reset: true,
  })
  onChange(async (files) => {
    try {
      const file = files?.[0]
      if (!file)
        return
      const jsonText = await file.text()
      const jsonObj = JSON.parse(jsonText) as {
        data: SyncConfigItem[]
      }
      if (!jsonObj?.data?.every((v) => {
        return typeof v.from === 'string'
          && typeof v.to === 'string'
      })) {
        throw new Error('please import valid json!')
      }
      const { data } = jsonObj
      if (full) {
        settingTableData.value = data
      }
      else {
        settingTableData.value = [
          ...settingTableData.value,
          ...data,
        ]
      }
    }
    catch (e) {
      console.error(e)
    }
  })
  open()
}

export function exportConfig() {
  const file = new File([JSON.stringify({
    data: settingTableData.value,
  })], 'cookie-synchronizer.config.json', { type: 'text/plain;charset=utf-8' })
  saveAs(file)
}
export function deleteConfig(config: SyncConfigItem) {
  settingTableData.value = settingTableData.value.filter(v => v !== config)
}
