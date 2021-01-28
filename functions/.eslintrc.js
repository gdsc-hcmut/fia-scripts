module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    rules: {
        "quotes": ["error", "double"],
        "indent": "off",
        "object-curly-spacing": "off",
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
};
