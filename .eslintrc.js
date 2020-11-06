module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'indent': ['off', 4],//缩进
        'eol-last': 0,
        "space-before-function-paren": 0,//函数名和括号之间的空格
        'space-in-parens': 0,
        'func-call-spacing': 0,
        "no-tabs":"off",
        "prefer-promise-reject-errors": 0,
        "camelcase": 0,//强制驼峰法命名
        'semi': ["error", "always"],
        "no-async-promise-executor": 0,
        "no-misleading-character-class": 0,
        "no-useless-catch": 0,
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
