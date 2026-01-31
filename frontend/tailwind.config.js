/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#eab308", // Yellow-500
                secondary: "#1f2937", // Gray-800
            }
        },
    },
    plugins: [],
}
