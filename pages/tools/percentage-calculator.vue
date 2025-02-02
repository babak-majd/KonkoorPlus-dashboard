<template>
    <div class="flex w-full justify-center items-center p-2">
        <div class="w-full lg:w-[24rem] lg:border-2 rounded-lg lg:p-2 !pt-6 gap-2 flex flex-col">
            <div class="custom_input_box text-base-content w-full lg:w-full">
                <InputTextMarked @change="percentageCalculator()" dir="ltr" v-model="questions" required
                    id="input_questions" type="number">
                    <label class="cursor-text" for="input_questions" dir="rtl">
                        تعداد سوالات
                    </label>
                </InputTextMarked>
            </div>
            <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-px pt-4">
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
            <div class="custom_input_box text-base-content w-full lg:w-full grid grid-cols-2 gap-px">
                <div class="flex flex-row gap-2">
                    <span class="font-bold">تعداد نزده:</span>
                    <span>{{ questions - wrongs - corrects }}</span>
                </div>
                <div class="flex flex-row gap-2">
                    <span class="font-bold">درصد شما:</span>
                    <span>{{ percentage }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const questions = ref(0)
const corrects = ref(0)
const wrongs = ref(0)
const undid = ref(0)
const percentage = ref(0)

function percentageCalculator() {
    undid.value = questions.value - corrects.value - wrongs.value
    if (undid.value < 0 || corrects.value < 0 || wrongs.value < 0 || questions.value < 0) {
        questions.value = 0;
        corrects.value = 0;
        wrongs.value = 0;
    } else {
        percentage.value = (Math.floor(((corrects.value * 3) - wrongs.value) / (questions.value * 3) * 10000)) / 100;
    }
}
</script>