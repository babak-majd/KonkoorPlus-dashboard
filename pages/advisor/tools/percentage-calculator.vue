<template>
    <div class="flex w-full justify-center items-center p-2">
        <div class="w-full lg:w-[24rem] lg:border-2 rounded-lg lg:p-2 !pt-10 gap-8 flex flex-col">
            <div class="custom_input_box text-base-content w-full lg:w-full">
                <InputTextMarked @change="percentageCalculator()" dir="ltr" v-model="questions" required
                    id="input_questions" type="number">
                    <label class="cursor-text" for="input_questions" dir="rtl">
                        تعداد سوالات
                    </label>
                </InputTextMarked>
            </div>
            <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-2 pt-4">
                <InputTextMarked @change="percentageCalculator()" dir="ltr" v-model="corrects" required
                    id="input_corrects" type="number">
                    <label class="cursor-text" for="input_corrects" dir="rtl">
                        پاسخ‌های درست
                    </label>
                </InputTextMarked>
                <InputTextMarked @change="percentageCalculator()" dir="ltr" v-model="wrongs" required id="input_wrongs"
                    type="number">
                    <label class="cursor-text" for="input_wrongs" dir="rtl">
                        پاسخ‌های غلط
                    </label>
                </InputTextMarked>
            </div>
            <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-2 ">
                <div dir="rtl" class="text-base-content w-full lg:w-[22.625rem]">
                    <InputCheckbox @change="percentageCalculator()" v-model="withNegetive" name="withNegetive"
                        id="withNegetive">
                        با نمره منفی
                    </InputCheckbox>
                </div>
            </div>
            <div class="custom_input_box text-base-content w-full lg:w-full gap-px">
                <button @click="percentageCalculator()" type="submit" class="btn-primary w-full lg:w-full">
                    محاسبه درصد
                </button>
            </div>
            <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-px">
                <div class="flex flex-row gap-2">
                    <span class="font-bold">تعداد نزده:</span>
                    <span>{{ undid }}</span>
                </div>
                <div class="flex flex-row gap-2">
                    <span class="font-bold">درصد شما:</span>
                    <span class="ltr">{{ percentage }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdviserMiddleware from '~/middlewares/AdviserMiddleware'
import Auth from '~/middlewares/Auth'

definePageMeta({
    layout: 'adviser',
    middleware: [Auth, AdviserMiddleware]
})
const questions = ref("")
const corrects = ref("")
const wrongs = ref("")
const undid = ref(0)
const percentage = ref(0)
const withNegetive = ref(true)

function percentageCalculator() {
    if (corrects.value === "" || wrongs.value === "" || questions.value === "") {
        return;
    }
    undid.value = questions.value - corrects.value - wrongs.value
    if (undid.value < 0 || corrects.value < 0 || wrongs.value < 0 || questions.value < 0) {
        questions.value = 0;
        corrects.value = 0;
        wrongs.value = 0;
    } else if (corrects.value + wrongs.value + questions.value <= 0) {
        questions.value = 0;
        corrects.value = 0;
        wrongs.value = 0;
        percentage.value = 0;
    } else {
        if (withNegetive.value) {
            percentage.value = (Math.floor(((corrects.value * 3) - wrongs.value) / (questions.value * 3) * 10000)) / 100;
        } else {
            percentage.value = Math.floor(corrects.value / questions.value * 10000) / 100;
        }
    }
}
</script>