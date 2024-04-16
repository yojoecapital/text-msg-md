import { writable, get, type Subscriber, type Invalidator, type Unsubscriber } from 'svelte/store';

function createStore() {
    let value: boolean;
    try {
        value = JSON.parse(localStorage.getItem("theme") ?? "false") ? true : false;
    } catch {
        value = false;
    }
    const { subscribe, set } = writable(value);

    function toggle() {
        const value = !get({ subscribe });
        localStorage.setItem("theme", JSON.stringify(value));
        set(value);
    }

    return { subscribe, toggle };
}

export type ThemeStore = {
    subscribe: (this: void, run: Subscriber<boolean>, invalidate?: Invalidator<boolean> | undefined) => Unsubscriber;
    toggle: () => void;
};

let themeStore: ThemeStore | undefined = undefined;

export function getThemeStore() {
    if (!themeStore) themeStore = createStore();
    return themeStore;
}