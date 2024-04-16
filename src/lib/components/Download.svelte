<script lang="ts">
    // props
    export let data: any;

    function downloadJson(data: any, filename = 'data.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<button type="button" class={$$props.class ?? ""} on:click={() => downloadJson(data)}><slot/></button>