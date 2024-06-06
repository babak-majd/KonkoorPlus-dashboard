<template>
    <div class="h-full w-full p-2">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div class="grid gap-2 lg:grid-cols-5">
            <Accordion>
                <template v-slot:label>
                    افزودن
                </template>
                <div class="flex flex-col pb-2 gap-6">
                    <div class="custom_input_box text-base-content w-full lg:w-full pt-4">
                        <InputTextMarked dir="ltr" v-model="form.title" required id="input_title">
                            <label class="cursor-text" for="input_title" dir="rtl">
                                عنوان
                            </label>
                        </InputTextMarked>
                    </div>
                    <div class="custom_input_box text-base-content w-full lg:w-full">
                        <InputTextMarked dir="ltr" v-model="form.duration" required id="input_duration" type="number">
                            <label class="cursor-text" for="input_duration" dir="rtl">
                                مدت زمان (به دقیقه)
                            </label>
                        </InputTextMarked>
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
                        <div>{{ item.duration }} دقیقه</div>
                    </div>
                    <div class="flex flex-row gap-2 pb-2">
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
const data = ref({});
const form = ref({
    report: "",
    lesson: "83f5a8f5-2c50-4b16-ac2c-b794bef7c5ba",
    title: "",
    description: "",
    duration: "",
});

onMounted(() => {
    collect_report_items();
});

async function collect_report_items() {
    if (!route.query.ruid) {
        navigateTo("/reports");
    } else {
        form.value.report = route.query.ruid
        await request
            .get(`reports/items/${route.query.ruid}`)
            .then((response) => {
                data.value = response.data;
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
                form.value.description = ""
                form.value.duration = ""
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>