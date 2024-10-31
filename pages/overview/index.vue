<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex flex-col p-4 gap-10 md:grid md:grid-cols-2 md:gap-9 md:p-6">
            <WidgetOverviewCard title="تقویم درسی" link="/overview/calendar">
                <template v-slot:svg-file>
                    <SvgCalender class="w-16" />
                </template>
            </WidgetOverviewCard>

            <WidgetOverviewCard title="گزارش" link="/overview/report">
                <template v-slot:svg-file>
                    <SvgReport class="w-16" />
                </template>
            </WidgetOverviewCard>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: 'نمای کلی',
    meta: [
        { name: "og:title", content: "نمای کلی" },
        { name: "og:description", content: "تقویم تحصیلی خود را مشاهده کرده و گزارش آن را دریافت کنید" }
    ]
})
</script>