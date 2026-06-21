<template>
	<div id="bg">
		<div :class="{ formMobile: isMobile, form: !isMobile }">
			<h1>Login</h1>
			<div class="input-container">
				<div class="title-container">
					<p class="title">Account</p>
				</div>
				<input v-model="name" class="input" type="text" />
			</div>
			<div class="input-container">
				<div class="title-container">
					<p class="title">Password</p>
				</div>
				<input v-model="url" class="input" type="password" />
			</div>
			<p class="errormsg">{{ errMsg }}</p>
			<input @click="submit" class="btn" type="submit" value="Submit" />
		</div>
	</div>
</template>

<script setup>
const name = ref("");
const url = ref("");
const errMsg = ref("");
const isMobile = ref(false);

const checkErr = () => {
	errMsg.value = "";
	let isErr = false;

	if (name.value == "") {
		errMsg.value = "Accont can't be blank.";
		isErr = true;
	} else if (url.value == "") {
		errMsg.value = "Password can't be blank.";
		isErr = true;
	}

	return isErr;
};

const submit = async () => {
	if (!checkErr()) {
		const res = await fetch(`/api/admin/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				account: name.value,
				password: url.value,
			}),
		});
		const data = await res.json();

		if (res.status == 401) {
			errMsg.value = "Account or Password is wrong.";
		} else if (res.status == 200) {
			localStorage.setItem("token", data.token);
			window.location.href = "/admin";
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
	margin-top: 1rem;
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
	transform: scale(1);
	transition: transform 0.2s linear;
}
.btn:hover {
	transform: scale(1.05);
	transition: transform 0.2s linear;
}
</style>
