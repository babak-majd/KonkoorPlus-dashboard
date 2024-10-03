<template>
  <div class="flex w-full items-center justify-start rounded-full min-h-4 bg-main-200 overflow-clip">
    <div class="h-full bg-main rounded-full text-transparent" :style="`width: ${width};`"> </div>
  </div>
</template>

<script setup>
const props = defineProps({ value: { type: Number, required: true }, max: { type: Number, default: 100 } })
const width = ref('0px')

onMounted(() => {
  let result = (props.value * 100) / props.max
  width.value = `${result}%`
})
</script>

<style></style>