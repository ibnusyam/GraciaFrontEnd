export default {
  plugins: {
    "@tailwindcss/vite": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "custom-properties": true, // Mengubah --variable menjadi nilai warna asli
      },
    },
    autoprefixer: {},
  },
};
