<script setup lang="ts">
import { onMessage, sendMessage } from 'webext-bridge/options'
import { cloneDeep } from 'lodash-es'
import { addConfig, createNewConfig, deleteConfig, exportConfig, importConfig, settingTableData } from '~/logic'
import type { SyncConfigItem } from '~/types'

settingTableData.value = settingTableData.value.map((v) => {
  return {
    ...v,
    include: v.include || [],
    exclude: v.exclude || [],
    availableKeys: v.availableKeys || [],
    editing: false,
  }
})
const tempEditingRow = ref<SyncConfigItem>(createNewConfig())
function handleEditClick(row: SyncConfigItem) {
  settingTableData.value.forEach(v => v.editing = false)
  row.editing = true
  tempEditingRow.value = cloneDeep(row)
  sendMessage('get-domain-cookie-keys', { domain: tempEditingRow.value!.from }, 'background')
  onMessage('resolve-domain-cookie-keys', ({ data }) => {
    const { domain, keys } = data
    if (domain === tempEditingRow.value!.from) {
      tempEditingRow.value!.availableKeys = keys
    }
  })
}
function handleToggleDisable(row: SyncConfigItem) {
  row.disabled = !row.disabled
}

function handleSaveClick(index: number) {
  settingTableData.value[index] = tempEditingRow.value!
  settingTableData.value[index].editing = false
}
function handleAddConfig() {
  settingTableData.value.forEach(v => v.editing = false)
  const newItem = createNewConfig()
  newItem.editing = true
  addConfig(newItem)
  tempEditingRow.value = newItem
}
</script>

<template>
  <div>
    <el-table :data="settingTableData" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column label="From">
        <template #default="{ row }">
          <el-text v-if="!row.editing" :type="row.disabled ? 'info' : undefined">
            {{ row.from }}
          </el-text>
          <el-input v-else v-model="tempEditingRow.from" />
        </template>
      </el-table-column>
      <el-table-column label="To">
        <template #default="{ row }">
          <el-text v-if="!row.editing" :type="row.disabled ? 'info' : undefined">
            {{ row.to }}
          </el-text>
          <el-input v-else v-model="tempEditingRow.to" />
        </template>
      </el-table-column>
      <el-table-column label="Url">
        <template #default="{ row }">
          <el-text v-if="!row.editing" :type="row.disabled ? 'info' : undefined">
            {{ row.url }}
          </el-text>
          <el-input v-else v-model="tempEditingRow.url" />
        </template>
      </el-table-column>
      <el-table-column label="Include">
        <template #default="{ row }">
          <el-text v-if="!row.editing" :type="row.disabled ? 'info' : undefined">
            {{ row.include?.join(',') || 'All' }}
          </el-text>
          <el-select
            v-else v-model="tempEditingRow.include" multiple filterable allow-create default-first-option
            :reserve-keyword="false" placeholder="Choose key for your cookies to sync"
          >
            <el-option v-for="item in row.availableKeys" :key="item" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Exclude">
        <template #default="{ row }">
          <el-text v-if="!row.editing" :type="row.disabled ? 'info' : undefined">
            {{ row.exclude?.join(',') || 'None' }}
          </el-text>
          <el-select
            v-else v-model="tempEditingRow.exclude" multiple filterable allow-create default-first-option
            :reserve-keyword="false" placeholder="Choose key for exclude cookies"
          >
            <el-option v-for="item in row.availableKeys" :key="item" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="190">
        <template #default="{ row, $index }">
          <template v-if="!row.disabled">
            <el-button v-if="!row.editing" link type="primary" size="small" @click="handleEditClick(row)">
              Update
            </el-button>
            <el-button v-else link type="primary" size="small" @click="handleSaveClick($index)">
              Save
            </el-button>
          </template>
          <el-button link :type="row.disabled ? 'primary' : 'warning'" size="small" @click="handleToggleDisable(row)">
            {{ row.disabled ? 'Enable' : 'Disable' }}
          </el-button>
          <el-button v-if="!row.editing" link type="danger" size="small" @click="deleteConfig(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4">
      <el-button @click="handleAddConfig">
        <template #icon>
          <i class="mr-1 i-ant-design-plus-outlined" />
        </template>
        Add
      </el-button>
      <el-button @click="() => importConfig()">
        <template #icon>
          <i class="mr-1 i-ant-design-import-outlined" />
        </template>
        Import(Incremental)
      </el-button>
      <el-button @click="() => importConfig(true)">
        <template #icon>
          <i class="mr-1 i-ant-design-import-outlined" />
        </template>
        Import(Full)
      </el-button>
      <el-button @click="exportConfig">
        <template #icon>
          <i class="mr-1 i-ant-design:export-outlined" />
        </template>
        Export
      </el-button>
    </div>
  </div>
</template>
