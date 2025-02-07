<template>
  <div class="flex flex-col lg:flex-row gap-8 lg:gap-0 w-full min-h-svh bg-stone-100" dir="rtl">
    <!-- mobile header -->
    <div class="print:hidden lg:hidden flex items-center bg-base-100 justify-between p-5 border-b">
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

    <div class="print:hidden hidden lg:flex flex-col justify-between min-w-64 bg-white border-l border-l-stone-300">
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
          <NuxtLink to="/tools" class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('tools') ? 'text-main bg-main-100' : ''">
            <SvgSetting :active="check_page_is_active('tools')" />
            <span>ابزارها</span>
          </NuxtLink>
          <NuxtLink to="/reports" class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('reports') ? 'text-main bg-main-100' : ''">
            <SvgNote :active="check_page_is_active('reports')" />
            <span>گزارش ها</span>
          </NuxtLink>
          <NuxtLink to="/konkoleague" class="rounded-lg py-2 px-4 flex items-center gap-2"
            :class="check_page_is_active('konkoleague') ? 'text-main bg-main-100' : ''">
            <SvgProfileUser :active="check_page_is_active('konkoleague')" />
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
    <div class="flex flex-col w-full min-h-svh">
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
        <NuxtPage class="bg-base-100 rounded-md h-full" />
      </div>
    </div>

    <!-- mobile footer links -->
    <ToolsDrawer id="mobile-menu" class="lg:hidden z-50">
      <div class="bg-base-200 text-base-content min-h-full w-60 p-4 flex flex-col justify-between gap-8">
        <!-- logo -->
        <div class="flex items-center pt-4 px-2">
          <div class="w-full p-3">
            <SvgLogoDesktop class="w-full" />
          </div>
        </div>
        <ul class="flex flex-col gap-4 -mt-28">
          <!-- Sidebar content here -->
          <li>
            <NuxtLink to="/" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('') ? 'text-main bg-main-100' : ''">
              <SvgHome :active="check_page_is_active('')" />
              <span>خانه</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/tools" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('tools') ? 'text-main bg-main-100' : ''">
              <SvgSetting :active="check_page_is_active('tools')" />
              <span>ابزارها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/reports" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('reports') ? 'text-main bg-main-100' : ''">
              <SvgNote :active="check_page_is_active('reports')" />
              <span>گزارش ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/konkoleague" class="rounded-lg py-2 px-4 flex items-center gap-2"
              :class="check_page_is_active('konkoleague') ? 'text-main bg-main-100' : ''">
              <SvgProfileUser :active="check_page_is_active('konkoleague')" />
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
        <!-- logout -->
        <div class="flex mb-8 mx-2">
          <button @click="logout()" class="text-main w-full rounded-lg flex items-center gap-2 py-2 px-4">
            <SvgLogout :active="true" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </ToolsDrawer>
  </div>
</template>

<script setup>
import { useUserData } from '~/store/user_data';

const current_page = () => {
  const path = useRoute().fullPath.split('/')
  return path[1]
}
const check_page_is_active = (page) => {
  return current_page() === page
}
const userData = useUserData()
const name = ref('')
const profileSrc = ref('/images/default-profile.png')

onMounted(() => {
  name.value = userData.fullname
  profileSrc.value = defaultProfileImageByGender(userData.getUserData().gender)
})

function failedToLoadImage() {
  profileSrc.value = defaultProfileImageByGender(userData.getUserData().gender)
}

function logout() {
  userData.logout()
  return navigateTo('/auth/login-with-password')
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
