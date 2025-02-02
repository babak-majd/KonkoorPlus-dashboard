<template>
    <div class="h-full w-full">
        <!-- loading -->
        <div v-if="request.pending.value"
            class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
            <ToolsLoading class="w-32 h-32" />
        </div>

        <div v-if="data.reports ?? false" class="grid p-2 gap-2 lg:grid-cols-5">
            <div @click="create_report()" v-if="data.today_uuid === null"
                class="w-full h-16 rounded-[3px] group relative bg-secondary text-base-content hover:bg-none">
                <div
                    class="h-full w-full rounded-[3px] flex justify-center items-center gap-3 [&>svg]:fill-base-content hover:cursor-pointer hover:text-white hover:bg-slate-500">
                    ایجاد گزارش امروز
                </div>
            </div>
            <div v-for="(report, index) in data.reports"
                class="w-full h-16 rounded-[3px] group relative bg-secondary text-base-content hover:bg-none">
                <div
                    class="h-full w-full rounded-[3px] flex justify-center items-center gap-3 [&>svg]:fill-base-content group-hover:hidden">
                    <span class="text-base-content">
                        {{ Tools.DateTimeFormat(report.created_at) }}
                    </span>
                </div>
                <NuxtLink :to="`/reports/${report.uuid === data.today_uuid ? 'edit' : 'single'}?ruid=${report.uuid}`"
                    class="h-full w-full bg-base-100 rounded-[3px] justify-center items-center hidden group-hover:flex cursor-pointer">
                    <div class="flex w-full h-full p-2 gap-2">
                        <span
                            class="bg-secondary text-base-content flex justify-center items-center w-1/2 h-full rounded-[3px] group relative gap-3">
                            <span class="text-base-content">
                                امتیاز: {{ report.score }}
                            </span>
                        </span>
                        <span
                            class="bg-secondary text-base-content flex justify-center items-center w-1/2 h-full rounded-[3px] group relative gap-3">
                            <span class="text-base-content">
                                {{ report.uuid === data.today_uuid ? 'ویرایش' : 'مشاهده' }}
                            </span>
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import Request from "~~/Api/Request";

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