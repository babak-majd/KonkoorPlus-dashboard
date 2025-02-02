<template>
  <div class="flex flex-col w-full h-full gap-12 items-center p-2">
    <div class="flex flex-col w-full p-4 gap-10 md:grid md:grid-cols-2 md:gap-9 md:p-6">
      <WidgetOverviewCard title="دانش آموزان" link="/advisor/overview/students">
        <template v-slot:svg-file>
          <SvgStudents class="w-16" />
        </template>
      </WidgetOverviewCard>

      <WidgetOverviewCard title="گزارش" link="/advisor/overview/report">
        <template v-slot:svg-file>
          <SvgReport class="w-16" />
        </template>
      </WidgetOverviewCard>
    </div>
  </div>
</template>

<script setup>
import AdviserMiddleware from '~/middlewares/AdviserMiddleware';
import Auth from '~/middlewares/Auth';

definePageMeta({
  layout: 'adviser',
  middleware: [Auth, AdviserMiddleware]
})
useHead({ title: 'نمای کلی' })
</script>

<style></style>