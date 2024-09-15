<template>
  <div class="flex flex-col w-full h-full p-4 gap-3">
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
            <input class="radio-filter" type="radio" name="filter" id="radio-month" hidden checked />
            <label for="radio-month" class="flex items-center gap-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full outline outline-1 outline-base-300 outline-offset-2"></div>
              ماه
            </label>
          </div>
          <div class="flex items-center">
            <input class="radio-filter" type="radio" name="filter" id="radio-week" hidden />
            <label for="radio-week" class="flex items-center gap-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full outline outline-1 outline-base-300 outline-offset-2"></div>
              هفته
            </label>
          </div>
          <div class="flex items-center">
            <input class="radio-filter" type="radio" name="filter" id="radio-day" hidden />
            <label for="radio-day" class="flex items-center gap-3 cursor-pointer">
              <div class="w-5 h-5 rounded-full outline outline-1 outline-base-300 outline-offset-2"></div>
              روز
            </label>
          </div>
        </fieldset>

        <select
          class="bg-base-250 w-full md:max-w-64 p-2 rounded-lg focus-within:outline focus-within:outline-1 focus-within:border focus-within:outline-offset-4 focus-within:bg-white">
          <option v-for="(month, index) in months" :key="index" :value="(index + 1)">{{ month }}</option>
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
        <tbody class="border-x border-b rounded-b-xl">
          <tr v-for="(lesson, index) in lessons" :key="index">
            <td class="text-center py-2 font-semibold px-2">{{ (index + 1) }}</td>
            <td class="text-center py-2">{{ lesson.name }}</td>
            <td class="text-center py-2">{{ lesson.hour }}</td>
            <td class="text-center py-2">{{ lesson.test }}</td>
            <td class="hidden lg:block w-12"></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'تقویم درسی'
})
const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const lessons = [
  { name: 'شیمی', hour: 560, test: 230 },
  { name: 'فیزیک', hour: 420, test: 280 },
  { name: 'ریاضی', hour: 320, test: 250 },
  { name: 'ادبیات', hour: 120, test: 230 },
  { name: 'دینی', hour: 110, test: 220 },
]
</script>

<style>
.radio-filter:checked~label div {
  @apply outline-main bg-main
}
</style>