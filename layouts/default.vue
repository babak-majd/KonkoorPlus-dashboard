<template>
  <div class="relative flex flex-col lg:flex-row gap-8 lg:gap-0 w-full min-h-svh bg-stone-100" dir="rtl">
    <!-- loading -->
    <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>
    <!-- mobile header -->
    <div class="lg:hidden flex items-center bg-base-100 justify-between p-5 border-b">
      <!-- links -->
      <div class="flex items-center gap-3">
        <label for="mobile-menu">
          <SvgHamburger />
        </label>
      </div>

      <!-- profile -->
      <img :src="profileSrc" id="profile-image" class="w-12 h-12 rounded-full bg-gray-300" @error="failedToLoadImage()"
        alt="profile-image" />
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
          <NuxtLink to="/" class="rounded-lg py-2 px-4 flex items-center gap-2"
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
    <ToolsDrawer id="mobile-menu" class="lg:hidden">
      <div class="bg-base-200 text-base-content min-h-full w-60 p-4 flex flex-col gap-8">
        <!-- logo -->
        <div class="flex items-center pt-4 px-2">
          <div class="w-20 p-3">
            <SvgLogo />
          </div>
        </div>
        <ul class="flex flex-col gap-4">
          <!-- Sidebar content here -->
          <li>
            <NuxtLink to="/" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('') ? 'text-main bg-main-100' : ''">
              <SvgHome :active="check_page_is_active('')" />
              <span>خانه</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('setting') ? 'text-main bg-main-100' : ''">
              <SvgSetting :active="check_page_is_active('setting')" />
              <span>ابزارها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('note') ? 'text-main bg-main-100' : ''">
              <SvgNote :active="check_page_is_active('note')" />
              <span>گزارش ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('profile') ? 'text-main bg-main-100' : ''">
              <SvgProfileUser :active="check_page_is_active('profile')" />
              <span>کنکولیگ</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/overview" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('overview') ? 'text-main bg-main-100' : ''">
              <SvgDiagram :active="check_page_is_active('overview')" />
              <span>نمای کلی</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </ToolsDrawer>
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
  profileSrc.value = defaultProfileImageByGender($userData.getUserData().gender)
}

function failedToLoadImage() {
  profileSrc.value = defaultProfileImageByGender($userData.getUserData().gender)
}

function logout() {
  $userData.logout()
  return navigateTo('/auth/login')
}
function defaultProfileImageByGender(gender) {
  return gender === 'M' ? '/images/boy.jpg' : '/images/girl.jpg'
}
</script>

<style scoped>
#opnLinkCheckBox:checked~#link-list {
  height: 10.2rem;
  padding: 0.5rem;
}

.divider {
  @apply absolute flex w-full h-full bg-base-300/20 top-0 left-0 z-50
}

.divider-list {
  @apply flex flex-col gap-4 h-full bg-base-100 w-52 px-4
}
</style>
