<template>
  <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-full items-center">
    <div class="mx-auto">
      <form @submit.prevent="requestToLogin()" class="flex flex-col gap-8 w-full items-center">
        <div class="custom_input_box text-base-content w-full lg:w-[22.625rem]">
          <InputTextMarked dir="ltr" v-model="form.phone_number" type="text" required id="input_phone">
            شماره همراه
            <span class="text-error text-xs" v-show="error_happened">و گذرواژه همخوانی ندارند.</span>
          </InputTextMarked>
        </div>
        <div class="custom_input_box text-base-content w-full lg:w-[22.625rem]">
          <InputTextMarked dir="ltr" v-model="form.password" type="password" required id="input_password">
            گذرواژه
            <span class="text-error text-xs" v-show="error_happened">و شماره همراه همخوانی ندارند.</span>
          </InputTextMarked>
        </div>
        <div class="flex justify-between w-64 lg:w-full items-center flex-col lg:flex-row gap-4">
          <button type="submit" class="btn-primary w-full lg:w-1/3">
            ورود
          </button>
          <label dir="rtl"
            class="text-xs flex flex-col items-center lg:items-start lg:justify-around gap-2 h-10 text-primary">
            <!-- <NuxtLink to="/auth/forget">
              گذرواژه خود را فراموش کرده‌اید؟
            </NuxtLink> -->
            <NuxtLink to="/auth/signup">
              حساب کاربری ندارید؟
            </NuxtLink>
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useStartDate } from '~/store/start_date';
import { useToken } from '~/store/tokenStore';
import { useUserData } from '~/store/user_data';

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
  let phone_box = document.getElementById("input_phone");
  let password_box = document.getElementById("input_password");
  try {
    let response = await $axios.post("students/auth/login", form.value)
    if (response.data.ok) {
      token.setToken(response.data.data.token)
      response = await $axios.get('students/profile', { headers: { Authorization: `Token ${response.data.data.token}` } })
      if (response.data.ok) {
        userData.setUserData(response.data.data)
        startDate.setStartDate(response.data.start_date)
      }
      return await navigateTo('/', { open: { target: "_self" } })
    }
    else {
      phone_box.classList.add("border-b-2");
      phone_box.classList.add("border-b-error");
      password_box.classList.add("border-b-2");
      password_box.classList.add("border-b-error");
      error_happened.value = true;
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }

}
</script>
