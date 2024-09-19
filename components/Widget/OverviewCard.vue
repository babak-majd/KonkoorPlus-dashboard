<template>
  <div class="flex flex-col p-4 bg-base-250 w-full h-full rounded-xl gap-4">
    <div class="rounded-lg bg-main p-2 w-20 h-20">
      <slot name="svg-file"></slot>
    </div>
    <h3 class="text-xl font-semibold">{{ title }}</h3>
    <slot name="main"></slot>
    <!-- link -->
    <div class="flex items-center justify-end">
      <NuxtLink :to="link" class="flex items-center gap-2 text-base-500">
        <span>مشاهده</span>
        <SvgArrowLeft />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ title: { type: String, required: true }, link: { type: String, required: true } })
</script>

<style></style>