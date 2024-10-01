<template>
  <div class="flex flex-col w-full h-full p-4 gap-3">
    <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>

    <!-- breadcrumbs -->
    <div class="flex items-center">
      <ToolsBreadcrumb class="text-xs" :items="[{ text: 'نمای کلی', url: '/overview' }, 'تقویم درسی']" />
    </div>
    <!-- title -->
    <h2 class="text-xl font-semibold">تقویم درسی</h2>

    <!-- content -->
    <section class="flex flex-col gap-8">
      <!-- filter -->
      <div class="flex flex-col gap-4 pt-10 md:flex-row">
        <!-- main filter -->
        <fieldset class="flex items-center gap-4">
          <div class="flex items-center">
            <input class="radio-filter" type="radio" name="filter" id="radio-month" :value="0" v-model="type" hidden
              checked />
            <label for="radio-month" class="flex items-center gap-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full outline outline-1 outline-base-300 outline-offset-2"></div>
              ماه
            </label>
          </div>
          <div class="flex items-center">
            <input class="radio-filter" type="radio" name="filter" id="radio-week" hidden :value="1" v-model="type" />
            <label for="radio-week" class="flex items-center gap-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full outline outline-1 outline-base-300 outline-offset-2"></div>
              هفته
            </label>
          </div>
        </fieldset>

        <select v-model="dateRange"
          class="bg-base-250 w-full md:max-w-64 p-2 rounded-lg focus-within:outline focus-within:outline-1 focus-within:border focus-within:outline-offset-4 focus-within:bg-white">
          <option v-for="(item, index) in selectBoxItems" :key="index" :value="item">
            {{ item.title }}
          </option>
        </select>
      </div>
      <!-- table -->
      <table>
        <thead class="border">
          <tr>
            <th class="pt-6 pb-3"></th>
            <th class="pt-6 pb-3">نام درس</th>
            <th class="pt-6 pb-3">ساعت</th>
            <th class="pt-6 pb-3">تست</th>
            <th class="hidden lg:block w-12"></th>
          </tr>
        </thead>
        <tbody class="border-x border-b rounded-b-xl" v-if="lessons.length > 0">
          <tr v-for="(lesson, index) in lessons" :key="index">
            <td class="text-center py-2 font-semibold px-2">{{ (index + 1) }}</td>
            <td class="text-center py-2">{{ lesson.lesson_name }}</td>
            <td class="text-center py-2">{{ convertMinute(lesson.duration) }}</td>
            <td class="text-center py-2">{{ lesson.test }}</td>
            <td class="hidden lg:block w-12"></td>
          </tr>
        </tbody>
        <tbody class="border-x border-b rounded-b-xl" v-else>
          <tr>
            <td colspan="5" class="text-center py-2 font-semibold px-2">
              اطلاعات یافت نشد
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import moment, { min } from 'jalali-moment';
import { useStartDate } from '~/store/start_date';

useHead({
  title: 'تقویم درسی'
})
const selectBoxItems = ref([])
const dateRange = ref(null)
const lessons = ref([])
const loading = ref(false)
const { $axios } = useNuxtApp()
const startDate = useStartDate()
const type = ref(0)
const convertMinute = (minute) => {
  let holder = minute % 60
  let hour = (minute - holder) / 60

  return `${hour}:${holder}`
}

onMounted(() => {
  selectBoxItems.value = makeSelectBoxItemForMonth()
  dateRange.value = selectBoxItems.value[0]
})

watch(dateRange, (newValue, oldValue) => {
  if (!!newValue) {
    getData(newValue.start, newValue.end)
  }
})
watch(type, (newValue, oldValue) => {
  if (newValue === 1) {
    selectBoxItems.value = makeSelectBoxItemByWeek()
  }
  else {
    selectBoxItems.value = makeSelectBoxItemForMonth()
  }
  dateRange.value = selectBoxItems.value[0]
})
function makeSelectBoxItemForMonth() {
  const months = usePersianMonths()
  let data = []
  months.forEach(month => {
    let start = moment(month.start, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
    let end = moment(month.end, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
    data.push({
      title: month.title,
      start: start,
      end: end
    })
  })

  return data
}
function makeSelectBoxItemByWeek() {
  const start = new Date(startDate.getStartDate())
  const now = new Date(Date.now())
  const data = []
  let end = start
  let weekIndex = 1

  do {
    let startWeek = new Date(end);
    end.setDate(end.getDate() + 7);
    let hold = new Date(end);

    let item = {
      title: `هفته ${useConvertToOridinal(weekIndex)}`,
      start: startWeek.toISOString().split('T')[0],
      end: hold.toISOString().split('T')[0]
    };

    weekIndex++

    data.push(item)
  } while (end <= now)
  return data
}

async function getData(from, end) {
  loading.value = true
  try {
    let response = await $axios.get('statistics/lesson-calendar', { params: { 'start-date': from, 'end-date': end } })
    if (response.data.ok) {
      lessons.value = response.data.data
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }
}

</script>

<style>
.radio-filter:checked~label div {
  @apply outline-main bg-main
}
</style>