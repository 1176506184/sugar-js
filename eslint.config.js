const tsPlugin = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        ignores: [
            '**/*.css',
            '**/*.css.map',
            '**/*.scss',
            '**/*.json',
            '**/*.md',
            '**/*.html',
            'compiler.plugin.ts',
            '*.config.*',
            'global.d.ts',
            'dist',
            'node_modules',
            '**/*.js', // 全局忽略 JS 文件
        ],
        files: ['packages/**/*.ts', 'packages/**/*.tsx'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            /*** 基础 JS 风格 ***/
            semi: ['error', 'always'],                     // 必须分号
            quotes: ['error', 'single', {avoidEscape: true}], // 单引号
            indent: ['error', 2],                          // 2 空格缩进
            eqeqeq: ['warn', 'always'],                    // 使用 ===/!==
            'no-new-func': 'warn',                         // 禁止 new Function
            'no-useless-escape': 'warn',                  // 避免无用转义
            'no-empty': 'warn',                            // 禁止空代码块
            'no-eval': 'warn',                             // 禁止 eval

            /*** TypeScript 插件规则 ***/
            '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/no-implied-eval': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'variableLike',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                },
            ],
            '@typescript-eslint/no-for-in-array': 'error',
            /*** Prettier 规则 ***/
            'prettier/prettier': [
                'error',
                {
                    semi: true,
                    singleQuote: true,
                    trailingComma: 'all',
                    printWidth: 100,
                    tabWidth: 2,
                },
            ],

            /*** 代码质量/安全 ***/
            'no-console': 'off',                           // 开发允许 console
            'no-debugger': 'warn',                         // 调试时警告
        },

    }
];
