<template>
    <div class="flex flex-col w-full h-full p-4 gap-3">
        <div v-if="loading"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
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
                <Dropdown class="col-span-2 z-index-[1100] h-10">
                    <template v-slot:title>
                        <span>
                            {{ current_gender.name ?? "جنسیت" }}
                        </span>
                    </template>
                    <template v-slot:option>
                        <InputRadio v-for="(gender, index) in genders" :value="gender.value" :key="index"
                            v-model="form.gender"
                            @click="form.gender = gender.value; current_gender = gender; validateForm()"
                            :id="`gender_${gender.value}`" name="gender">{{
                                gender.name }}</InputRadio>
                    </template>
                </Dropdown>
                <Dropdown class="z-index-[1100] h-10">
                    <template v-slot:title>
                        <span>
                            {{ current_grade.name ?? "پایه تحصیلی" }}
                        </span>
                    </template>
                    <template v-slot:option>
                        <InputRadio v-for="(grade, index) in grades" :value="grade.value" :key="index"
                            v-model="form.grade"
                            @click="form.grade = grade.value; current_grade = grade; validateForm(), gradeOnClick()"
                            :id="`grade_${grade.value}`" name="grade">{{
                                grade.name }}</InputRadio>
                    </template>
                </Dropdown>
                <Dropdown v-if="current_grade.value > 9 && fields.length > 0" class="z-index-[1100] h-10">
                    <template v-slot:title>
                        <span>
                            {{ current_field.text ?? data.field.name === "ندارد" ? "رشته تحصیلی" :
                                current_field.text ?? data.field.name }}
                        </span>
                    </template>
                    <template v-slot:option>
                        <InputRadio v-for="(field, index) in fields.slice(0, -1)" :value="field.uuid" :key="index"
                            v-model="form.new_field"
                            @click="form.new_field = field.uuid; current_field = field; validateForm()"
                            :id="`field_${field.uuid}`" name="field">{{
                                field.text }}</InputRadio>
                    </template>
                </Dropdown>
                <Dropdown class="z-index-[1100] h-10">
                    <template v-slot:title>
                        <span>
                            {{ current_state.text ?? data.state?.name ?? "استان" }}
                        </span>
                    </template>
                    <template v-slot:option>
                        <InputRadio v-for="(state, index) in states" v-model="current_state.uuid" :value="state.uuid"
                            :key="index" @click.prevent="stateOnClick(state)" :id="`state_${state.uuid}`" name="state">
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
                        <InputRadio v-for="(city, index) in cities" :value="city.uuid" :key="index"
                            v-model="form.new_city"
                            @click="form.new_city = city.uuid; current_city = city; validateForm()"
                            :id="`city_${city.uuid}`" name="city">{{
                                city.text }}</InputRadio>
                    </template>
                </Dropdown>
                <InputCheckbox :class="form.has_advisor ? '' : 'col-span-2'" v-model="form.has_advisor"
                    name="has_advisor" id="has_advisor">
                    مشاور دارم
                </InputCheckbox>
                <div class="textbox" v-if="form.has_advisor">
                    <input type="text" id="txtAdvisorCode" placeholder="" v-model="form.advisor" />
                    <label for="txtAdvisorCode">کد مشاور</label>
                </div>

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
                        <input type="password" placeholder="" v-model="frmPassword.password" required
                            id="txtPassword" />
                        <label for="txtPassword">گذرواژه جدید</label>
                    </div>
                    <div class="textbox">
                        <input type="password" placeholder="" v-model="frmPassword.confirm" required
                            id="txtPasswordConfirm" />
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
import Auth from '~/middlewares/Auth';
import StudentMiddleware from '~/middlewares/StudentMiddleware';

definePageMeta({ middleware: [Auth, StudentMiddleware] })
useHead({ title: "ویرایش پروفایل" })
const error_happened = ref(false);
const confirmError = ref(false)
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
    first_name: "",
    last_name: "",
    new_city: "",
    new_field: "",
    gender: "",
    grade: 0,
    has_advisor: false,
    advisor: null
});
const frmPassword = ref({
    password: '',
    confirm: ''
})
const data = ref({});


async function requestToEdit() {
    loading.value = true

    await $axios.patch("students/profile/update", form.value).then((response) => {
        if (response.data.ok) {
            userData.logout()
            userData.setUserData(response.data.data)
            navigateTo("/edit-profile", { open: { target: "_self" } })
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
            let response = await $axios.patch("students/profile/update", { password: frmPassword.value.password })

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
    if (form.value.grade < 7 || form.value.grade > 13) return;
    if (form.value.grade > 9 && form.value.new_field == "") return;
    if (form.value.new_city == "") return;
    if (form.value.gender == "") return;
    IsFormValid.value = true
}

function gradeOnClick() {
    if (form.value.grade < 10) {
        form.value.new_field = fields.value[3].uuid;
    }
}

function stateOnClick(state) {
    form.value.new_city = "";
    current_city.value.name = "شهر";
    current_state.value = state;
    get_cities(state.uuid);
    validateForm()
}

async function collect_profile() {
    loading.value = true
    await $axios
        .get("students/profile")
        .then(async (response) => {
            if (response.data.ok) {
                data.value = response.data.data;
                form.value.first_name = data.value.first_name
                form.value.last_name = data.value.last_name
                form.value.new_city = data.value.city.uuid
                current_city.value = data.value.city
                current_state.value = data.value.state
                form.value.new_field = data.value.field.uuid
                current_field.value = data.value.field
                form.value.gender = data.value.gender
                form.value.advisor = data.value.advisor.uuid
                genders.forEach(gender => {
                    if (gender.value === data.value.gender)
                        current_gender.value = gender
                });
                form.value.grade = data.value.grade
                grades.forEach(grade => {
                    if (grade.value === data.value.grade)
                        current_grade.value = grade
                });
                form.value.has_advisor = data.value.has_advisor
                get_cities(data.value.state.uuid)
            } else {
                console.log("Something went wrong", response.data.message)
            }
        })
        .catch((err) => {
            console.log(err);
        }).finally(() => loading.value = false);
}

onMounted(() => {
    collect_profile().then(() => {
        validateForm();
    });
});

onBeforeMount(async () => {
    loading.value = true
    await $axios.get("fields").then((response) => {
        if (response.data.ok) {
            fields.value = response.data.data;
        }
    }).catch((response) => {
        console.log(response);
    });

    await $axios.get("states").then((response) => {
        if (response.data.ok) {
            states.value = response.data.data;
        }
    }).catch((response) => {
        console.log(response);
    }).finally(() => loading.value = false);
})
</script>