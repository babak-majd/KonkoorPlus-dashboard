<template>
    <div class="h-full w-full p-2">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div class="grid gap-2 lg:grid-cols-5">
            <Accordion labelClass="!bg-main" svgClass="!fill-white">
                <template v-slot:label>
                    <span class="text-white">افزودن</span>
                </template>
                <div class="flex flex-col pb-2 gap-6">
                    <div class="custom_input_box text-base-content w-full lg:w-full pt-4">
                        <InputTextMarked dir="ltr" v-model="form.title" required id="input_title">
                            <label class="cursor-text" for="input_title" dir="rtl">
                                عنوان
                            </label>
                        </InputTextMarked>
                    </div>
                    <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-px">
                        <InputTextMarked @change="durationCalculator()" dir="ltr" v-model="duration.mins" required
                            id="input_duration_mins" type="number">
                            <label class="cursor-text" for="input_duration_mins" dir="rtl">
                                دقیقه
                            </label>
                        </InputTextMarked>
                        <InputTextMarked @change="durationCalculator()" dir="ltr" v-model="duration.hours" required
                            id="input_duration_hours" type="number">
                            <label class="cursor-text" for="input_duration_hours" dir="rtl">
                                ساعت
                            </label>
                        </InputTextMarked>
                    </div>
                    <div class="custom_input_box text-base-content w-full lg:w-full gap-px">
                        <InputTextMarked dir="ltr" v-model="form.test" required id="input_test" type="number">
                            <label class="cursor-text" for="input_test" dir="rtl">
                                تعداد تست
                            </label>
                        </InputTextMarked>
                    </div>
                    <div class="text-base-content w-full lg:w-full">
                        <Dropdown v-if="lessons.length > 0" class="z-index-[1100] h-10">
                            <template v-slot:title>
                                <span>
                                    {{ current_lesson.text ?? "درس" }}
                                </span>
                            </template>
                            <template v-slot:option>
                                <InputRadio v-for="(lesson, index) in lessons" :value="lesson.uuid" :key="index"
                                    v-model="form.lesson" @click="form.lesson = lesson.uuid; current_lesson = lesson"
                                    :id="`lesson_${lesson.uuid}`" name="lesson">{{
                                        lesson.text }}</InputRadio>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="custom_input_box text-base-content w-full lg:w-full">
                        <InputTextMarked dir="ltr" v-model="form.description" required id="input_description">
                            <label class="cursor-text" for="input_description" dir="rtl">
                                توضیحات
                            </label>
                        </InputTextMarked>
                    </div>
                    <button @click="add_report_item()" class="custom_input_box btn-primary w-full lg:w-full">
                        ذخیره
                    </button>
                </div>
            </Accordion>
            <Accordion labelClass="!bg-main-100" v-if="data?.length ?? 0 > 0">
                <template v-slot:label>
                    گزارش کلی
                </template>
                <div class="relative gap-2 flex flex-col">
                    <div class="flex flex-row flex-wrap gap-1">
                        <div class="font-bold">مطالعه امروز:</div>
                        <div class="font-bold">
                            {{ showDuration(Object.values(overview).reduce((acc, curr) => acc + curr, 0)) }}
                        </div>
                    </div>
                    <hr />
                    <div class="flex flex-col">
                        <div v-for="item in Object.keys(overview)" class="flex flex-row gap-2 pb-2">
                            <div class="font-bold">{{ item }}:</div>
                            <div>{{ showDuration(overview[item]) }}</div>
                        </div>
                    </div>
                </div>
            </Accordion>
            <Accordion v-if="data?.length ?? 0 > 0" v-for="(item, index) in data">
                <template v-slot:label>
                    {{ item.title }}
                </template>
                <div class="relative">
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">درس:</div>
                        <div>{{ item.lesson_title }}</div>
                    </div>
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">مدت‌زمان:</div>
                        <div>{{ showDuration(item.duration) }}</div>
                    </div>
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">تعداد تست:</div>
                        <div>{{ item.test }}</div>
                    </div>
                    <div v-if="item.description" class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">توضیحات:</div>
                        <div>{{ item.description }}</div>
                    </div>
                    <button @click="delete_report_item(item.uuid)"
                        class="[&>svg]:fill-danger hover:bg-red-100 rounded-[3px] cursor-pointer absolute bottom-2 -left-2">
                        <SvgTrash />
                    </button>
                </div>
            </Accordion>
        </div>
    </div>
</template>

<script setup>
import Request from "~~/Api/Request";

const route = useRoute();
const request = new Request;
const data = ref([]);
const overview = ref({});
const lessons = ref({});
const current_lesson = ref({})
const duration = ref({
    mins: 0,
    hours: 0
})
const form = ref({
    report: "",
    lesson: "",
    title: "",
    test: 0,
    description: "",
    duration: "",
});

onMounted(() => {
    collect_report_items();
    collect_lessons();
});

async function collect_report_items() {
    if (!route.query.ruid) {
        navigateTo("/reports");
    } else {
        form.value.report = route.query.ruid
        await request
            .get(`reports/items/${route.query.ruid}`)
            .then((response) => {
                data.value = response.data.items;
                overview.value = response.data.overview;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

async function collect_lessons() {
    if (!route.query.ruid) {
        navigateTo("/reports");
    } else {
        form.value.report = route.query.ruid
        await request
            .get(`fields/lessons`)
            .then((response) => {
                lessons.value = response.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

async function delete_report_item(uuid) {
    await request
        .delete(`reports/items/${uuid}`)
        .then((response) => {
            if (response.status_code === 204) {
                collect_report_items()
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

async function add_report_item() {
    await request
        .post(`reports/items`, form.value)
        .then((response) => {
            if (response.ok) {
                collect_report_items()
                form.value.title = ""
                form.value.lesson = ""
                form.value.description = ""
                form.value.duration = ""
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
function durationCalculator() {
    duration.value.hours = Number(duration.value.hours)
    duration.value.mins = Number(duration.value.mins)
    let mins = (duration.value.hours * 60) + duration.value.mins;
    if (mins <= 0) {
        duration.value.hours = 0
        duration.value.mins = 0
    } else {
        form.value.duration = mins;
        duration.value.hours = Math.floor(mins / 60)
        duration.value.mins = mins - (duration.value.hours * 60)
    }
}
function showDuration(duration) {
    let hours = Math.floor(duration / 60)
    let mins = duration - (hours * 60)
    let duration_text = ''
    if (hours > 0) {
        duration_text = `${hours} ساعت و `
    }
    duration_text += `${mins} دقیقه`
    return duration_text
}
</script>