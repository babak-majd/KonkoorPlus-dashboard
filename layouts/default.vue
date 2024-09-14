<template>
  <div class="relative flex flex-col w-full h-svh" dir="rtl">
    <!-- loading -->
    <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>
    <!-- mobile header -->
    <div class="flex items-center justify-between p-5 border-b">
      <!-- profile -->
      <div class="flex items-center gap-3">
        <img :src="profileSrc" id="profile-image" class="w-12 h-12 rounded-full bg-gray-300"
          @error="failedToLoadImage()" alt="profile-image" />
        <span class="font-semibold">
          {{ name }}
        </span>
      </div>

      <!-- notification -->
      <div class="relative">
        <SvgNotificaiton class="w-8" />
        <div class="absolute bg-main-500 w-3 h-3 rounded-full -top-1.5 -right-1.5"></div>
      </div>
    </div>

    <!-- page content -->
    <div class="w-full h-full">
      <NuxtPage />
    </div>

    <!-- mobile footer links -->
    <div class="flex flex-col gap-4 items-center absolute right-5 bottom-8 z-50">
      <input type="checkbox" id="opnLinkCheckBox" hidden />
      <!-- links -->
      <div id="link-list"
        class="flex flex-col justify-between h-0 p-0 overflow-hidden rounded-full bg-main-100 transition-all duration-300">
        <NuxtLink to="/">
          <SvgHome :active="check_page_is_active('')" />
        </NuxtLink>
        <NuxtLink>
          <SvgSetting :active="check_page_is_active('setting')" />
        </NuxtLink>
        <NuxtLink>
          <SvgNote :active="check_page_is_active('note')" />
        </NuxtLink>
        <NuxtLink>
          <SvgProfileUser :active="check_page_is_active('profile')" />
        </NuxtLink>
        <NuxtLink>
          <SvgDiagram :active="check_page_is_active('diagram')" />
        </NuxtLink>
      </div>
      <div class="w-10 h-10 p-2 bg-main-100 rounded-full">
        <label for="opnLinkCheckBox">
          <SvgDashboard class="w-6" :active="true" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
const current_page = () => {
  const path = useRoute().fullPath.split('/')
  return path[1]
}
const check_page_is_active = (page) => {
  return current_page() === page
}
const { $axios, $userData } = useNuxtApp()
const loading = ref(false)
const name = ref('')
const profileSrc = ref('/images/default-profile.png')
onMounted(() => {
  getUserData()
})

async function getUserData() {
  if (!$userData.isLogin()) {
    loading.value = true
    try {
      let response = await $axios.get("students/profile")
      if (response.data.ok) {
        $userData.setUserData(response.data.data)
        name.value = response.data.data.name
      }
    } catch (execption) {
      console.log(execption)
    } finally {
      loading.value = false
    }
  }
  else {
    name.value = $userData.fullname()
  }
}
function failedToLoadImage() {
  const el = document.getElementById('profile-image')
  el.src = '/images/default-profile.png'
}
</script>

<style scoped>
#opnLinkCheckBox:checked~#link-list {
  height: 10.2rem;
  padding: 0.5rem;
}
</style>
