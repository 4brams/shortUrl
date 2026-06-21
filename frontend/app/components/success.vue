<template>
	<div id="bg">
		<div :class="{ formMobile: isMobile, form: !isMobile }">
			<h1>Short URL</h1>
			<a :href="`/${props.name}`">https://嗨.台灣/{{ props.name }}</a>
		</div>
	</div>
</template>

<script setup>
const isMobile = ref(false);
const props = defineProps({
	name: String,
});

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
a {
	color: var(--sgold);
	font-size: 1.5rem;
	text-decoration: underline;
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
