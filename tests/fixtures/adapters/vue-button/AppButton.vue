<script setup lang="ts">
defineProps<{ label: string }>()
const emit = defineEmits<{ (e: 'press'): void }>()
</script>

<template>
  <div class="wrap">
    <button class="btn" type="button" @click="emit('press')">
      <slot>{{ label }}</slot>
    </button>
  </div>
</template>

<style scoped>
.btn {
  background: #3b82f6;   /* reusable component; the project defines --color-action-bg in tokens.css */
  color: #fff;
  padding: 7px 13px;
  border-radius: 6px;
}
</style>
