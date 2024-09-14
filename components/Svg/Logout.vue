<template>
  <div class="min-w-6">
    <svg :class="active ? 'stroke-main' : 'stroke-disabled'" width="24" height="24" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.2532 15.4935L22.6665 12.0802L19.2532 8.66683M9.01318 12.0802H22.5732M11.6799 22.6668C5.78652 22.6668 1.01318 18.6668 1.01318 12.0002C1.01318 5.3335 5.78652 1.3335 11.6799 1.3335"
        stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  </div>
</template>

<script setup>
const props = defineProps({ active: { type: Boolean, default: false } })
</script>
