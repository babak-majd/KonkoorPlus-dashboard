<template>
  <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50  flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <form @submit.prevent="receive_code()" v-if="step === 1"
    class="flex flex-col gap-5 w-full items-center max-w-80 md:max-w-xl">
    <div class="textbox">
      <input type="text" inputmode="numeric" placeholder="" v-model="form.phone_number" maxlength="11" minlength="11"
        required id="txtMobile" />
      <label for="txtMobile">شماره همراه</label>
    </div>
    <button type="submit" class="btn-primary w-full">
      دریافت کد
    </button>

    <div class="flex items-center justify-between gap-4">
      <NuxtLink to="/auth/signup" class="text-primary text-xs font-medium">
        حساب کاربری ندارید؟
      </NuxtLink>
      <NuxtLink to="/auth/login-with-password" class="text-primary text-xs font-medium">ورود با رمز عبور</NuxtLink>
    </div>
  </form>

  <form @submit.prevent="login()" v-else class="flex flex-col gap-5 w-full items-center max-w-80 md:max-w-xl">
    <span class="w-full text-xs px-2 font-medium">کد تایید برای شماره {{ form.phone_number }} ارسال شد!</span>
    <div class="grid grid-cols-4 gap-2" dir="ltr">
      <input type="text" inputmode="numeric" @keydown="useNumericKeydown($event)" @keyup="focusNext($event)"
        class="text-center rounded-lg" maxlength="1" v-model="form.code[0]" />
      <input type="text" inputmode="numeric" @keydown="useNumericKeydown($event)" @keyup="focusNext($event)"
        class="text-center rounded-lg" maxlength="1" v-model="form.code[1]" />
      <input type="text" inputmode="numeric" @keydown="useNumericKeydown($event)" @keyup="focusNext($event)"
        class="text-center rounded-lg" maxlength="1" v-model="form.code[2]" />
      <input type="text" inputmode="numeric" @keydown="useNumericKeydown($event)" @keyup="focusNext($event)"
        class="text-center rounded-lg" maxlength="1" v-model="form.code[3]" />
    </div>
    <div class="flex flex-col items-center w-full gap-4">
      <button class="btn-primary w-full">ورود</button>
      <button type="button" @click="receive_code()" class="btn-secondary">زمان باقی مانده {{ remainig_time_format()
        }}</button>
      <button type="button" @click="step = 1">تغییر شماره</button>
    </div>
  </form>
</template>

<script setup>
import { useStartDate } from '~/store/start_date';
import { useToken } from '~/store/tokenStore';
import { useUserData } from '~/store/user_data';

useHead({ title: 'ورود' })
definePageMeta({
  layout: "auth",
});

const error_happened = ref(false);
const form = ref({
  phone_number: "",
  code: [],
});
const step = ref(1)
const remain_time = ref(120)
const loading = ref(false)
const { $axios } = useNuxtApp()
const startDate = useStartDate()
const userData = useUserData()
const token = useToken()
const intervals = ref([])

const remainig_time_format = () => {
  if (remain_time.value <= 0) {
    return '00:00'
  }
  let seound = remain_time.value % 60
  let min = (remain_time.value - seound) / 60

  return `${min.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${seound.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
}

function focusNext(event) {
  if (/^[0-9]$/.test(event.key)) {
    let next = event.target.nextElementSibling
    if (next && next.tagName === "INPUT") {
      next.focus()
      if (next.value) {
        next.select()
      }
    }
  }
  else {
    event.preventDefault()
  }
}

async function receive_code() {
  loading.value = true

  try {
    let response = await $axios.get('/auth/sms/new', { params: { phone: form.value.phone_number } })
    if (response.data.ok) {
      step.value = 2
      remain_time.value = 120
      let id = setInterval(function () {
        if (remain_time.value > 0) {
          remain_time.value--
        }
        else {
          clearIntervals()
        }
      }, 1000)
      intervals.value.push(id)
    }
  } catch (ex) {
    console.log(ex)
  } finally {
    loading.value = false
  }
}
function clearIntervals() {
  intervals.value.forEach((item) => {
    clearInterval(item)
  })
}
async function login() {
  loading.value = true

  try {
    let obj = {
      phone: form.value.phone_number,
      code: form.value.code.join('')
    }
    let response = await $axios.post('auth/sms/login', obj)

    if (response.data.ok) {
      token.setToken(response.data.data.token)
      let route = `/${response.data.data.role}s/profile`
      response = await $axios.get(route, { headers: { Authorization: `Token ${response.data.data.token}` } })
      if (response.data.ok) {
        userData.setUserData(response.data.data)
        startDate.setStartDate(response.data.start_date)
      }
      let url = response.data.data.role === "advisor" ? '/advisor' : '/'
      return await navigateTo(url, { replace: true })
    }
  } catch (ex) {
    console.log(ex)
  } finally {
    loading.value = false
  }
}

</script>
