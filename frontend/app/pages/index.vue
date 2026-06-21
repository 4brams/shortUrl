<template>
	<div id="bg">
		<div :class="{ formMobile: isMobile, form: !isMobile }">
			<h1>Short URL</h1>
			<div class="input-container">
				<div class="title-container">
					<p class="title">Name</p>
					<p class="errormsg">{{ nameErr }}</p>
				</div>
				<input v-model="name" class="input" type="text" />
			</div>
			<div class="input-container">
				<div class="title-container">
					<p class="title">Url</p>
					<p class="errormsg">{{ urlErr }}</p>
				</div>
				<input v-model="url" class="input" type="text" />
			</div>
			<input @click="submit" class="btn" type="submit" value="Submit" />
		</div>
	</div>
	<success :name="name" v-if="showSuccess" />
</template>

<script setup>
import success from "~/components/success.vue";

const name = ref("");
const url = ref("");
const nameErr = ref("");
const urlErr = ref("");
const showSuccess = ref(false);
const isMobile = ref(false);

const checkErr = () => {
	nameErr.value = "";
	urlErr.value = "";
	let isErr = false;

	if (name.value == "") {
		nameErr.value = "Name can't be blank.";
		isErr = true;
	} else if (name.value == "admin") {
		nameErr.value = "Name 'admin' is not avaliable.";
		isErr = true;
	}
	if (url.value == "") {
		urlErr.value = "Url can't be blank.";
		isErr = true;
	}

	return isErr;
};

const submit = async () => {
	if (!checkErr()) {
		const res = await fetch(`/api/add`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: name.value,
				url: url.value,
			}),
		});
		const data = await res.json();

		console.log("data:", data);

		if (res.status == 403) {
			nameErr.value = "This name already exists.";
		} else if (res.status == 200) {
			showSuccess.value = true;
		}
	}
};

onMounted(() => {
	if (window.innerWidth <= window.innerHeight) {
		isMobile.value = true;
	} else {
		isMobile.value = false;
	}
});
</script>

<style scoped>
#bg {
	width: 100vw;
	height: 100vh;
	background-color: var(--sblack);
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
}
.form {
	width: 30vw;
	height: auto;
	background-color: var(--sblue);
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	gap: 1rem;
}
.formMobile {
	width: 80%;
	height: auto;
	background-color: var(--sblue);
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	gap: 1rem;
}
h1 {
	color: var(--sblack);
}
.title-container {
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: left;
	gap: 10px;
}
.title {
	font-size: 1.2rem;
	color: var(--sblack);
}
.errormsg {
	color: red;
}
.input-container {
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.input {
	width: calc(100% - 1.5rem);
	height: 1.5rem;
	border-radius: 999px;
	padding: 0.5rem;
	padding-left: 1rem;
	font-size: 1.1rem;
	color: var(--sblack);
}
.input:focus {
	outline: none;
}
.btn {
	width: 100%;
	height: 2.5rem;
	border-radius: 999px;
	background-color: var(--sgold);
	color: var(--swhite);
	font-size: 1rem;
	margin-top: 1rem;
	transform: scale(1);
	transition: transform 0.2s linear;
}
.btn:hover {
	transform: scale(1.05);
	transition: transform 0.2s linear;
}
</style>
