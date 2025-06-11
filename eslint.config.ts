import eslintConfigCityssm, {
  type Config,
  cspellWords,
  tseslint
} from 'eslint-config-cityssm'

const config = tseslint.config(...eslintConfigCityssm, {
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
}) as Config

export default config
