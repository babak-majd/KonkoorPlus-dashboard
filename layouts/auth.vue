<template>
  <div class="relative flex flex-col items-center justify-center w-screen h-screen font-iranyekan">
    <!-- form -->
    <div class="flex flex-col items-center lg:flex-row max-w-xl gap-12 lg:gap-8">

      <SvgLogoDesktop class="w-56" v-if="isMobile" />
      <NuxtPage />
      <SvgLogo class="w-56" v-if="!isMobile" />
    </div>
  </div>
</template>

<script setup>
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const isMobile = computed(() => screenWidth.value < 1024);
</script>
