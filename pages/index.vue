<template>
	<div class="flex flex-col w-full h-full items-center p-2">
		<!-- profile card mobile -->
		<div class="md:hidden flex flex-col gap-5 rounded-lg bg-stone-100 py-4 px-2 w-full">
			<!-- head -->
			<div class="flex items-center justify-between">
				<img :src="data.gender === 'M' ? '/images/boy.jpg' : '/images/girl.jpg'" class="w-16 h-16 rounded-full"
					alt="profile-image" />
				<div class="flex flex-col justify-evenly h-full">
					<span class="font-bold">{{ `${data.first_name} ${data.last_name}` }}</span>
					<span class="text-sm">پایه {{ grades[data.grade] }}</span>
				</div>
				<div class="flex flex-col gap-2" style="font-size: 10px;">
					<NuxtLink to="/edit-profile" class="rounded-lg gap-2 p-2 flex items-center bg-main text-white">
						<span>ویرایش اطلاعات</span>
						<SvgEdit class="w-3" />
					</NuxtLink>
					<button class="rounded-lg gap-2 p-2 border-main border text-main">
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
					<span class="font-medium">رشته تحصیلی:</span>
					<span class="text-sm">
						{{ data.field.name ?? `پایه ${grades[data.grade]}` }}
					</span>
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium">جنسیت:</span>
					<span class="text-sm">
						{{ data.gender === 'M' ? 'آقا' : 'خانم' }}
					</span>
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium">مشاور:</span>
					<span class="text-sm">
						{{ data.has_advisor ? 'دارد' : 'ندارد' }}
					</span>
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
				<span><b>پایه:</b> {{ grades[data.grade] }}</span>
				<span><b>رشته تحصیلی:</b> {{ data.field.name }}</span>
				<span><b>جنسیت:</b> {{ data.gender === 'M' ? 'آقا' : 'خانم' }}</span>
				<span><b>مشاور:</b> {{ data.has_advisor ? 'دارد' : 'ندارد' }}</span>
			</div>

			<!-- tools -->
			<div class="flex flex-col gap-2 self-end">
				<NuxtLink to="/edit-profile" class="rounded-lg gap-2 p-2 flex items-center bg-main text-white">
					<span>ویرایش اطلاعات</span>
					<SvgEdit class="w-5" />
				</NuxtLink>
				<button class="rounded-lg gap-2 p-2 border-main border text-main">
					خروج از حساب
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useUserData } from "~/store/user_data";
import Auth from "../middlewares/Auth";
import { useToken } from "~/store/tokenStore";

definePageMeta({
	middleware: [Auth],
});

useHead({
	title: "صفحه اصلی"
})

const grades = {
	0: 'هیچکدام',
	7: "هفتم",
	8: "هشتم",
	9: "نهم",
	10: "دهم",
	11: "یازدهم",
	12: "دوازدهم",
	13: "فارغ التحصیل",
}
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
onMounted(async () => {
	if (token.tokenIsSet) {
		data.value = userData.getUserData()
	}
	else {
		logout()
	}
})
function logout() {
	userData.logout()
	token.logout()
	return navigateTo('/auth/login')
}
</script>
