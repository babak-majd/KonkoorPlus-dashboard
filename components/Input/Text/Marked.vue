<template>
  <div class="flex flex-col items-start justify-center h-10" :dir="dir">
    <div class="relative h-10 w-full">
      <InputText
        :title="title"
        :autocomplete="autocomplete"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="is_focused = true"
        @blur="is_focused = false"
        :placeholder="is_focused ? placeholder : ''"
        :id="id"
        :type="type"
        :dir="dir"
        inputClass="h-10"
        :inputClass="input_class"
        :inputStyle="input_style"
      />
      <label
        :for="id"
        class="right-0 absolute text-xs px-2 transition-all duration-300"
        :class="is_focused || modelValue !== '' ? '-top-5' : 'top-2.5'"
      >
        <slot></slot>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {},
  placeholder: { type: String },
  id: { type: String },
  dir: { type: String, default: "rtl" },
  input_class: { type: String, default: "" },
  input_style: { type: String, default: "" },
  autocomplete: { type: String, default: null},
  title: { type: String, default: null},
  type: { type: String, default: "text"}
});
const is_focused = ref(false);
</script>
