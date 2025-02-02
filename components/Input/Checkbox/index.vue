<script setup>
const props = defineProps({
  modelValue: {},
  name: { type: String },
  id: {},
  value: { type: String },
  dir: { type: String, default: 'rtl' },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-row items-center justify-center" :dir="dir">
    <input :checked="modelValue" class="hidden" type="checkbox" :name="name" :id="id" :value="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)" />
    <label class="w-full h-full relative flex flex-row items-center cursor-pointer"
      :class="dir == 'ltr' ? 'pl-8' : 'pr-6'" :for="id">
      <span class="rounded-md right-0 border-base-300 h-[18px] w-[18px] absolute flex items-center justify-center"
        :class="modelValue ? 'border-none bg-main' : 'border-2'">
        <span class="h-[10px] w-[10px]">
          <img class="h-full w-full" src="/images/checked.png" alt="checked" />
        </span>
      </span>
      <slot></slot>
    </label>
  </div>
</template>
