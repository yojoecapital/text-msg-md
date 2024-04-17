<script lang="ts">
    import "../app.css";
    import { getThemeStore, type ThemeStore } from "$lib/stores/theme";
    import { onMount } from "svelte";
    import type { Message, Person } from "$lib/definitions";
    import Wifi from "$lib/components/svg/Wifi.svelte";
    import Battery from "$lib/components/svg/Battery.svelte";
    import { base } from "$app/paths";
    import { getDisplayTime, getMessageType, getNewMessage, setMessageType, setSrc, to12 } from "$lib/helpers";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import Download from "$lib/components/Download.svelte";
    import Upload from "$lib/components/Upload.svelte";
    
    let position = 0;
    let time = getDisplayTime(), displayTime = time;
    let src: string, name: string, avatars = true;
    let persons :Person[] = [{
        name: ""
    }];
    let convo: (Message | string)[] = [];
    let theme: ThemeStore;
    let displayElement: HTMLElement;
    async function scrollToBottom(element?: HTMLElement) {
        await new Promise(resolve => setTimeout(resolve, 10));
        if (!element) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        else element?.scroll({ top: element.scrollHeight, behavior: "smooth" });
    }
    function updateDisplayTime() {
        if (position > 0 && position <= convo.length) {
            const message = convo[position - 1];
            if (typeof message !== "string") displayTime = message.time;

        } else displayTime = time;
    }
    $: position, updateDisplayTime();
    function first() {
        position = 0;
    } 
    function previous() {
        position = Math.max(position - 1, 0);
    } 
    function next() {
        if (position < convo.length) {
            position = Math.min(position + 1, convo.length);
            const message = convo[position - 1];
            if (typeof message === "object") {
                if (message.sender === 0) {
                    new Audio(`${base}/send-sfx.mp3`).play();
                }
                else new Audio(`${base}/received-sfx.mp3`).play();
            }
        }
        scrollToBottom(displayElement);
    }
    function last() {
        position = convo.length;
        scrollToBottom(displayElement);
    }
    function get(text: string) {
        const data = JSON.parse(text);
        name = data.chat.name,
        time = data.chat.time,
        src = data.chat.src,
        avatars = data.chat.avatars,
        convo = data.convo;
        persons = data.persons;
        position = convo.length;
    }
    onMount(() => {
        theme = getThemeStore();
        displayElement = document.getElementById("display")!;
        document.addEventListener("keydown", (event) => {
        const target = event.target as HTMLElement; 
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (event.shiftKey) {
            if (event.key === "ArrowLeft") previous();
            else if (event.key === "ArrowRight") next();
        } 
        });
    });
</script>

<div data-theme={$theme ? "dark" : "light"}>
    <div id="display" class="h-screen flex flex-col overflow-y-scroll">
        <div class="flex-none justify-between w-full flex p-2 sticky top-0 z-10 {$theme ? "glass" : "bg-base-300"}">
            <Wifi/>
            <div class="grid gap-1 text-sm">
                <span class="text-center">{to12(displayTime)}</span>
                <div class="avatar flex justify-center">
                    <div class="w-12 rounded-full">
                        <img alt="Message Profile" src={src ?? `${base}/icon.png`} />
                    </div>
                </div>
                <span class="text-center">{name ?? ""}</span>
            </div>
            <Battery/>
        </div>
        <div class="flex-1 p-2 md:px-20">
            {#each convo.slice(undefined, position) as message, index (index)}
                <div id="message-{index + 1}" in:fade={{ duration: 200}} animate:flip={{ duration: 200 }}>
                    {#if typeof message === "string"}
                        <div class="text-center my-2">{message}</div>
                    {:else}
                        <div class="chat {message.sender === 0 ? "chat-end" : "chat-start"}">
                            <div class="chat-image avatar">
                                <div class="{avatars ? "w-10" : "w-0"} rounded-full">
                                    <img alt="Profile" src={persons[message.sender]?.src ?? `${base}/icon.png`} />
                                </div>
                            </div>
                            {#if message.header}
                                <div class="chat-header">
                                    {#if message.sender === -1}
                                        <i>Unknown</i>
                                    {:else}
                                        {persons[message.sender]?.name ? persons[message.sender].name : ""}
                                    {/if}
                                    <time class="text-xs opacity-50">{to12(message.time)}</time>
                                </div>
                            {/if}
                            {#if message.src}
                                <a href="{base}/#edit-message-{index + 1}" class="relative block size-fit max-w-60">
                                    <img alt="Message Content" src={message.src} class="rounded-lg"/>
                                </a>
                            {:else if message.text}
                                <a href="{base}/#edit-message-{index + 1}" class="chat-bubble {persons[message.sender]?.class ?? ""}">{message.text}</a>
                            {:else}
                                <a href="{base}/#edit-message-{index + 1}" class="chat-bubble {persons[message.sender]?.class ?? ""}">...</a>
                            {/if}
                        </div>
                    {/if}
                    </div>
            {/each}
            <div class="w-full h-[10vh]"/>
        </div>
    </div>
    <div class="bg-base-300">
        <div class="w-fit m-auto p-4 text-center gap-4 flex flex-col justify-center">
            <h2 class="text-xl mt-4">Display 🎞️</h2>
            <hr class="border-base-content"/>
            <div class="grid grid-cols-5 gap-2">
                <button type="button" class="btn btn-neutral" on:click={first}>⏮️</button>
                <button type="button" class="btn btn-neutral" on:click={previous}>◀️</button>
                <button type="button" class="btn btn-neutral" value="dark" on:click={theme.toggle}>{$theme ? "🌚" : "🌞"}</button>
                <button type="button" class="btn btn-neutral" on:click={next}>▶️</button>
                <button type="button" class="btn btn-neutral" on:click={last}>⏭️</button>
            </div>
            <div>Use <kbd class="kbd">shift</kbd> + <kbd class="kbd">→</kbd> to trigger next message.</div>
            <div>Use <kbd class="kbd">shift</kbd> + <kbd class="kbd">←</kbd> to trigger previous message.</div>
            <h2 class="text-xl mt-4">Chat 📱</h2>
            <hr class="border-base-content"/>
            <input type="time" placeholder="Display time" class="input w-full" bind:value={time}/>
            <input type="text" placeholder="Chat name" class="input w-full" bind:value={name}/>
            <input type="file" accept="image/*" class="file-input w-full" on:change={(event) => {
                const files = event.currentTarget.files;
                if (files) setSrc(files, (src_) => src = src_);
            }}/>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Show avatars</span> 
                    <input type="checkbox" bind:checked={avatars} class="checkbox" />
                </label>
            </div>
            <h2 class="text-xl mt-4">Persons 🧑</h2>
            <hr class="border-base-content"/>
            {#each persons as person}
                <input type="text" placeholder="Name" class="input w-full" bind:value={person.name}/>
                <select class="select w-full" bind:value={person.class}>
                    <option value="">Neutral</option>
                    <option class="text-base-content" value="bg-base-300 text-inherit">Base</option>
                    <option class="text-primary" value="chat-bubble-primary">Primary</option>
                    <option class="text-secondary" value="chat-bubble-secondary">Secondary</option>
                    <option class="text-accent" value="chat-bubble-accent">Accent</option>
                    <option class="text-info" value="chat-bubble-info">Info</option>
                    <option class="text-success" value="chat-bubble-success">Success</option>
                    <option class="text-warning" value="chat-bubble-warning">Warning</option>
                    <option class="text-error" value="chat-bubble-error">Error</option>
                </select>
                <input type="file" accept="image/*" class="file-input w-full" on:change={(event) => {
                    const files = event.currentTarget.files;
                    if (files) setSrc(files, (src) => person.src = src);
                }}/>
                <hr>
            {/each}
            <div class="grid grid-cols-2 gap-2">
                <button class="btn btn-primary btn-sm" on:click={() => {
                    persons.push({ name: "" });
                    persons = persons;
                }}>Add</button>
                <button class="btn btn-warning btn-sm" disabled={persons.length <= 1} on:click={() => {
                    persons.pop();
                    convo = convo.map(message => {
                        if (typeof message !== "string" && message.sender >= persons.length) message.sender = -1;
                        return message;
                    });
                    persons = persons;
                }}>Remove</button>
            </div>
            <h2 class="text-xl mt-4">Messages 🐦</h2>
            <hr class="border-base-content"/>
            {#each convo as message, index}
                <a id="edit-message-{index + 1}" class="link" href="{base}/#message-{index + 1}">Message {index + 1}</a>
                <div class="grid grid-cols-3 gap-2">
                    <button class="btn {getMessageType(message) === "text" ? "btn-primary" : "btn-neutral"}" type="button" on:click={() => message = setMessageType(message, "text")}>
                        Text
                    </button>
                    <button class="btn {getMessageType(message) === "image" ? "btn-primary" : "btn-neutral"}" type="button" on:click={() => message = setMessageType(message, "image")}>
                        Image
                    </button>
                    <button class="btn {getMessageType(message) === "label" ? "btn-primary" : "btn-neutral"}" type="button" on:click={() => message = setMessageType(message, "label")}>
                        Label
                    </button>
                </div>
                {#if typeof message === "string"}
                    <input type="text" placeholder="Label" class="input w-full" bind:value={message}/>
                {:else}
                    <select class="select w-full" bind:value={message.sender}>
                        {#each persons as person, index}    
                            <option value={index}>{person.name ? person.name : "Unnamed"}</option>
                        {/each}
                        <option class="text-error" value={-1}>Unknown</option>
                    </select>
                    <input type="time" class="input w-full" bind:value={message.time}/>
                    {#if message.src}
                        <input type="file" accept="image/*" class="file-input w-full" on:change={(event) => {
                            const files = event.currentTarget.files;
                            if (files) setSrc(files, (src) => {
                                if (typeof message !== "string") message.src = src;
                            });
                        }}/>
                    {:else}
                        <input type="text" placeholder="Text" class="input w-full" bind:value={message.text}/>
                    {/if}
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Show header</span> 
                            <input type="checkbox" bind:checked={message.header} class="checkbox" />
                        </label>
                    </div>
                {/if}
                <hr class="border-base-content"/>
            {/each}
            <div class="grid grid-cols-2 gap-2">
                <button class="btn btn-primary btn-sm" on:click={() => {
                    convo.push(getNewMessage(convo));
                    position = convo.length;
                    convo = convo;
                    scrollToBottom(displayElement);
                    scrollToBottom();
                }}>Add</button>
                <button class="btn btn-warning btn-sm" disabled={convo.length === 0} on:click={() => {
                    convo.pop();
                    convo = convo;
                    scrollToBottom(displayElement);
                    scrollToBottom();
                }}>Remove</button>
            </div>
            <h2 class="text-xl mt-4">File 📁</h2>
            <hr class="border-base-content"/>
            <div class="grid grid-cols-2 gap-2">
                <Download class="btn btn-secondary btn-sm" data={({ 
                    chat: {
                        name,
                        time,
                        src,
                        avatars
                    },
                    persons, 
                    convo
                })}>Download</Download>
                <Upload class="btn btn-accent btn-sm" {get}>Upload</Upload>
            </div>
        </div>
    </div>
</div>