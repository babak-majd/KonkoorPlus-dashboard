<template>
  <div class="flex flex-col w-full h-full gap-12 items-center p-2">

    <!-- content -->
    <section class="flex flex-col gap-8">
      <!-- table -->
      <table class="table w-full">
        <thead class="border">
          <tr>
            <th class="pt-6 pb-3"></th>
            <th class="pt-6 pb-3">نام و نام خانوادگی</th>
            <th class="pt-6 pb-3">پایه</th>
            <th class="pt-6 pb-3">رشته</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="border-x border-b rounded-b-xl" v-if="data.length > 0">
          <tr v-for="(student, index) in data" :key="index">
            <td class="text-center py-2 font-semibold px-2">{{ (index + 1) }}</td>
            <td class="text-center py-2">{{ `${student.first_name} ${student.last_name}` }}</td>
            <td class="text-center py-2">{{ grades[student.grade] }}</td>
            <td class="text-center py-2">{{ student.field }}</td>
            <td class="flex items-center gap-3">
              <NuxtLink :to="`/advisor/students/${student.uuid}`" title="مشاهده">
                <SvgEye class="w-5" />
              </NuxtLink>
            </td>
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
import AdviserMiddleware from '~/middlewares/AdviserMiddleware';
import Auth from '~/middlewares/Auth';

definePageMeta({
  layout: 'adviser',
  middleware: [Auth, AdviserMiddleware]
})
useHead({ title: 'دانش آموزان من' })

const loading = ref(false)
const data = ref([])

const grades = {
  0: 'ندارد',
  7: "هفتم",
  8: "هشتم",
  9: "نهم",
  10: "دهم",
  11: "یازدهم",
  12: "دوازدهم",
  13: "فارغ التحصیل",
}

const { $axios } = useNuxtApp()

onMounted(() => {
  getData()
})

function remove(uuid) {
  SweetAlert.confirm('آیا از حذف دانش آموز اطمینان دارید؟').then(async (confirm) => {
    if (confirm) {
      loading.value = true
      try {
        let response = await $axios.post('/advisors/students/remove', { uuid: uuid })

        Toastify.showByStatus(response.data.message, response.data.ok)

        if (response.data.ok) {
          getData()
        }
      } catch (ex) {
        console.log(ex)
      } finally { loading.value = false }
    }
  })
}

async function getData() {
  loading.value = true
  try {
    let response = await $axios.get('/advisors/students')

    if (response.data.ok) {
      data.value = response.data.data
    }
  } catch (ex) {
    console.log(ex)
  } finally { loading.value = false }
}
</script>

<style></style>