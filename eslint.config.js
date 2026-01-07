import eslintConfigCityssm, { defineConfig } from 'eslint-config-cityssm/eslint.packageConfig.js';
import { cspellWords } from 'eslint-config-cityssm/exports.js';
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
