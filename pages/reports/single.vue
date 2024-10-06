<template>
    <div class="h-full w-full p-2">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div v-if="data?.length ?? 0 > 0" class="grid gap-2 lg:grid-cols-5">
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
            <Accordion v-for="(item, index) in data">
                <template v-slot:label>
                    {{ item.title }}
                </template>
                <div>
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
                        <div>{{ item.test }} </div>
                    </div>
                    <div v-if="item.description" class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">توضیحات:</div>
                        <div>{{ item.description }}</div>
                    </div>
                </div>
            </Accordion>
        </div>
        <div v-else class="bg-secondary h-20 w-full flex justify-center items-center">
            داده‌ای برای این گزارش وارد نشده‌است.
        </div>
    </div>
</template>

<script setup>
import Request from "~~/Api/Request";

const route = useRoute();
const request = new Request;
const data = ref([]);
const overview = ref({});

onMounted(() => {
    collect_report_items();
});

async function collect_report_items() {
    if (!route.query.ruid) {
        navigateTo("/reports");
    } else {
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