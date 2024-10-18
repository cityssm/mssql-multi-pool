import eslintConfigCityssm, { tseslint } from 'eslint-config-cityssm';
const config = tseslint.config(...eslintConfigCityssm, {
    rules: {
        '@cspell/spellchecker': [
            'warn',
            {
                cspell: {
                    words: ['cityssm', 'msnodesqlv8', 'nvarchar', 'recordset', 'tseslint']
                }
            }
        ]
    }
});
export default config;
