<template>
  <div class="flex w-screen h-screen text-base-100 font-iranyekan">
    <div class="w-full h-full">
      <div
        class="flex flex-col lg:flex-row h-full w-full justify-center lg:justify-center items-center gap-6 lg:gap-10">
        <span v-if="isMobile">
          <SvgKonkourplus :width="250" />
        </span>
        <div v-else>
          <SvgKonkourplus :width="210" />
        </div>
        <span>
          <NuxtPage />
        </span>
      </div>
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
