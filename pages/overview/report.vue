<template>
  <div id="printable"
    class="w-full h-full flex flex-col p-4 gap-8 print:items-center print:justify-center print:p-2 print:gap-2">
    <!-- header -->
    <div class="flex flex-col gap-3 w-full print:items-center">
      <div class="print:hidden">
        <ToolsBreadcrumb :items="[{ text: 'نمای کلی', url: '/overview' }, 'گزارش']" />
      </div>
      <div class="hidden print:block">{{ userData.fullname }} - {{ grades[userData.grade] }} - {{ userData.field }}
      </div>
      <h3 class="text-2xl font-semibold">گزارش کلی</h3>
      <span class="hidden print:block">{{ lessons.find((item) => item.uuid === query.lesson)?.text }}</span>
    </div>
    <!-- filter and report -->
    <div class="print:hidden flex flex-col gap-3 md:flex-row md:justify-between">
      <select @change="getCourseData()" v-model="query.lesson"
        class="bg-base-250 w-full md:max-w-64 p-2 rounded-lg focus-within:outline focus-within:outline-1 focus-within:border focus-within:outline-offset-4 focus-within:bg-white">
        <option :value="null">انتخاب کنید</option>
        <option v-for="(lesson, index) in lessons" :key="index" :value="lesson.uuid">{{
          lesson.text }}</option>
      </select>
      <button @click="print()" :class="query.lesson === null ? 'pointer-events-none opacity-35' : ''"
        class="flex items-center justify-center gap-2 border p-2 px-4 rounded-lg border-main text-main hover:bg-main-50 transition-all duration-200">
        <span>ارسال به مشاور</span>
        <SvgDownload class="w-5" />
      </button>
    </div>
    <!-- chart -->
    <div id="chartSection" class="relative flex w-full print:items-center print:justify-center">
      <ClientOnly>
        <ToolsChartArea class="print:hidden" width="96%" :categories="data.map((item) => item.title)"
          :series="[{ data: data.map((item) => item.value) }]" />
        <ToolsChartArea class="hidden print:block" width="792px" :categories="data.map((item) => item.title)"
          :series="[{ data: data.map((item) => item.value) }]" />
      </ClientOnly>
      <div v-if="!(!!query.lesson)"
        class="absolute top-0 left-0 w-full h-full bg-gray-50 z-50 flex flex-col items-center justify-center text-2xl xl:text-4xl">
        لطفا درس را انتخاب کنید
      </div>
    </div>

    <div class="flex flex-col gap-5 lg:gap-2 md:flex-row print:flex-row w-full print:justify-between">
      <!-- current year status -->
      <div class="flex flex-col md:w-1/2 print:w-full">
        <h4 class="text-lg font-semibold">سال تحصیلی</h4>
        <div class="flex items-center gap-1">
          <span class="text-lg font-semibold">{{ first_exam?.diff(startDate, 'days') ?? 365 }}</span>
          <span>روز</span>
        </div>

        <!-- progress bar -->
        <div class="flex flex-col gap-1 lg:max-w-80 2xl:max-w-md">
          <ToolsProgress :max="progressBarMax()" :value="progressBarValue()" />
          <div class="flex items-center justify-between text-sm p-2 print:gap-2">
            <!-- progressed days -->
            <div class="flex flex-col gap-1 print:gap-0">
              <div class="flex items-center gap-2 print:gap-0">
                <span class="text-base-500">روز های طی شده</span>
                <span class="h-1 w-8 bg-main rounded-full print:hidden"></span>
              </div>
              <div class="flex items-center print:justify-between">
                <span class="font-semibold">{{ today?.diff(startDate, 'days') }} روز</span>
                <span class="h-1 w-8 bg-main rounded-full hidden print:block"></span>
              </div>
            </div>

            <!-- not progressed days -->
            <div class="flex flex-col gap-1 print:gap-0">
              <div class="flex items-center gap-2 print:gap-0">
                <span class="text-base-500">
                  روز های باقی مانده تا کنکور
                </span>
                <span class="h-1 w-8 bg-main-200 rounded-full print:hidden"></span>
              </div>
              <div class="flex items-center print:justify-between">
                <span class="font-semibold">{{ first_exam?.diff(moment(), 'days') + 1 }} روز</span>
                <span class="h-1 w-8 bg-main-200 rounded-full hidden print:block"></span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1 print:gap-0">
            <div class="flex items-center gap-2 print:gap-0">
              <span class="text-base-500">
                تاریخ کنکور {{ first_exam?.format('jMMMM') ?? "اردیبهشت" }}:
              </span>
              <span class="font-semibold">{{ first_exam?.format('D') ?? "20" }} {{ first_exam?.format('jMMMM') ??
                "نیر" }} {{ first_exam?.year() ?? "1404" }}</span>
            </div>
            <div class="flex items-center gap-2 print:gap-0">
              <span class="text-base-500">
                تاریخ کنکور {{ second_exam?.format('jMMMM') ?? "تیر" }}:
              </span>
              <span class="font-semibold">{{ second_exam?.format('D') ?? "20" }} {{ second_exam?.format('jMMMM') ??
                "تیر" }} {{ second_exam?.year() ?? "1404" }}</span>
            </div>
            <div class="flex items-center gap-2 print:gap-0">
              <span class="text-base-500">
                روز های باقی مانده تا کنکور {{ second_exam?.format('jMMMM') ?? "تیر" }}:
              </span>
              <span class="font-semibold">{{ second_exam?.diff(moment(), 'days') ?? 100 }} روز</span>
              <span class="h-1 w-8 bg-main-200 rounded-full hidden print:block"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- activity -->
      <div class="flex flex-col md:w-1/2 print:w-full">
        <!-- courses -->
        <div class="flex flex-col gap-5 lg:gap-2 md:flex-row md:items-center md:justify-evenly">
          <!-- course -->
          <div class="flex flex-col gap-6 md:gap-2 lg:w-1/2 h-52">
            <h5 class="text-lg font-semibold">فعالیت این ماه</h5>
            <div class="flex items-center gap-3" v-for="(item, index) in topThird" :key="index">
              <!-- progress color -->
              <div class="flex h-full py-3">
                <span class="h-1 w-6 rounded-full" :class="topThirdColor(index)"></span>
              </div>
              <div class="flex flex-col">
                <h6>{{ item.name }}</h6>
                <div class="flex items-center gap-2 text-base-500 lg:text-xs">
                  <span>{{ item.tests }} تست</span>
                  <span>|</span>
                  <!-- TODO: Need to change item.hours to item.minutes -->
                  <span>{{ useConvertMinute(item.hours) }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- pie chart -->
          <div class="flex items-center justify-center relative w-full lg:w-1/2 print:-mr-56 print:mt-8">
            <ClientOnly>
              <div v-if="windowWith > 400" class="w-fit">
                <ToolsChartPie :series="topThird.map((item) => item.hours)" />
              </div>
              <div v-else>
                <ToolsChartPie width="86%" :series="topThird.map((item) => item.hours)" />
              </div>
            </ClientOnly>
            <div class="absolute flex flex-col items-center gap-0 transform">
              <span class="relative text-center text-2xl font-semibold w-24 after">
                <!-- TODO : Need to change item.hours to item.minutes -->
                {{ round_minute(topThird.map((item) => item.hours).reduce((partialSum, a) => partialSum + a,
                  0)).toLocaleString('fa-IR') }}
              </span>
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
import moment from 'jalali-moment';
moment.locale('fa');

const grades = {
  0: 'هیچکدام',
  7: "هفتم",
  8: "هشتم",
  9: "نهم",
  10: "دهم",
  11: "یازدهم",
  12: "دوازدهم",
  13: "فارغ التحصیل",
}

const data = ref([
  { title: '', value: 0 }
])
const topThird = ref([])
const { $axios } = useNuxtApp()
const query = ref({
  lesson: null
})
const windowWith = ref(0)

const userData = useUserData()
const token = useToken()
const startDate = ref()
const first_exam = ref()
const second_exam = ref()
const today = ref(moment())

const topThirdColor = (index) => {
  return index === 0 ? 'bg-main' : (index === 1 ? 'bg-main-400' : 'bg-main-200')
}
const round_minute = (minute) => {
  let holder = minute % 60
  let hour = (minute - holder) / 60
  return holder >= 30 ? hour + 1 : hour
}
const progressBarMax = () => {
  return today.value > first_exam.value ?
    second_exam.value?.diff(startDate.value, 'days') :
    first_exam.value?.diff(startDate.value, 'days')
}
const progressBarValue = () => {
  return today.value.diff(startDate.value, 'days')
}

onMounted(() => {
  getLesson()
  getTopThird()
  windowWith.value = window.screen.width
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
      startDate.value = moment(response.data.data.start_date, "jYYYY-jMM-jDD")
      first_exam.value = moment(response.data.data.first_exam, "jYYYY-jMM-jDD")
      second_exam.value = moment(response.data.data.second_exam, "jYYYY-jMM-jDD")
      today.value = moment()

      let result = response.data.data.this_month
      topThird.value = result
      if (topThird.value.length === 0) {
        topThird.value = [
          { hours: 1, tests: 0, name: 'اطلاعات در دسترس نیست' },
          { hours: 1, tests: 0, name: 'اطلاعات در دسترس نیست' },
          { hours: 1, tests: 0, name: 'اطلاعات در دسترس نیست' },
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
.after::after {
  content: 'ساعت';
  color: #7D7D7D;
  font-size: small;
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  right: 0;
  margin: 0 auto;
}

@media print {

  /** تنظیمات این بخش به مرورگر کاربر هم بستگی دارد اما معمولا سایز صفحه را به سایز مد نظر تغییر میدهد */
  @page {
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact !important;
  }

  body {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  #printable {
    width: 100%;
    height: 100svh;
    display: flex;
    flex-direction: column;
  }
}
</style>