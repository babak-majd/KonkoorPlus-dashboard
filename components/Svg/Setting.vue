<template>
  <div class="min-w-6">
    <svg :class="active ? 'stroke-main' : 'stroke-disabled'"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 9.11035V14.8804C3 17.0004 3 17.0004 5 18.3504L10.5 21.5304C11.33 22.0104 12.68 22.0104 13.5 21.5304L19 18.3504C21 17.0004 21 17.0004 21 14.8904V9.11035C21 7.00035 21 7.00035 19 5.65035L13.5 2.47035C12.68 1.99035 11.33 1.99035 10.5 2.47035L5 5.65035C3 7.00035 3 7.00035 3 9.11035Z"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  </div>
</template>

<script setup>
const props = defineProps({ active: { type: Boolean, default: false } })
</script>
