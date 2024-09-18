export interface SyncConfigItem {
  from: string
  to: string
  url: string
  include: string[]
  exclude: string[]
  availableKeys?: string[]
  editing: boolean
  disabled: boolean
}
