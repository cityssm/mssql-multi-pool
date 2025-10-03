import eslintConfigCityssm, { cspellWords, defineConfig } from 'eslint-config-cityssm';
const config = defineConfig(eslintConfigCityssm, {
    files: ['**/*.ts'],
    rules: {
        '@cspell/spellchecker': [
            'warn',
            {
                cspell: {
                    words: [...cspellWords, 'msnodesqlv8', 'nvarchar', 'recordset']
                }
            }
        ]
    }
});
export default config;
