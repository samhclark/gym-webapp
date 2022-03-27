<script lang="ts">
	import { enhance } from '$lib/form';
	import { db, type Exercise, type Session } from '$lib/db';

	const sessions: Array<Session> = [];

	let activityName: string = '';
	let completedExercises: Array<Exercise> = [];
	let notes: string = '';

	async function handleClick() {
		try {
			const uuid = self.crypto.randomUUID();
			const now = new Date().toISOString();

			const id = await db.sessions.add({
				id: uuid,
				timestamp: now,
				exercises: completedExercises,
				session_notes: notes
			});

			status = `Friend ${name} successfully added. Got id ${uuid}`;

			// Reset form here
		} catch (error) {
			status = `Failed to add ${name}: ${error}`;
		}
	}
</script>

<svelte:head>
	<title>Sessions</title>
</svelte:head>

<div>
	<h1>Previous Sessions</h1>
	{#each sessions as session (session.id)}
	<p>hello {session.timestamp}</p>
	{/each}

	<input bind:value={activityName} placeholder="enter activity name" />
	<input type="submit" on:click={handleClick} value="submit" />
</div>
