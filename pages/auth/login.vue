<template>
  <div v-if="request.pending.value"
    class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-full items-center">
    <div class="mx-auto">
      <form @submit.prevent="requestToLogin()" class="flex flex-col gap-8 w-full items-center">
        <div class="custom_input_box text-base-content w-full lg:w-[22.625rem]">
          <InputTextMarked dir="ltr" v-model="form.phone_number" type="text" required id="input_phone">
            <label class="cursor-text" for="input_phone" dir="rtl">
              شماره همراه
              <span class="text-error text-xs" v-show="error_happened">و گذرواژه همخوانی ندارند.</span>
            </label>
          </InputTextMarked>
        </div>
        <div class="custom_input_box text-base-content w-full lg:w-[22.625rem]">
          <InputTextMarked dir="ltr" v-model="form.password" type="password" required id="input_password">
            <label class="cursor-text" for="input_password" dir="rtl">
              گذرواژه
              <span class="text-error text-xs" v-show="error_happened">و شماره همراه همخوانی ندارند.</span>
            </label>
          </InputTextMarked>
        </div>
        <div class="flex justify-between w-64 lg:w-full items-center flex-col lg:flex-row gap-4">
          <button type="submit" class="btn-primary w-full lg:w-1/3">
            ورود
          </button>
          <label dir="rtl"
            class="text-xs flex flex-col items-center lg:items-start lg:justify-around gap-2 h-10 text-base-content">
            <NuxtLink to="/auth/forget">
              گذرواژه خود را فراموش کرده‌اید؟
            </NuxtLink>
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
import Request from "~~/Api/Request";
import ConfigStore from "~~/store/ConfigStore";

definePageMeta({
  layout: "auth",
});

const request = Request.noauth();
const error_happened = ref(false);
const form = ref({
  phone_number: "",
  password: "",
});

async function requestToLogin() {
  await request.post("students/auth/login", form.value).then((response) => {
    let phone_box = document.getElementById("input_phone");
    let password_box = document.getElementById("input_password");
    if (response.ok) {
      console.log(
        ConfigStore.init(response.data)
      );
  navigateTo("/");
} else {
  // TODO : Message to user name or password is incorrect
  phone_box.classList.add("border-b-2");
  phone_box.classList.add("border-b-error");
  password_box.classList.add("border-b-2");
  password_box.classList.add("border-b-error");
  error_happened.value = true;
}
  }).catch ((response) => {
  console.log(2);
  console.log(response);
});
return;

}
</script>
