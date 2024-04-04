<script>
    import { goto } from '$app/navigation';
    import { Button, Spinner } from 'flowbite-svelte'
	import { onMount } from 'svelte';
  
    const redirectToPage = () => {
      goto('/display');
    };

    onMount(() => {goto('/display')})
    //redirectToPage();
</script>

<div class="container">
    <Button outline color="dark">
        <Spinner class="me-3" size="4" />
        Importing Time Data from Flightlogger ...
      </Button>
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        margin-left: auto;
        margin-right: auto;
        justify-content: center;
        align-items:center;
    }
</style>