<template>
  <div class="min-w-6">
    <svg :class="active ? 'stroke-main' : 'stroke-disabled'" viewBox="0 0 20 22" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 1V4M14 1V4M5 12H13M5 16H10M14 2.5C17.33 2.68 19 3.95 19 8.65V14.83C19 18.95 18 21.01 13 21.01H7C2 21.01 1 18.95 1 14.83V8.65C1 3.95 2.67 2.69 6 2.5H14Z"
        stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  </div>
</template>

<script setup>
const props = defineProps({ active: { type: Boolean, default: false } })
</script>