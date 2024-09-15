export interface SyncConfigItem {
  from: string
  to: string
  include: string[]
  exclude: string[]
  availableKeys?: string[]
  editing: boolean
}
