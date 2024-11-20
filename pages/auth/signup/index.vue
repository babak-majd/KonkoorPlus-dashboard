<template>
  <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-[80vw] lg:w-full items-center">
    <div class="mx-auto">
      <form @submit.prevent="requestToRegister()" class="flex flex-col gap-8 w-full items-center">
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
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
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <InputTextMarked dir="ltr" v-model="form.phone_number" type="text" required id="input_phone">
            <label class="cursor-text" for="input_phone" dir="rtl">
              شماره همراه
            </label>
          </InputTextMarked>
          <select v-model="current_gender" class="bg-white border w-full h-10 p-2 text-black rounded-sm">
            <option disabled :value="{}" v-if="Object.keys(current_gender).length === 0">جنسیت</option>
            <option v-for="(gender, index) in genders" :key="index" :value="gender">
              {{ gender.name }}
            </option>
          </select>
        </div>
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <InputTextMarked dir="ltr" v-model="form.password" type="password" required id="input_password">
            <label class="cursor-text" for="input_password" dir="rtl">
              گذرواژه
            </label>
          </InputTextMarked>
          <InputTextMarked dir="ltr" v-model="confirm_password" type="password" required id="input_confirm_password">
            <label class="cursor-text" for="input_confirm_password" dir="rtl">
              تایید گذرواژه
            </label>
          </InputTextMarked>
        </div>
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <select v-model="current_grade" class="bg-white border w-full h-10 p-2 text-black rounded-sm">
            <option disabled :value="{}" v-if="Object.keys(current_grade).length === 0">پایه تحصیلی</option>
            <option v-for="(grade, index) in grades" :key="index" :value="grade">
              {{ grade.name }}
            </option>
          </select>
          <select v-if="current_grade.value > 9 && fields.length > 0" v-model="current_field"
            class="bg-white border w-full h-10 p-2 text-black rounded-sm">
            <option disabled :value="{}" v-if="Object.keys(current_field).length === 0">رشته تحصیلی</option>
            <option v-for="(field, index) in fields" :key="index" :value="field" :disabled="field.text === 'ندارد'">
              {{ field.text }}
            </option>
          </select>
        </div>
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
          <select v-model="current_state" class="bg-white border w-full h-10 p-2 text-black rounded-sm">
            <option disabled :value="{}" v-if="Object.keys(current_state).length === 0">استان</option>
            <option v-for="(state, index) in states" :key="index" :value="state">
              {{ state.text }}
            </option>
          </select>
          <select v-if="current_state.uuid && cities.length > 0" v-model="current_city"
            class="bg-white border w-full h-10 p-2 text-black rounded-sm">
            <option disabled value="" v-if="Object.keys(current_city).length === 0">شهر</option>
            <option v-for="(city, index) in cities" :key="index" :value="city">
              {{ city.text }}
            </option>
          </select>
        </div>
        <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem]">
          <InputCheckbox v-model="form.has_advisor" name="has_advisor" id="has_advisor">
            مشاور دارم
          </InputCheckbox>
        </div>
        <div class="flex justify-between w-full lg:w-full items-center flex-col lg:flex-row gap-4">
          <button type="submit" class="btn-primary w-full lg:w-1/3" :disabled="!IsFormValid">
            عضویت
          </button>
          <label dir="rtl"
            class="text-xs flex flex-col items-center lg:items-start lg:justify-around gap-2 h-10 text-main">
            <NuxtLink to="/auth/login">
              حساب کاربری دارید؟
              {{ IsFormValid }}
            </NuxtLink>
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const error_happened = ref(false);
const states = ref([])
const fields = ref([])
const cities = ref([])
const current_grade = ref({})
const current_gender = ref({})
const current_field = ref({})
const current_state = ref({})
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
  has_advisor: false
});
const userData = useUserData()
const token = useToken()
const startDate = useStartDate()
const { $axios } = useNuxtApp()

const loading = ref(false)
async function requestToRegister() {
  loading.value = true
  try {
    let response = await $axios.post("students/auth/register", form.value)
    if (response.data.ok) {
      token.setToken(response.data.data.token)
      response = await $axios.get('students/profile', { headers: { Authorization: `Token ${response.data.data.token}` } })
      if (response.data.ok) {
        userData.setUserData(response.data.data)
        startDate.setStartDate(response.data.start_date)
      }
      return navigateTo("/", { open: { target: "_self" } })
    }
  } catch (exception) {
    if (exception.response.status === 422) {
      let phone_box = document.getElementById("input_phone");
      let password_box = document.getElementById("input_password");
      phone_box.classList.add("border-b-2");
      phone_box.classList.add("border-b-error");
      password_box.classList.add("border-b-2");
      password_box.classList.add("border-b-error");
      error_happened.value = true;
    }
  } finally {
    loading.value = false
  }
}

watch(current_state, (newValue, oldValue) => {
  if (!!newValue) {
    form.value.city = '';
    current_city.value = '';
    get_cities(current_state.value.uuid);
  }
})

watch(current_city, (newValue, oldValue) => {
  if (!!newValue) {
    form.value.city = current_city.value.uuid;
  }
})

watch(current_gender, (newValue, oldValue) => {
  if (!!newValue) {
    form.value.gender = current_gender.value.value;
  }
})

watch(current_grade, (newValue, oldValue) => {
  if (!!newValue) {
    form.value.grade = current_grade.value.value;
    gradeOnClick();
  }
})

watch(current_field, (newValue, oldValue) => {
  if (!!newValue) {
    form.value.field = current_field.value.uuid;
  }
})

watch(form.value, (newValue, oldValue) => {
  if (!!newValue) {
    validateForm();
  }
})

async function get_cities(state_uuid) {
  loading.value = true
  try {
    let response = await $axios.get("states/cities", { params: { uuid: state_uuid } })
    if (response.data.ok) {
      cities.value = response.data.data
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }
}

async function validateForm() {
  IsFormValid.value = false;
  if (form.value.first_name == "") return;
  if (form.value.last_name == "") return;
  if (form.value.password == "" || form.value.password !== confirm_password.value) return;
  if (form.value.grade < 7 || form.value.grade > 13) return;
  if (form.value.grade > 9 && form.value.field == "") return;
  if (form.value.city == "") return;
  if (form.value.gender == "") return;
  IsFormValid.value = true
}

async function gradeOnClick() {
  if (form.value.grade < 10) {
    form.value.field = fields.value[3].uuid;
  }
}

onBeforeMount(async () => {
  loading.value = true
  try {
    let response = await $axios.get("fields")
    if (response.data.ok) {
      fields.value = response.data.data
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }
  loading.value = true
  try {
    let response = await $axios.get("states")
    if (response.data.ok) {
      states.value = response.data.data
    }
  } catch (exception) {
    console.log(exception)
  } finally {
    loading.value = false
  }
})
</script>
