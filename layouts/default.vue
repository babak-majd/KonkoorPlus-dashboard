<template>
  <div
    class="flex flex-col lg:flex-col-reverse w-full !h-[93vh] lg:!h-screen bg-base-100 bg-gradient-to-b from-[#E9F3F6] to-[#F1F6F7] p-2 gap-2 text-base-content font-iranyekan relative"
    dir="rtl">
    <div class="h-full rounded-md shadow-lg bg-white overflow-y-auto">
      <NuxtPage />
    </div>
    <div class="h-16 rounded-md shadow-md bg-white flex flex-row items-center px-2">
      <NuxtLink to="/tools" class="w-1/5 flex justify-around items-center" :class="active_section === 'tools' ? 'text-primary' : ''">ابزارها</NuxtLink>
      <NuxtLink to="/reports" class="w-1/5 flex justify-around items-center" :class="active_section === 'reports' ? 'text-primary' : ''">گزارش‌ها</NuxtLink>
      <div class="btn-square w-1/5 rounded-full flex justify-around items-center">
        <NuxtLink to="/">
          <SvgKonkourplus :width="40" />
        </NuxtLink>
      </div>
      <NuxtLink to="/konkoleague" class="w-1/5 flex justify-around items-center" :class="active_section === 'konkoleague' ? 'text-primary' : ''">کنکولیگ</NuxtLink>
      <NuxtLink to="/analytics" class="w-1/5 flex justify-around items-center" :class="active_section === 'analytics' ? 'text-primary' : ''">نمای‌کلی</NuxtLink>
    </div>
  </div>  
</template>

<script setup>
import ConfigStore from "../store/ConfigStore";

const active_section = ref("");
const route = useRoute();

const reload_store = () => {
  ConfigStore.reload()
    .then(() => { })
    .catch((error) => {
      console.error("Error reloading store:", error);
    });
};

onBeforeMount(() => {
  active_section.value = route.path.split("/")[1].toLowerCase();
  reload_store();
});

function change_active_section(section) {
  active_section.value = section;
}

watch(() => route.path, () => {
  change_active_section(route.path.split("/")[1]);
});

</script>
