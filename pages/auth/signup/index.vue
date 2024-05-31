<template>
  <div v-if="request.pending.value"
    class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-full items-center">
    <div class="mx-auto">
      <form @keydown="validateForm()" @submit.prevent="requestToRegister()" class="flex flex-col gap-8 w-full items-center">
        <div dir="rtl" class="custom_input_box text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <InputTextMarked dir="rtl" v-model="form.first_name" type="text" required id="input_firstname">
            <label class="cursor-text" for="input_firstname" dir="rtl">
              نام
            </label>
          </InputTextMarked>
          <InputTextMarked dir="rtl" v-model="form.last_name" type="text" required id="input_lastname">
            <label class="cursor-text" for="input_lastname" dir="rtl">
              نام خانوادگی
            </label>
          </InputTextMarked>
        </div>
        <div dir="rtl" class="custom_input_box text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <InputTextMarked dir="ltr" v-model="form.phone_number" type="text" required id="input_phone">
            <label class="cursor-text" for="input_phone" dir="rtl">
              شماره همراه
            </label>
          </InputTextMarked>
          <Dropdown class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_gender.name ?? "جنسیت" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(gender, index) in genders" :value="gender.value" :key="index" v-model="form.gender"
                @click="form.gender = gender.value; current_gender = gender; validateForm()" :id="`gender_${gender.value}`" name="gender">{{
                gender.name }}</InputRadio>
            </template>
          </Dropdown>
        </div>
        <div dir="rtl" class="custom_input_box text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <InputTextMarked dir="ltr" v-model="form.password" type="password" required id="input_password">
            <label class="cursor-text" for="input_password" dir="rtl">
              گذرواژه
            </label>
          </InputTextMarked>
          <InputTextMarked dir="ltr" v-model="form.confirm_password" type="password" required
            id="input_confirm_password">
            <label class="cursor-text" for="input_confirm_password" dir="rtl">
              تایید گذرواژه
            </label>
          </InputTextMarked>
        </div>
        <div dir="rtl" class="custom_input_box text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <Dropdown class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_grade.name ?? "پایه تحصیلی" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(grade, index) in grades" :value="grade.value" :key="index" v-model="form.grade"
                @click="form.grade = grade.value; current_grade = grade; validateForm()" :id="`grade_${grade.value}`" name="grade">{{
                grade.name }}</InputRadio>
            </template>
          </Dropdown>
          <Dropdown v-if="current_grade.value > 9 && feilds.length > 0" class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_feild.text ?? "رشته تحصیلی" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(feild, index) in feilds" :value="feild.uuid" :key="index" v-model="form.feild"
                @click="form.feild = feild.uuid; current_feild = feild; validateForm()" :id="`feild_${feild.uuid}`" name="feild">{{
                feild.text }}</InputRadio>
            </template>
          </Dropdown>
        </div>
        <div dir="rtl" class="custom_input_box text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <Dropdown class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_state.text ?? "استان" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(state, index) in states" :value="state.uuid" :key="index" v-model="form.state"
                @click.prevent="form.state = state.uuid; current_state = state; get_cities(state.uuid); validateForm()" :id="`state_${state.uuid}`" name="state">
                {{ state.text }}
              </InputRadio>
            </template>
          </Dropdown>
          <Dropdown v-if="current_state.uuid && cities.length > 0" class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_city.text ?? "شهر" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(city, index) in cities" :value="city.uuid" :key="index" v-model="form.city"
                @click="form.city = city.uuid; current_city = city; validateForm()" :id="`city_${city.uuid}`" name="city">{{
                city.text }}</InputRadio>
            </template>
          </Dropdown>
        </div>
        <div class="flex justify-between w-full lg:w-full items-center flex-col lg:flex-row gap-4">
          <button type="submit" class="btn-primary w-full lg:w-1/3" :disabled="!IsFormValid">
            عضویت
          </button>
          <label dir="rtl"
            class="text-xs flex flex-col items-center lg:items-start lg:justify-around gap-2 h-10 text-base-content">
            <NuxtLink to="/auth/login">
              حساب کاربری دارید؟
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
const states = ref([])
const feilds = ref([])
const cities = ref([])
const current_grade = ref({})
const current_gender = ref({})
const current_feild = ref({})
const current_state = ref({})
const current_city = ref({})
const IsFormValid = ref(false)
const genders = [
  {
    name: "آقا",
    value: "M"
  },
  {
    name: "خانم",
    value: "F"
  }
]
const grades = [
  {
    name: "هفتم",
    value: 7
  },
  {
    name: "هشتم",
    value: 8
  },
  {
    name: "نهم",
    value: 9
  },
  {
    name: "دهم",
    value: 10
  },
  {
    name: "یازدهم",
    value: 11
  },
  {
    name: "دوازدهم",
    value: 12
  },
  {
    name: "فارغ التحصیل",
    value: 13
  },
]
const form = ref({
  phone_number: "",
  password: "",
  confirm_password: "",
  first_name: "",
  last_name: "",
  state: "",
  city: "",
  feild: "",
  gender: "",
  grade: 0,
});

async function requestToRegister() {
  await request.post("students/auth/register", form.value).then((response) => {
    console.log(form.value);
    return;
    let phone_box = document.getElementById("input_phone");
    let password_box = document.getElementById("input_password");
    if (response.ok) {
      console.log(
        ConfigStore.init(response.data)
      );
      navigateTo("/");
    } else {
      phone_box.classList.add("border-b-2");
      phone_box.classList.add("border-b-error");
      password_box.classList.add("border-b-2");
      password_box.classList.add("border-b-error");
      error_happened.value = true;
    }
  }).catch((response) => {
    console.log(response);
  });
  return;
}

async function get_cities(state_uuid) {
  await request.get("states/cities", { "uuid": state_uuid }).then((response) => {
    if (response.ok) {
      cities.value = response.data;
    }
  }).catch((response) => {
    console.log(response);
  });
}

async function validateForm() {
  IsFormValid.value = false;
  if(form.value.firstname == "") return;
  if(form.value.lastname == "") return;
  if(form.value.password == "" || form.value.password !== form.value.confirm_password) return;
  if(form.value.grade < 7 || form.value.grade > 13) return;
  if(form.value.grade > 9 && form.value.feild == "") return;
  if(form.value.city == "") return;
  if(form.value.gender == "") return;
  IsFormValid.value = true
}

onBeforeMount(async () => {
  await request.get("feilds").then((response) => {
    if (response.ok) {
      feilds.value = response.data;
    }
  }).catch((response) => {
    console.log(response);
  });

  await request.get("states").then((response) => {
    if (response.ok) {
      states.value = response.data;
    }
  }).catch((response) => {
    console.log(response);
  });
})
</script>
