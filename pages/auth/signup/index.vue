<template>
  <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
    <ToolsLoading class="w-32 h-32" />
  </div>

  <div class="flex w-[80vw] lg:w-full items-center">
    <div class="mx-auto">
      <form @keydown="validateForm()" @submit.prevent="requestToRegister()" class="grid grid-cols-2 gap-x-2 gap-y-4">
        <div class="textbox">
          <input type="text" v-model="form.first_name" placeholder="" required id="input_firstname" />
          <label for="input_firstname">نام</label>
        </div>
        <div class="textbox">
          <input type="text" v-model="form.last_name" placeholder="" required id="input_lastname" />
          <label for="input_lastname">نام خانوادگی</label>
        </div>
        <div class="textbox">
          <input type="text" v-model="form.phone_number" placeholder="" required id="input_phone" />
          <label for="input_phone">شماره همراه</label>
        </div>
        <Dropdown class="z-index-[1100] h-10">
          <template v-slot:title>
            <span>
              {{ current_gender.name ?? "جنسیت" }}
            </span>
          </template>
          <template v-slot:option>
            <InputRadio v-for="(gender, index) in genders" :value="gender.value" :key="index" v-model="form.gender"
              @click="form.gender = gender.value; current_gender = gender; validateForm()"
              :id="`gender_${gender.value}`" name="gender">{{
                gender.name }}</InputRadio>
          </template>
        </Dropdown>
        <div class="textbox">
          <input type="password" v-model="form.password" required placeholder="" id="input_password" />
          <label for="input_password">گذرواژه</label>
        </div>
        <div class="textbox">
          <input type="password" v-model="confirm_password" required placeholder="" id="input_confirm_password" />
          <label for="input_confirm_password">تایید گذرواژه</label>
        </div>
        <Dropdown class="z-index-[1100] h-10">
          <template v-slot:title>
            <span>
              {{ current_grade.name ?? "پایه تحصیلی" }}
            </span>
          </template>
          <template v-slot:option>
            <InputRadio v-for="(grade, index) in grades" :value="grade.value" :key="index" v-model="form.grade"
              @click="form.grade = grade.value; current_grade = grade; validateForm(), gradeOnClick()"
              :id="`grade_${grade.value}`" name="grade">{{
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
              @click="form.field = field.uuid; current_field = field; validateForm()" :id="`field_${field.uuid}`"
              name="field">{{
                field.text }}</InputRadio>
          </template>
        </Dropdown>
        <Dropdown class="z-index-[1100] h-10">
          <template v-slot:title>
            <span>
              {{ current_state.text ?? "استان" }}
            </span>
          </template>
          <template v-slot:option>
            <InputRadio v-for="(state, index) in states" v-model="current_state.uuid" :value="state.uuid" :key="index"
              @click.prevent="form.city, current_city = ''; current_state = state; get_cities(state.uuid); validateForm()"
              :id="`state_${state.uuid}`" name="state">
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
              @click="form.city = city.uuid; current_city = city; validateForm()" :id="`city_${city.uuid}`" name="city">
              {{
                city.text }}</InputRadio>
          </template>
        </Dropdown>
        <InputCheckbox class="col-span-2" v-model="form.has_advisor" name="has_advisor" id="has_advisor">
          مشاور دارم
        </InputCheckbox>

        <div class="flex justify-between col-span-2 w-full lg:w-full items-center flex-col lg:flex-row gap-4">
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
useHead({ title: 'ثبت نام' })
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
