<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <span v-if="typeof item === 'string'"> {{ item }}</span>
        <NuxtLink :to="item.url" v-else>{{ item.text }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({ items: Array, required: true })
</script>

<style scoped>
.breadcrumb {
  @apply flex min-w-fit text-disabled
}

.breadcrumb ul {
  display: block;
}

.breadcrumb ul li {
  display: inline;
  padding-right: 0.25rem;
}

.breadcrumb ul li:not(:last-child)::after {
  content: '>';
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}

.breadcrumb ul li a {
  @apply hover:underline underline-offset-4
}
</style>