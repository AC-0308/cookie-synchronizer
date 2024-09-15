<script setup lang="ts">
import logo from '~/assets/logo.svg'
</script>

<template>
  <main class="px-4 py-10  text-gray-700 dark:text-gray-200">
    <div class=" text-6xl mb-4 flex items-center justify-center">
      <img :src="logo" class="icon-btn mx-2 text-2xl w-80px h-80px " alt="extension icon">
      <span>Cookie Synchronizer</span>
    </div>
    <div class="text-center text-xl mb-8 text-gray-500">
      Synchronize your cookies between sites!
    </div>

    <SettingTable />
  </main>
</template>
