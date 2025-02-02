<template>
    <div v-if="request.pending.value"
        class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
        <ToolsLoading class="w-32 h-32" />
    </div>

    <div class="flex w-full justify-center items-center p-2">
        <div class="w-full lg:w-[24rem] lg:border-2 rounded-lg lg:p-2 !pt-6">
            <form @keydown="validateForm()" @submit.prevent="requestToEdit()"
                class="flex flex-col gap-8 w-full items-center">
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
                    <Dropdown class="z-index-[1100] h-10">
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
                </div>
                <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
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
                </div>
                <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem] grid grid-cols-2 gap-2">
                    <Dropdown class="z-index-[1100] h-10">
                        <template v-slot:title>
                            <span>
                                {{ current_state.text ?? data.state?.name ?? "استان" }}
                            </span>
                        </template>
                        <template v-slot:option>
                            <InputRadio v-for="(state, index) in states" v-model="current_state.uuid"
                                :value="state.uuid" :key="index" @click.prevent="stateOnClick(state)"
                                :id="`state_${state.uuid}`" name="state">
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
                </div>
                <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem]">
                    <InputCheckbox v-model="form.has_advisor" name="has_advisor" id="has_advisor">
                        مشاور دارم
                    </InputCheckbox>
                </div>
                <div class="flex justify-between w-full lg:w-full items-center flex-col lg:flex-row gap-4">
                    <button type="submit" class="btn-primary w-full" :disabled="!IsFormValid">
                        ذخیره
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import Request from "~~/Api/Request";
import ConfigStore from "~~/store/ConfigStore";

const request = new Request;
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
    first_name: "",
    last_name: "",
    new_city: "",
    new_field: "",
    gender: "",
    grade: 0,
    has_advisor: false
});
const data = ref({});


async function requestToEdit() {
    await request.patch("students/profile/update", form.value).then((response) => {
        if (response.ok) {
            collect_profile();
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
    if (form.value.first_name == "") return;
    if (form.value.last_name == "") return;
    if (form.value.grade < 7 || form.value.grade > 13) return;
    if (form.value.grade > 9 && form.value.new_field == "") return;
    if (form.value.new_city == "") return;
    if (form.value.gender == "") return;
    IsFormValid.value = true
}

async function gradeOnClick() {
    if (form.value.grade < 10) {
        form.value.new_field = fields.value[3].uuid;
    }
}

async function stateOnClick(state) {
    form.value.new_city = "";
    current_city.value.name = "شهر";
    current_state.value = state;
    get_cities(state.uuid);
    validateForm()
}

async function collect_profile() {
    await request
        .get("students/profile")
        .then((response) => {
            data.value = response.data;
            form.value.first_name = data.value.first_name
            form.value.last_name = data.value.last_name
            form.value.new_city = data.value.city.uuid
            current_city.value = data.value.city
            current_state.value = data.value.state
            form.value.new_field = data.value.field.uuid
            current_field.value = data.value.field
            form.value.gender = data.value.gender
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
        })
        .catch((err) => {
            console.log(err);
        });
}

onMounted(() => {
    collect_profile().then(() => {
        validateForm();
    });
});

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