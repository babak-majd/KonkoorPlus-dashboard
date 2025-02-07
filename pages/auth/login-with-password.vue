<template>
  <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50  flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <form @submit.prevent="requestToLogin()" class="flex flex-col gap-5 w-full items-center min-w-80 max-w-xl">
    <div class="textbox">
      <input type="text" inputmode="numeric" placeholder="" v-model="form.phone_number" maxlength="11" minlength="11"
        required id="txtMobile" />
      <label for="txtMobile">شماره همراه</label>
    </div>
    <div class="textbox">
      <input type="password" placeholder="" v-model="form.password" required id="txtPassword" />
      <label for="txtPassword">گذرواژه</label>
    </div>
    <span class="text-error text-xs w-full font-semibold" v-show="error_happened">
      شماره تماس و گذرواژه باهم همخوانی ندارند!
    </span>
    <button type="submit" class="btn-primary w-full">
      ورود
    </button>


    <div class="flex items-center justify-between gap-4">
      <NuxtLink to="/auth/signup" class="text-primary text-xs font-medium">
        حساب کاربری ندارید؟
      </NuxtLink>
      <NuxtLink to="/auth/login" class="text-primary text-xs font-medium">ورود با رمز یکبار مصرف</NuxtLink>
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
  password: "",
});

const loading = ref(false)
const { $axios } = useNuxtApp()
const startDate = useStartDate()
const userData = useUserData()
const token = useToken()
async function requestToLogin() {
  loading.value = true
  let phone_box = document.getElementById("txtMobile");
  let password_box = document.getElementById("txtPassword");
  try {
    let response = await $axios.post("/auth/login", form.value)
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
    } else {
      Toastify.error('لطفا جهت فعال سازی شماره اقدام کنید')
      return navigateTo('/auth/login')
    }
  } catch (ex) {
    phone_box.classList.add("!border-b-error");
    password_box.classList.add("!border-b-error");
    error_happened.value = true;
  } finally {
    loading.value = false
  }
}
</script>
