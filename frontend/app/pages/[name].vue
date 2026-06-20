<template>
	<div>
		<h1>Redirecting...</h1>
	</div>
</template>

<style scoped>
div {
	width: 100vw;
	height: 100vh;
	background-color: #000;
	display: flex;
	justify-content: center;
	align-items: center;
}
h1 {
	color: #fff;
	font-size: 4rem;
}
</style>

<script setup>
const route = useRoute();
const name = route.params.name;

const getUrl = async () => {
	const res = await fetch(`/api/${name}`, { method: "GET" });
	const data = await res.json();

	console.log("data:", data.url);

	if (data.url === "/") {
		window.location.href = "/";
		return;
	} else if (data.url.startsWith("http")) {
		window.location.href = data.url;
	} else {
		window.location.href = `https://${data.url}`;
	}
};

getUrl();
</script>

<!-- <script setup>
const route = useRoute();
const name = route.params.name;
console.log("name:", name);
const response = await fetch(`/api/${name}`, { method: "GET" });
//const data = await response.json();
//window.location.href = data.url;
//console.log("data:", data);
</script> -->
