<template>
  <div id="printable"
    class="w-full h-full flex flex-col p-4 gap-8 print:items-center print:justify-center print:p-2 print:gap-2">
    <!-- header -->
    <div class="flex flex-col gap-3 w-full print:items-center">
      <div class="print:hidden">
        <ToolsBreadcrumb :items="[{ text: 'نمای کلی', url: '/overview' }, 'گزارش']" />
      </div>
      <div class="hidden print:block">{{ userData.fullname }}</div>
      <h3 class="text-2xl font-semibold">گزارش کلی</h3>
    </div>
    <!-- filter and report -->
    <div class="print:hidden flex flex-col gap-3 md:flex-row md:justify-between">
      <select @change="getCourseData()" v-model="query.lesson"
        class="bg-base-250 w-full md:max-w-64 p-2 rounded-lg focus-within:outline focus-within:outline-1 focus-within:border focus-within:outline-offset-4 focus-within:bg-white">
        <option :value="null">انتخاب کنید</option>
        <option v-for="(lesson, index) in lessons" :key="index" :value="lesson.uuid">{{ lesson.text }}</option>
      </select>
      <button onclick="print()" :class="query.lesson === null ? 'pointer-events-none opacity-35' : ''"
        class="flex items-center justify-center gap-2 border p-2 px-4 rounded-lg border-main text-main hover:bg-main-50 transition-all duration-200">
        <span>دریافت گزارش</span>
        <SvgDownload class="w-5" />
      </button>
    </div>
    <!-- chart -->
    <div id="chartSection" class="relative flex w-full print:items-center print:justify-center">
      <ToolsChartArea :categories="data.map((item) => item.title)"
        :series="[{ data: data.map((item) => item.value) }]" />
      <div v-if="!(!!query.lesson)"
        class="absolute top-0 left-0 w-full h-full bg-gray-50 z-50 flex flex-col items-center justify-center text-2xl xl:text-4xl">
        لطفا درس را انتخاب کنید
      </div>
    </div>

    <div class="flex flex-col gap-5 md:flex-row">
      <div class="flex flex-col md:w-1/2">
        <h4 class="text-lg font-semibold">سال تحصیلی</h4>
        <div class="flex items-center gap-1">
          <span class="text-lg font-semibold">365</span>
          <span>روز</span>
        </div>

        <!-- progress bar -->
        <div class="flex flex-col gap-1 max-w-80 2xl:max-w-md">
          <ToolsProgress :max="365" :value="passedDayOnAcademicYear()" />
          <div class="flex items-center justify-between text-sm p-2">
            <!-- progressed days -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-base-500">روز های طی شده</span>
                <span class="h-1 w-8 bg-main rounded-full"></span>
              </div>
              <span class="font-semibold">{{ passedDayOnAcademicYear() }} روز</span>
            </div>

            <!-- not progressed days -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-base-500">روز های باقی مانده</span>
                <span class="h-1 w-8 bg-main-200 rounded-full"></span>
              </div>
              <span class="font-semibold">{{ 365 - passedDayOnAcademicYear() }} روز</span>
            </div>
          </div>
        </div>
      </div>

      <!-- activity -->
      <div class="flex flex-col md:w-1/2">
        <!-- courses -->
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-evenly">
          <!-- course -->
          <div class="flex flex-col gap-6 md:gap-2 min-w-fit h-52">
            <h5 class="text-lg font-semibold">فعالیت این ماه</h5>
            <div class="flex items-center gap-3" v-for="(item, index) in topThird" :key="index">
              <!-- progress color -->
              <div class="flex h-full py-3">
                <span class="h-1 w-6 rounded-full" :class="topThirdColor(index)"></span>
              </div>
              <div class="flex flex-col">
                <h6>{{ item.name }}</h6>
                <div class="flex items-center gap-2 text-base-500">
                  <span>{{ item.tests }} تست</span>
                  <span>|</span>
                  <span>{{ item.hours }} ساعت</span>
                </div>
              </div>
            </div>
          </div>
          <!-- pie chart -->
          <div class="flex items-center justify-center relative">
            <ToolsChartPie :series="topThird.map((item) => item.hours)" />
            <div class="absolute flex flex-col items-center gap-0 transform" style="">
              <span class="font-semibold text-lg">
                {{ topThird.map((item) => item.hours).reduce((partialSum, a) => partialSum + a, 0) }}
              </span>
              <span class="text-base-500">ساعت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'گزارش کلی' })
const loading = ref(false)
const lessons = ref([])

const data = ref([
  { title: '', value: 0 }
])
const topThird = ref([])
const { $axios } = useNuxtApp()
const remainDays = ref(-1)
const query = ref({
  lesson: null
})

const userData = useUserData()
const token = useToken()
const startDate = useStartDate().getStartDate()

const topThirdColor = (index) => {
  return index === 0 ? 'bg-main' : (index === 1 ? 'bg-main-400' : 'bg-main-200')
}

const passedDayOnAcademicYear = () => {
  if (remainDays.value === -1) {
    let startOfYear = new Date(`${new Date().getFullYear()}-01-01`)
    let differenceDays = new Date(startDate).getDate() - startOfYear.getDate()
    let now = new Date()
    now.setDate(now.getDate() + differenceDays)

    remainDays.value = now.getDate() - startOfYear.getDate()
  }

  return remainDays.value
}

onMounted(() => {
  getLesson()
  getTopThird()
})

function print() {
  let printable = document.getElementById('printable').innerHTML
  let originalContent = document.body.innerHTML

  document.body.innerHTML = printable
  window.print()
  document.body.innerHTML = originalContent
}
function getCourseData() {
  if (query.value.lesson !== null) {
    getData(query.value.lesson)
  }
}


async function getData(uuid) {
  loading.value = true
  try {
    let response = await $axios.get('statistics/lesson-overview', { params: { lesson: uuid } })
    if (response.data.ok) {
      data.value = response.data.data
      if (data.value.length === 0) {
        data.value = [{ title: 'بدون محتوا', value: 0 }]
      }
    }
  } catch (exception) {
    console.log(exception)
  } finally { loading.value = false }
}
async function getTopThird() {
  loading.value = true
  try {
    let response = await $axios.get('statistics/overview')
    if (response.data.ok) {
      let result = response.data.data.this_month
      topThird.value = result
      if (topThird.value.length === 0) {
        topThird.value = [
          { hours: 1, tests: 1, name: 'اطلاعات در دسترس نیست' },
          { hours: 1, tests: 1, name: 'اطلاعات در دسترس نیست' },
          { hours: 1, tests: 1, name: 'اطلاعات در دسترس نیست' },
        ]
      }
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }
}
async function getLesson() {
  try {
    let response = await $axios.get('fields/lessons')
    if (response.data.ok) {
      lessons.value = response.data.data
      if (query.value.lesson === '') {
        query.value.lesson = lessons.value[0].uuid
      }
    }
  } catch (exception) {
    console.log(exception)
    if (exception.response.status === 401) {
      userData.logout()
      token.logout()
      return navigateTo('/auth/login')
    }
  }
}
</script>

<style scoped>
@media print {
  @page {
    size: 9.8in 13.9in landscape !important;
    margin: none !important;
    padding: none !important;
    print-color-adjust: exact !important;
  }

  #printable {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #printable>* {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
</style>