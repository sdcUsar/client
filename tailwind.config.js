/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes:{
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
    
            },
            animation: {
                'slideIn':'slideIn 1.2s ease-in-out infinite',
            }
        },
    },
    plugins: [],
};
