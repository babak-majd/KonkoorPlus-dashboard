<template>
  <div class="relative flex flex-col lg:flex-row gap-8 lg:gap-0 w-full h-svh bg-stone-100" dir="rtl">
    <!-- loading -->
    <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>
    <!-- mobile header -->
    <div class="lg:hidden flex items-center bg-base-100 justify-between p-5 border-b">
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

    <div class="hidden lg:flex flex-col justify-between min-w-64 bg-white border-l border-l-stone-300">
      <!-- header and links -->
      <div class="flex flex-col gap-9">
        <!-- header -->
        <div class="flex items-center py-10 px-6">
          <NuxtLink to="/">
            <SvgLogoDesktop class="w-40" />
          </NuxtLink>
        </div>
        <!-- links -->
        <div class="flex flex-col gap-4 m-4">
          <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('') ? 'text-main bg-main-100' : ''">
            <SvgHome :active="check_page_is_active('')" />
            <span>خانه</span>
          </NuxtLink>
          <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('setting') ? 'text-main bg-main-100' : ''">
            <SvgSetting :active="check_page_is_active('setting')" />
            <span>ابزارها</span>
          </NuxtLink>
          <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('note') ? 'text-main bg-main-100' : ''">
            <SvgNote :active="check_page_is_active('note')" />
            <span>گزارش ها</span>
          </NuxtLink>
          <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('profile') ? 'text-main bg-main-100' : ''">
            <SvgProfileUser :active="check_page_is_active('profile')" />
            <span>کنکولیگ</span>
          </NuxtLink>
          <NuxtLink to="/overview" class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('overview') ? 'text-main bg-main-100' : ''">
            <SvgDiagram :active="check_page_is_active('overview')" />
            <span>نمای کلی</span>
          </NuxtLink>
        </div>
      </div>

      <!-- logout -->
      <div class="flex mb-8 mx-2">
        <button @click="logout()" class="text-main w-full rounded-lg flex items-center gap-2 py-2 px-4">
          <SvgLogout :active="true" />
          <span>خروج</span>
        </button>
      </div>
    </div>

    <!-- page content -->
    <div class="flex flex-col w-full h-full bg-stone-100">
      <!-- desktop header -->
      <div class="hidden lg:flex items-center h-28 px-7 py-5 bg-white border-b border-stone-300">
        <!-- profile -->
        <div class="flex items-center gap-3">
          <img :src="profileSrc" id="profile-image" class="w-12 h-12 rounded-full bg-gray-300"
            @error="failedToLoadImage()" alt="profile-image" />
          <span class="font-semibold">
            {{ name }}
          </span>
        </div>
      </div>
      <div class="flex w-full h-full lg:p-8">
        <NuxtPage class="bg-base-100 rounded-md" />
      </div>
    </div>

    <!-- mobile footer links -->
    <div class="lg:hidden flex flex-col gap-4 items-center absolute right-5 bottom-8 z-50">
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
        <NuxtLink to="/overview">
          <SvgDiagram :active="check_page_is_active('overview')" />
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

function logout() {
  $userData.logout()
  return navigateTo('/auth/login')
}
</script>

<style scoped>
#opnLinkCheckBox:checked~#link-list {
  height: 10.2rem;
  padding: 0.5rem;
}
</style>
