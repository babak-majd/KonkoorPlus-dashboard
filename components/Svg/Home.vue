<template>
  <div class="min-w-6">
    <svg :class="active ? 'stroke-main' : 'stroke-disabled'" viewBox="0 0 22 22" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.0003 16.9998V13.9998M9.07026 1.81985L2.14027 7.36985C1.36027 7.98985 0.860265 9.29985 1.03027 10.2798L2.36027 18.2398C2.60027 19.6598 3.96027 20.8098 5.40027 20.8098H16.6003C18.0303 20.8098 19.4003 19.6498 19.6403 18.2398L20.9703 10.2798C21.1303 9.29985 20.6303 7.98985 19.8603 7.36985L12.9303 1.82985C11.8603 0.969849 10.1303 0.969849 9.07026 1.81985Z"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  </div>
</template>

<script setup>
const props = defineProps({ active: { type: Boolean, default: false } })
</script>
