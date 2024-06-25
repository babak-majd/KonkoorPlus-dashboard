<template>
  <div class="h-full w-full flex justify-center p-2">
    <!-- loading -->
    <div v-if="request.pending.value"
      class="top-0 left-0 w-full h-screen fixed z-50 bg-base-350/40 flex justify-center items-center">
      <ToolsLoading class="w-32 h-32" />
    </div>
    <div v-if="data.first_name ?? false"
      class="flex flex-col relative items-center h-fit lg:border-2 rounded-lg w-full lg:w-1/2">
      <div class="flex flex-col lg:flex-row relative items-center w-full">
        <div class="w-1/4 absolute lg:relative left-0 top-0">
          <img v-if="data.gender === 'M'" src="/public/images/boy.jpg" class="w-full p-2 rounded-3xl" />
          <img v-else src="/public/images/girl.jpg" class="w-full p-2 rounded-3xl" />
        </div>
        <div class="w-full lg:w-3/4 flex flex-col justify-around p-2">
          <div class="flex flex-row justify-start gap-2">
            <div class="font-bold">نام:</div>
            <div>{{ data.first_name }}</div>
            <div>{{ data.last_name }}</div>
          </div>
          <div class="flex flex-row justify-start gap-2">
            <div class="font-bold">شماره تلفن:</div>
            <div>{{ data.phone_number }}</div>
          </div>
          <div class="flex flex-row justify-start gap-6">
            <div class="flex flex-row justify-start gap-2">
              <div class="font-bold">جنسیت:</div>
              <div>{{ data.gender === "M" ? "آقا" : "خانم" }}</div>
            </div>
            <div class="flex flex-row justify-start gap-2">
              <div class="font-bold">مشاور:</div>
              <div>{{ data.has_advisor ? "دارد" : "ندارد" }}</div>
            </div>
          </div>
          <div class="flex flex-row justify-start gap-6">
            <div class="flex flex-row justify-start gap-2">
              <div class="font-bold">استان:</div>
              <div>مازندران</div>
            </div>
            <div class="flex flex-row justify-start gap-2">
              <div class="font-bold">شهر:</div>
              <div>{{ data.city }}</div>
            </div>
          </div>
          <div class="flex flex-row justify-start gap-6">
            <div class="flex flex-row justify-start gap-2">
              <div class="font-bold">پایه تحصیلی:</div>
              <div>{{ grades[data.grade] }}</div>
            </div>
            <div v-if="data.grade > 9" class="flex flex-row justify-start gap-2">
              <div class="font-bold">رشته تحصیلی:</div>
              <div>{{ data.field }}</div>
            </div>
          </div>
        </div>
      </div>
      <button @click="logout()" class="w-full lg:w-fit lg:absolute relative lg:left-2 lg:top-2 btn-danger">
        خروج از حساب
      </button>
    </div>
  </div>
</template>

<script setup>
import Auth from "../middlewares/Auth";
import Request from "~~/Api/Request";

definePageMeta({
  middleware: [Auth],
});

const grades = {
  7: "هفتم",
  8: "هشتم",
  9: "نهم",
  10: "دهم",
  11: "یازدهم",
  12: "دوازدهم",
  13: "فارغ التحصیل",
}
const request = new Request;
const data = ref({});

onMounted(() => {
  collect_profile();
});

async function collect_profile() {
  let response = await request
    .get("students/profile")
    .then((response) => {
      data.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  ConfigStore.logout();
  navigateTo("/auth/login");
}
</script>
