<script lang="ts">
    // props
    export let get: (text: string) => void = () => {}; 

    function handle(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];    
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    get(e.target?.result as string);
                } catch {
                    alert("Cound not read file!")
                }
            };
            reader.readAsText(file);
        }
    }
</script>

<label class={$$props.class ?? ""}>
    <slot/>
    <input class="hidden" type="file" accept=".json" on:change={handle} />
</label>