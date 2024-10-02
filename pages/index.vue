<template>
	<div class="h-full w-full flex justify-center p-2">
		<div class="flex flex-col relative items-center h-fit lg:border-2 rounded-lg w-full lg:w-1/2">
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
							<div>{{ data.state.name }}</div>
						</div>
						<div class="flex flex-row justify-start gap-2">
							<div class="font-bold">شهر:</div>
							<div>{{ data.city.name }}</div>
						</div>
					</div>
					<div class="flex flex-row justify-start gap-6">
						<div class="flex flex-row justify-start gap-2">
							<div class="font-bold">پایه تحصیلی:</div>
							<div>{{ grades[data.grade] }}</div>
						</div>
						<div v-if="data.grade > 9" class="flex flex-row justify-start gap-2">
							<div class="font-bold">رشته تحصیلی:</div>
							<div>{{ data.field.name }}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full h-full flex flex-row-reverse lg:absolute gap-2">
				<button @click="logout()" class="w-full lg:w-fit lg:absolute relative lg:left-2 lg:top-2 btn-danger">
					خروج از حساب
				</button>
				<NuxtLink to="/edit-profile"
					class="w-full lg:w-fit lg:absolute relative lg:left-2 lg:top-14 btn-secondary">
					ویرایش
				</NuxtLink>
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

onMounted(() => {
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
