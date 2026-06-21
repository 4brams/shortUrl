<template>
	<div id="bg">
		<h1>Welcome, {{ account }}!</h1>
		<button @click="logout" id="logout">Logout</button>
		<div id="search-container">
			<input type="text" v-model="search" />
			<button @click="searchEngin">Search</button>
		</div>
		<div class="urls" id="title">
			<p class="time">ID</p>
			<p class="name">Name</p>
			<p class="url">Url</p>
			<p class="delete">Delete</p>
		</div>
		<div v-for="url in urlss" id="url-container">
			<div class="urls">
				<p class="time">{{ url.id }}</p>
				<p class="name">{{ url.name }}</p>
				<p class="url">{{ url.url }}</p>
				<p class="delete realdetele" @click="deleteUrl(url.id)">Delete</p>
			</div>
		</div>
	</div>
	<div id="ver" v-if="showVerify">
		<h1>Verifing...</h1>
	</div>
</template>

<script setup>
const showVerify = ref(true);
const account = ref("");
const urls = ref([]);
const urlss = ref([]);
const search = ref("");

const searchEngin = () => {
	let tempurls = [];

	if (search.value != "") {
		for (let i = 0; i < urls.value.length; i++) {
			console.log(urls.value[i]);
			if (urls.value[i].name.toLowerCase().includes(search.value.toLowerCase())) {
				tempurls.push(urls.value[i]);
			}
		}
		urlss.value = tempurls;
	} else {
		urlss.value = urls.value;
	}
};

const getAll = async () => {
	const token = localStorage.getItem("token");

	if (token != null) {
		const res = await fetch("api/admin/auth/verify", {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status == 200) {
			const data = await res.json();
			account.value = data.account;
			showVerify.value = false;
			const res2 = await fetch("api/admin/all", {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res2.status == 200) {
				let data = await res2.json();
				console.log(data);
				urls.value = data.data;
				searchEngin();
			} else {
				localStorage.removeItem("token");
				window.location.href = "/admin/login";
			}
		} else {
			localStorage.removeItem("token");
			window.location.href = "/admin/login";
		}
	} else {
		window.location.href = "/admin/login";
	}
};

const deleteUrl = async (id) => {
	const token = localStorage.getItem("token");

	const res = await fetch(`/api/admin/delete`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
		body: JSON.stringify({
			id: id,
		}),
	});

	if (res.status == 200) {
		await getAll();
	} else {
		localStorage.removeItem("token");
		window.location.href = "/admin/login";
	}
};

const logout = () => {
	localStorage.removeItem("token");
	window.location.href = "/";
};

onMounted(async () => {
	await getAll();
});
</script>

<style scoped>
#bg {
	width: 90vw;
	height: auto;
	min-height: 90vh;
	padding-top: 5vh;
	padding-bottom: 5vh;
	padding-left: 5vw;
	padding-right: 5vw;
	background-color: var(--sblack);
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	gap: 5px;
}
#bg h1 {
	font-size: 2.5rem;
	color: var(--swhite);
	margin-bottom: 40px;
	margin-top: 40px;
}
#logout {
	width: 10vw;
	height: 2rem;
	position: absolute;
	top: 0;
	right: 0;
	background-color: var(--sgold);
	color: var(--swhite);
	cursor: pointer;
}
#search-container {
	width: 50vw;
	height: 2rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-bottom: 40px;
}
#search-container input {
	height: 100%;
	width: 80%;
}
#search-container button {
	height: 100%;
	width: 20%;
	background-color: var(--sgold);
	color: var(--swhite);
	cursor: pointer;
}
#url-container {
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 5px;
}
.urls {
	width: calc(100% - 1rem);
	height: 1rem;
	padding: 0.5rem;
	color: var(--sblack);
	background-color: var(--swhite);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}
.time {
	width: 10%;
}
.name {
	width: 15%;
}
.url {
	width: 65%;
}
.delete {
	background-color: var(--sgold);
	color: var(--sblack);
	height: 100%;
	width: 5%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.realdetele {
	background-color: red;
	color: var(--swhite);
	height: 100%;
	width: 5%;
	cursor: pointer;
	font-size: 0.7rem;
	display: flex;
	align-items: center;
	justify-content: center;
}
#title {
	background-color: var(--sgold);
}
#title .time,
#title .name,
#title .url,
#title .delete {
	color: var(--swhite);
	font-weight: bold;
}
#ver {
	width: 100vw;
	height: 100vh;
	background-color: var(--sblack);
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
}
#ver h1 {
	color: var(--swhite);
	font-size: 4rem;
}
</style>
