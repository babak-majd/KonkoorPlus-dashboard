<template>
    <div class="h-full w-full">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div class="grid p-2 gap-2 w-full lg:w-fit">
            <div class="h-24 bg-gradient-to-r from-orange-400 to-red-500 text-white flex flex-row justify-between items-center p-2 rounded-lg">
                <div class="flex flex-col gap-4 w-full h-full justify-center">
                    <div class="flex flex-row justify-between">
                        <div class="font-bold text-lg">تابستونو بترکون!</div>
                        <div class="bg-yellow-400 rounded-badge px-2">بزودی...</div>
                    </div>
                    <div class="flex flex-row gap-2 text-sm justify-center">
                        جدید ترین اخبار لیگ رو از اینستاگرام کنکورپلاس دنبال کن.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Request from "~~/Api/Request";
import jalaliMoment from "jalali-moment";

const request = new Request;
const data = ref({});

onMounted(() => {
    collect_reports();
});

async function collect_reports() {
    let response = await request
        .get("reports")
        .then((response) => {
            data.value = response.data;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function create_report() {
    let response = await request
        .post("reports")
        .then((response) => {
            navigateTo(`/reports/edit?ruid=${response.data.uuid}`);
        })
        .catch((err) => {
            console.log(err);
        });
}
</script>