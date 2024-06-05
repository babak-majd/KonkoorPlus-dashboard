<template>
    <div class="h-full w-full p-2">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div v-if="data?.length ?? 0 > 0" class="grid gap-2 lg:grid-cols-5">
            <Accordion>
                <template v-slot:label>
                    افزودن
                </template>
                <div class="relative">
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">درس:</div>
                        
                    </div>
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">مدت‌زمان:</div>
                        
                    </div>
                    <div class="flex flex-row gap-2 pb-2">
                        <div class="font-bold">توضیحات:</div>
                        
                    </div>
                </div>
            </Accordion>
            <Accordion v-for="(item, index) in data">
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
                    <button @click="delete_report_item(item.uuid)" class="[&>svg]:fill-danger hover:bg-red-100 rounded-[3px] cursor-pointer absolute bottom-2 -left-2">
                        <SvgTrash />
                    </button>
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
import jalaliMoment from "jalali-moment";

const request = new Request;
const data = ref({});

onMounted(() => {
    collect_report_items();
});

async function collect_report_items() {
    await request
        .get("reports/items")
        .then((response) => {
            data.value = response.data;
            console.log(data.value);
        })
        .catch((err) => {
            console.log(err);
        });
}

async function delete_report_item(uuid) {
    await request
        .delete(`reports/items/${uuid}`)
        .then((response) => {
            data.value = response.data;
            if(response.ok){
                navigateTo(".");
            }
            console.log(data.value);
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>