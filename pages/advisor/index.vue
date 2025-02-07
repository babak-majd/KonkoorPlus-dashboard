<template>
  <div class="flex flex-col w-full h-full gap-12 items-center p-2">
    <!-- profile card mobile -->
    <div class="md:hidden flex flex-col gap-5 rounded-lg bg-stone-100 py-4 px-2 w-full">
      <!-- head -->
      <div class="flex items-center justify-between">
        <img :src="data.gender === 'M' ? '/images/boy.jpg' : '/images/girl.jpg'" class="w-16 h-16 rounded-full"
          alt="profile-image" />
        <div class="flex flex-col justify-evenly h-full">
          <span class="font-bold">{{ `${data.first_name} ${data.last_name}` }}</span>
        </div>
        <div class="flex flex-col gap-2" style="font-size: 10px;">
          <NuxtLink to="/advisor/edit-profile" class="rounded-lg gap-2 p-2 flex items-center bg-main text-white">
            <span>ویرایش اطلاعات</span>
            <SvgEdit class="w-3" />
          </NuxtLink>
          <button @click="logout()" class="rounded-lg gap-2 p-2 border-main border text-main">
            خروج از حساب
          </button>
        </div>
      </div>

      <!-- content -->
      <div class="grid grid-cols-2 gap-x-1 gap-y-3">
        <div class="flex flex-col gap-1">
          <span class="font-medium">استان:</span><span class="text-sm">{{ data.state.name }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-medium">شهر:</span><span class="text-sm">{{ data.city.name }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-medium">شماره تلفن:</span><span class="text-sm">{{ data.phone_number }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-medium">جنسیت:</span>
          <span class="text-sm">
            {{ data.gender === 'M' ? 'آقا' : 'خانم' }}
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-medium">کد مشاور:</span>
          <span class="cursor-pointer" @click="copy(data.uuid)">{{ data.uuid }}</span>
        </div>
      </div>
    </div>

    <!-- profile card desktop -->
    <div
      class="hidden md:flex items-start gap-5 text-sm xl:text-base rounded-lg bg-stone-100 p-4 w-full xl:justify-between max-w-5xl">
      <img :src="data.gender === 'M' ? '/images/boy.jpg' : '/images/girl.jpg'" alt="profile"
        class="w-44 h-44 xl:w-60 xl:h-60 rounded-xl" />

      <div class="grid grid-cols-2 gap-y-6 gap-x-2 xl:gap-y-10 self-center">
        <span><b>نام:</b> {{ `${data.first_name} ${data.last_name}` }}</span>
        <span><b>شماره تلفن:</b> {{ data.phone_number }}</span>
        <span><b>استان:</b> {{ data.state.name }}</span>
        <span><b>شهر:</b> {{ data.city.name }}</span>
        <span><b>جنسیت:</b> {{ data.gender === 'M' ? 'آقا' : 'خانم' }}</span>
        <span><b>کد مشاور:</b> <span class="cursor-pointer" @click="copy(data.uuid)">{{ data.uuid }}</span></span>
      </div>

      <!-- tools -->
      <div class="flex flex-col gap-2 self-end text-xs xl:text-base">
        <NuxtLink to="/advisor/edit-profile" class="rounded-lg gap-2 p-2 flex items-center bg-main text-white">
          <span>ویرایش اطلاعات</span>
          <SvgEdit class="w-5" />
        </NuxtLink>
        <button @click="logout()" class="rounded-lg gap-2 p-2 border-main border text-main">
          خروج از حساب
        </button>
      </div>
    </div>

    <!-- best students -->
    <div class="flex flex-col items-center gap-8">
      <h2 class="text-xl font-semibold">برترین های مطالعه و تمرین {{
        Tools.DateTimeFormat(topStudents[0]?.created_at, 'fa-IR', {
          month: "long",
          day: '2-digit'
        }) }}</h2>

      <!-- grades and fields -->
      <div class="flex flex-col items-center gap-4">
        <!-- grades -->
        <div class="flex items-center gap-1 p-1 bg-stone-100 rounded-full">
          <span v-for="grade in grades" :key="grade.value" :class="[
            'px-2 py-1 rounded-full transition-colors duration-300 cursor-pointer',
            activeGrade === grade.value ? 'bg-main text-white' : ''
          ]" @click="handleGradeClick(grade.value)">{{ grade.label }}</span>
        </div>

        <!-- fields - فقط برای غیر پایه نهم -->
        <div v-if="activeGrade !== 9" class="flex items-center gap-1 p-1 bg-stone-100 rounded-full">
          <span v-for="field in fields" :key="field.value" :class="[
            'px-2 py-1 rounded-full transition-colors duration-300 cursor-pointer',
            activeField === field.value ? 'bg-main text-white' : ''
          ]" @click="handleFieldClick(field.value)">{{ field.label }}</span>
        </div>
      </div>

      <!-- students -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-24">
        <div v-for="student in topStudents" :key="student.report.first_name + student.report.last_name"
          class="flex flex-col gap-4 items-center p-3 rounded-lg border shadow-sm shadow-blue-100">
          <SvgBestStudentFrame class="w-32"
            :image="student.report.gender === 'M' ? '/images/boy.jpg' : '/images/girl.jpg'" />
          <div class="text-white bg-main w-full text-center rounded-md py-1">
            {{ student.report.first_name }} {{ student.report.last_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserData } from "~/store/user_data";
import Auth from "~/middlewares/Auth";
import { useToken } from "~/store/tokenStore";
import AdviserMiddleware from "~/middlewares/AdviserMiddleware";

definePageMeta({
  middleware: [Auth, AdviserMiddleware],
  layout: 'adviser'
});

useHead({
  title: "صفحه اصلی"
})

const data = ref({
  first_name: '',
  last_name: '',
  phone_number: '',
  has_advisor: false,
  state: { name: '' },
  city: { name: '' },
  grade: 0,
  field: { name: '' },
  gender: 'M'
});
const userData = useUserData()
const token = useToken()
const { $axios } = useNuxtApp()

const grades = [
  { value: 9, label: 'نهم' },
  { value: 10, label: 'دهم' },
  { value: 11, label: 'یازدهم' },
  { value: 12, label: 'دوازدهم' }
];

const fields = [
  { value: 'علوم انسانی', label: 'انسانی' },
  { value: 'علوم تجربی', label: 'تجربی' },
  { value: 'ریاضی و فیزیک', label: 'ریاضی' }
];

const students = ref([/* اینجا دیتای API رو قرار بدید */]);
const activeGrade = ref(grades[0].value);
const activeField = ref(fields[0].value);
let intervalId = ref(null);

// محاسبه برترین دانش‌آموزان بر اساس گرید و رشته فعال
const topStudents = computed(() => {
  if (activeGrade.value === 9) {
    // برای پایه نهم فقط بر اساس نمره مرتب می‌کنیم، بدون در نظر گرفتن رشته
    return students.value
      .filter(student => student.grade === 9)
      .sort((a, b) => b.report.score - a.report.score)
      .slice(0, 3);
  }

  return students.value
    .filter(student =>
      student.grade === activeGrade.value &&
      student.field.name === activeField.value
    )
    .sort((a, b) => b.report.score - a.report.score)
    .slice(0, 3);
});

// بررسی وجود دانش‌آموز در یک پایه و رشته خاص
const hasStudentsInFieldAndGrade = (grade, field) => {
  return students.value.some(student =>
    student.grade === grade &&
    (!field || student.field.name === field)
  );
};

// پیدا کردن اولین رشته معتبر برای یک پایه
const findFirstValidField = (grade) => {
  if (grade === 9) return null;
  return fields.find(field => hasStudentsInFieldAndGrade(grade, field.value))?.value || fields[0].value;
};

// تنظیم اینتروال جدید
const startInterval = () => {
  clearInterval(intervalId.value);

  intervalId.value = setInterval(() => {
    if (activeGrade.value === 9) {
      // اگر در پایه نهم هستیم، مستقیم برو پایه بعدی
      const nextGrade = grades[1].value; // برو به دهم
      activeGrade.value = nextGrade;
      activeField.value = findFirstValidField(nextGrade);
    } else {
      // پیدا کردن ایندکس رشته فعلی
      const currentFieldIndex = fields.findIndex(f => f.value === activeField.value);
      const nextFieldIndex = (currentFieldIndex + 1) % fields.length;

      if (nextFieldIndex === 0) {
        // اگر رشته‌ها تموم شدن، برو پایه بعدی
        const currentGradeIndex = grades.findIndex(g => g.value === activeGrade.value);
        const nextGradeIndex = (currentGradeIndex + 1) % grades.length;
        activeGrade.value = grades[nextGradeIndex].value;

        if (activeGrade.value === 9) {
          // اگر رفتیم به نهم، فیلد رو پاک کن
          activeField.value = null;
        } else {
          // پیدا کردن اولین رشته معتبر برای پایه جدید
          activeField.value = findFirstValidField(activeGrade.value);
        }
      } else {
        // برو به رشته بعدی در همین پایه
        activeField.value = fields[nextFieldIndex].value;
      }
    }
  }, 5000);
};

// کلیک روی گرید
const handleGradeClick = (grade) => {
  activeGrade.value = grade;
  activeField.value = findFirstValidField(grade);
  startInterval();
};

// کلیک روی فیلد
const handleFieldClick = (field) => {
  activeField.value = field;
  startInterval();
};


// راه‌اندازی اولیه
onMounted(() => {
  if (token.tokenIsSet) {
    data.value = userData.getUserData()
    getBestStudnets().then(() => {
      activeField.value = findFirstValidField(activeGrade.value);
      startInterval();
    })
  }
  else {
    logout()
  }
});

// پاکسازی
onUnmounted(() => {
  clearInterval(intervalId.value);
});

async function getBestStudnets() {
  try {
    let response = await $axios.get('league/daily')
    if (response.data.ok) {
      students.value = response.data.data
    }
  } catch (ex) {
    console.log(ex)
  }
}


function copy(text) {
  useCopy(text)
  Toastify.success('کد مشاور با موفقیت کپی شد')
}
function logout() {
  userData.logout()
  token.logout()
  return navigateTo('/auth/login-with-password')
}
</script>
