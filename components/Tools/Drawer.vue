<template>
  <div class="drawer">
    <input :id="id" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side">
      <label :for="id" aria-label="close sidebar" class="drawer-overlay"></label>

      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ id: { type: String, required: true } })
</script>

<style></style>