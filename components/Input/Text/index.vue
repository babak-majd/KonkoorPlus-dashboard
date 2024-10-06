<template>
  <div class="relative flex items-center justify-center h-full w-full">
    <input :id="inputId" :title="title" :autocomplete="autocomplete" :value="value" :type="isVisible ? 'text' : type"
      :class="[baseClasses, inputClass]" :style="inputStyle" @input="updateValue"
      class="resize-none bg-white w-full border border-b-[2px] border-base-400 focus:border-b-main rounded-[3px] text-sm placeholder:text-sm p-2 h-10 text-base-content placeholder:text-base-400" />
    <span v-if="type === 'password' && value !== ''" class="cursor-pointer lg:hidden absolute right-2"
      @click="isVisible = !isVisible">
      <SvgSlashEye v-if="isVisible" />
      <SvgEye v-else />
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  autocomplete: {},
  value: {},
  inputId: {},
  placeholder: {},
  value: {},
  inputClass: { type: String, default: '' },
  inputStyle: { type: [String, Object], default: '' },
  title: { type: String, default: '' },
  type: { type: String, default: 'text' }
});

const emit = defineEmits(['update:modelValue']);
const isVisible = ref(false);
const baseClasses = 'resize-none bg-white w-full border border-b-[2px] border-base-400 focus:border-b-primary rounded-[3px] text-sm placeholder:text-sm p-2 h-10 text-base-content placeholder:text-base-400';

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
