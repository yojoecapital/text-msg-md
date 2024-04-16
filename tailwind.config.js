/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["[data-theme=winter]"],
                }
            },
            {
                dark: {
                    ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
                    "primary": "#9FE88D",
                    "primary-content": "#091307",
                    "secondary": "#FF7D5C",
                    "secondary-content": "#160503",
                    "accent": "#C792E9",
                    "accent-content": "#0e0813",
                    "neutral": "#1C212B",
                    "neutral-content": "#b2ccd6",
                    "base-100": "#2A303C",
                    "base-200": "#242933",
                    "base-300": "#20252E",
                    "base-content": "#b2ccd6",
                    "info": "#28ebff",
                    "info-content": "#011316",
                    "success": "#62efbd",
                    "success-content": "#03140d",
                    "warning": "#efd057",
                    "warning-content": "#141003",
                    "error": "#ffae9b",
                    "error-content": "#160b09",
                },
            }
        ],
    },
}

