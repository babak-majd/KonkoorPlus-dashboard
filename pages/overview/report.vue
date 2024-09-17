<template>
  <div class="w-full h-full flex flex-col p-4 gap-8">
    <!-- header -->
    <div class="flex flex-col gap-3">
      <ToolsBreadcrumb :items="[{ text: 'نمای کلی', url: '/overivew' }, 'گزارش']" />
      <h3>گزارش کلی</h3>
    </div>
    <!-- filter and report -->
    <div class="flex flex-col gap-3">
      <select
        class="bg-base-250 w-full md:max-w-64 p-2 rounded-lg focus-within:outline focus-within:outline-1 focus-within:border focus-within:outline-offset-4 focus-within:bg-white">
        <option :value="null">انتخاب درس</option>
        <option v-for="(lesson, index) in lessons" :key="index" :value="lesson.uuid">{{ lesson.text }}</option>
      </select>
      <button
        class="flex items-center justify-center gap-2 border p-2 rounded-lg border-main text-main hover:bg-main-50 transition-all duration-200">
        <span>دریافت گزارش</span>
        <SvgDownload />
      </button>
    </div>
    <ToolsChartArea :categories="[
      '', '', 'تیر',
      '', '', 'مرداد',
      '', '', 'شهریور']" :series="[
        { data: [7, 18, 15, 23, 36, 28, 37, 25, 30, 35], name: 'میزان مطالعه', type: 'area' },
      ]" />

    <div class="flex flex-col gap-5">
      <h4 class="text-lg font-semibold">سال تحصیلی</h4>
      <div class="flex items-center gap-1">
        <span class="text-lg font-semibold">365</span>
        <span>روز</span>
      </div>

      <!-- progress bar -->
      <div class="flex flex-col gap-1">
        <ToolsProgress :max="365" :value="68" />
        <div class="flex items-center justify-between text-sm p-2">
          <!-- progressed days -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="text-base-500">روز های طی شده</span>
              <span class="h-1 w-8 bg-main rounded-full"></span>
            </div>
            <span class="font-semibold">68 روز</span>
          </div>

          <!-- not progressed days -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="text-base-500">روز های باقی مانده</span>
              <span class="h-1 w-8 bg-main-200 rounded-full"></span>
            </div>
            <span class="font-semibold">297 روز</span>
          </div>
        </div>
      </div>

      <!-- activity -->
      <div class="flex flex-col py-7">
        <h5 class="text-lg font-semibold">فعالیت این ماه</h5>

        <!-- courses -->
        <div class="flex flex-col gap-6">
          <!-- course -->
          <div class="flex items-center gap-3">
            <!-- progress color -->
            <div class="flex h-full py-3">
              <span class="h-1 w-6 rounded-full bg-main"></span>
            </div>
            <div class="flex flex-col">
              <h6>زیست</h6>
              <div class="flex items-center gap-2 text-base-500">
                <span>560 تست</span>
                <span>|</span>
                <span>120 ساعت</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- progress color -->
            <div class="flex h-full py-3">
              <span class="h-1 w-6 rounded-full bg-main-400"></span>
            </div>
            <div class="flex flex-col">
              <h6>شیمی</h6>
              <div class="flex items-center gap-2 text-base-500">
                <span>560 تست</span>
                <span>|</span>
                <span>120 ساعت</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- progress color -->
            <div class="flex h-full py-3">
              <span class="h-1 w-6 rounded-full bg-main-200"></span>
            </div>
            <div class="flex flex-col">
              <h6>سایر دروس</h6>
              <div class="flex items-center gap-2 text-base-500">
                <span>560 تست</span>
                <span>|</span>
                <span>120 ساعت</span>
              </div>
            </div>
          </div>

          <!-- pie chart -->
          <div class="flex items-center justify-center relative">
            <ToolsChartPie :series="[100, 20, 64]" :labels="['زیست', 'شیمی', 'سایر']" />
            <div class="absolute flex flex-col items-center gap-0 transform" style="">
              <span class="font-semibold text-lg">360</span>
              <span class="text-base-500">ساعت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const lessons = ref([
  {
    uuid: "hgfdsfbgf",
    text: "ریاضی و فیزیک"
  },
  {
    uuid: "khjmgfdvsvfghmj",
    text: "علوم انسانی"
  },
  {
    uuid: "hgfdvsfbghfbdfdhj",
    text: "علوم تجربی"
  }
])
const data = ref([])
const { $axios, $userData, $token } = useNuxtApp()
onMounted(() => {
  // getLesson()
})

async function getLesson() {
  try {
    let response = await $axios.get('fields')
    if (response.data.ok) {
      lessons.value = response.data.data
    }
  } catch (exception) {
    console.log(exception)
    if (exception.response.status === 401) {
      $userData.logout()
      $token.logout()
      return navigateTo('/auth/login')
    }
  }
}
</script>