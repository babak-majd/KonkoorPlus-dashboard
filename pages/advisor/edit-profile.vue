<template>
  <div class="flex flex-col w-full h-full p-4 gap-3">
    <div v-if="loading" class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>

    <!-- page content -->
    <div class="flex flex-col gap-12 w-full h-full items-center justify-center px-2 py-8 md:p-16">
      <!-- main info -->
      <form @keydown="validateForm()" @submit.prevent="requestToEdit()"
        class="grid grid-cols-2 gap-x-3 gap-y-4 w-full items-center max-w-lg">
        <div class="textbox">
          <input type="text" placeholder="" v-model="form.first_name" required id="input_firstname" />
          <label for="input_firstname">نام</label>
        </div>
        <div class="textbox">
          <input type="text" placeholder="" v-model="form.last_name" required id="input_lastname" />
          <label for="input_lastname">نام خانوادگی</label>
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
        <Dropdown class="z-index-[1100] h-10">
          <template v-slot:title>
            <span>
              {{ current_state.text ?? data.state?.name ?? "استان" }}
            </span>
          </template>
          <template v-slot:option>
            <InputRadio v-for="(state, index) in states" v-model="current_state.uuid" :value="state.uuid" :key="index"
              @click.prevent="stateOnClick(state)" :id="`state_${state.uuid}`" name="state">
              {{ state.text }}
            </InputRadio>
          </template>
        </Dropdown>
        <Dropdown v-if="current_state.uuid && cities.length > 0" class="z-index-[1100] h-10">
          <template v-slot:title>
            <span>
              {{ current_city.text ?? data.city.name ?? "شهر" }}
            </span>
          </template>
          <template v-slot:option>
            <InputRadio v-for="(city, index) in cities" :value="city.uuid" :key="index" v-model="form.new_city"
              @click="form.new_city = city.uuid; current_city = city; validateForm()" :id="`city_${city.uuid}`"
              name="city">{{
                city.text }}</InputRadio>
          </template>
        </Dropdown>

        <button type="submit" class="col-span-2 btn-primary w-full" :disabled="!IsFormValid">
          ذخیره
        </button>
      </form>

      <!-- password -->
      <form @submit.prevent="changePassword()" class="flex flex-col gap-8 w-full max-w-lg">
        <h2 class="text-2xl font-semibold">تغییر رمز</h2>
        <!-- form textboxes -->
        <div class="flex flex-col gap-4 w-full">
          <div class="textbox">
            <input type="password" placeholder="" v-model="frmPassword.password" required id="txtPassword" />
            <label for="txtPassword">گذرواژه جدید</label>
          </div>
          <div class="textbox">
            <input type="password" placeholder="" v-model="frmPassword.confirm" required id="txtPasswordConfirm" />
            <label for="txtPasswordConfirm">تایید گذرواژه</label>
          </div>
          <span class="text-error text-xs font-semibold -my-2" v-if="confirmError">- گذرواژه و تکرار آن مطابقت
            ندارد</span>
        </div>

        <button class="btn-primary w-full">تغییر رمز</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import AdviserMiddleware from '~/middlewares/AdviserMiddleware';
import Auth from '~/middlewares/Auth';

definePageMeta({
  middleware: [Auth, AdviserMiddleware],
  layout: 'adviser'
})
useHead({ title: "ویرایش پروفایل" })
const error_happened = ref(false);
const confirmError = ref(false)
const states = ref([])
const cities = ref([])
const current_gender = ref({})
const current_state = ref({
  name: "",
  uuid: ""
})
const loading = ref(false)
const { $axios } = useNuxtApp()
const userData = useUserData()
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
const form = ref({
  first_name: "",
  last_name: "",
  new_city: "",
  new_field: "",
  gender: "",
  has_advisor: false
});
const frmPassword = ref({
  password: '',
  confirm: ''
})
const data = ref({});


async function requestToEdit() {
  loading.value = true

  await $axios.patch("adviser/profile/update", form.value).then((response) => {
    if (response.data.ok) {
      userData.logout()
      userData.setUserData(response.data.data)
      navigateTo("/adviser/edit-profile", { open: { target: "_self" } })
    } else {
      phone_box.classList.add("border-b-2");
      phone_box.classList.add("border-b-error");
      password_box.classList.add("border-b-2");
      password_box.classList.add("border-b-error");
      error_happened.value = true;
    }
  }).catch((response) => {
    console.log(response);
  }).finally(() => loading.value = false)
}

async function get_cities(state_uuid) {
  loading.value = true
  await $axios.get("states/cities", { params: { uuid: state_uuid } }).then((response) => {
    if (response.data.ok) {
      cities.value = response.data.data;
    }
  }).catch((response) => {
    console.log(response);
  }).finally(() => loading.value = false);
}

async function changePassword() {
  loading.value = true
  let txtPassword = document.getElementById('txtPassword')
  let txtConfirm = document.getElementById('txtPasswordConfirm')
  try {
    if (frmPassword.value.password === frmPassword.value.confirm) {
      confirmError.value = false
      let response = await $axios.patch("advisers/profile/update", { password: frmPassword.value.password })

      if (response.data.ok) {
        txtPassword.classList.add('!border-lime-500')
        txtConfirm.classList.add('!border-lime-500')
        txtPassword.classList.remove('!border-error')
        txtConfirm.classList.remove('!border-error')
      }
    }
    else {
      confirmError.value = true
      txtPassword.classList.remove('!border-lime-500')
      txtConfirm.classList.remove('!border-lime-500')
      txtPassword.classList.add('!border-error')
      txtConfirm.classList.add('!border-error')
    }
  } catch (ex) {
    console.log(ex)
  } finally {
    loading.value = false
  }
}

function validateForm() {
  IsFormValid.value = false;
  if (form.value.first_name == "") return;
  if (form.value.last_name == "") return;
  if (form.value.new_city == "") return;
  if (form.value.gender == "") return;
  IsFormValid.value = true
}

function stateOnClick(state) {
  form.value.new_city = "";
  current_city.value.name = "شهر";
  current_state.value = state;
  get_cities(state.uuid);
  validateForm()
}

onMounted(() => {
  let user = userData.getUserData()
  form.value.first_name = user.first_name
  form.value.last_name = user.last_name
  form.value.gender = user.gender
  form.value.new_city = user.city
  data.value.city = user.city
});

onBeforeMount(async () => {
  loading.value = true

  await $axios.get("states").then((response) => {
    if (response.data.ok) {
      states.value = response.data.data;
    }
  }).catch((response) => {
    console.log(response);
  }).finally(() => loading.value = false);
})
</script>