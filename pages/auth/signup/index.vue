<template>
  <div v-if="request.pending.value"
    class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-[80vw] lg:w-full items-center">
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
          <InputTextMarked dir="ltr" v-model="confirm_password" type="password" required
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
                @click="form.grade = grade.value; current_grade = grade; validateForm(), gradeOnClick()" :id="`grade_${grade.value}`" name="grade">{{
                grade.name }}</InputRadio>
            </template>
          </Dropdown>
          <Dropdown v-if="current_grade.value > 9 && fields.length > 0" class="z-index-[1100] h-10">
            <template v-slot:title>
              <span>
                {{ current_field.text ?? "رشته تحصیلی" }}
              </span>
            </template>
            <template v-slot:option>
              <InputRadio v-for="(field, index) in fields" :value="field.uuid" :key="index" v-model="form.field"
                @click="form.field = field.uuid; current_field = field; validateForm()" :id="`field_${field.uuid}`" name="field">{{
                field.text }}</InputRadio>
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
              <InputRadio v-for="(state, index) in states" v-model="current_state.uuid" :value="state.uuid" :key="index"
                @click.prevent="form.city, current_city = ''; current_state = state; get_cities(state.uuid); validateForm()" :id="`state_${state.uuid}`" name="state">
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
            class="text-xs flex flex-col items-center lg:items-start lg:justify-around gap-2 h-10 text-primary">
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
const fields = ref([])
const cities = ref([])
const current_grade = ref({})
const current_gender = ref({})
const current_field = ref({})
const current_state = ref({
  name: "",
  uuid: ""
})
const current_city = ref({})
const confirm_password = ref("")
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
  first_name: "",
  last_name: "",
  city: "",
  field: "",
  gender: "",
  grade: 0,
});

async function requestToRegister() {
  await request.post("students/auth/register", form.value).then((response) => {
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
    console.log(response.text);
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
  if(form.value.first_name == "") return;
  if(form.value.last_name == "") return;
  if(form.value.password == "" || form.value.password !== confirm_password.value) return;
  if(form.value.grade < 7 || form.value.grade > 13) return;
  if(form.value.grade > 9 && form.value.field == "") return;
  if(form.value.city == "") return;
  if(form.value.gender == "") return;
  IsFormValid.value = true
}

async function gradeOnClick() {
  if(form.value.grade < 10) {
    form.value.field = fields.value[3].uuid;
  }
}

onBeforeMount(async () => {
  await request.get("fields").then((response) => {
    if (response.ok) {
      fields.value = response.data;
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
