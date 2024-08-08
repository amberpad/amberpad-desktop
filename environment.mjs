const PREFIX = 'AMBERPAD_';

/******************************************************************************
* Utils
******************************************************************************/

export const validate = (environment, configs) => {
  const processed = buildProcessedValues(environment, configs)

  const notValidated = Object.entries(processed).filter(([name, value]) => !value.isValid)
  if (notValidated.length > 0) {
    console.warn(`Found environment variables with no valid format: ${notValidated}`)
  }

  return Object.fromEntries(
    Object.entries(processed).map(([name, values]) => [name, values.value]))
}

export function setConfigsDefaults (configs) {
  return Object.fromEntries(Object.entries(configs).map(([name, options]) => {
    return [name, Object.assign({
      default: '',
      parser: (value) => value,
      verifier: /.*/gi
    }, options)]
  }))
}

export function buildProcessedValues (envs, configs) {
  return Object.fromEntries(Object.entries(configs).map(([name, options]) => {
    if (envs[name] === undefined) {
      return [name, { 
        value: options['default'], 
        isValid: true, 
        parsed: options['default'] 
      }]
    } else {
      return [name, { 
        value: envs[name], 
        isValid: RegExp(options['verifier']).test(envs[name]), 
        parsed: options['parser'](envs[name])
      }]
    }
  }))
}

function filteredEnviromentByPrefix (environment, prefix=PREFIX) {
  return Object.fromEntries( 
    Object.entries(environment)
      .filter(([key, value]) => key.startsWith(prefix))
      .map(([key, value]) => [key.replace(prefix, ''), value])
  )
} 

/******************************************************************************
* Environments
******************************************************************************/

/*
  default: any = '',
  parser: (value: any = '') => any,
  verifier: regex
*/
var configs = {
  ENV_PREFIX: { default: PREFIX },
  ENVIRONMENT: { 
    default: 'production', 
    verifier: /^(production|development|testing)$/i,
    parser: (value) => value.toLocaleLowerCase()
  },
  DEBUG: {
    default: false,
    verifier: /^(true|false)$/i,
    parser: (value) => value.toLocaleLowerCase() === 'true'

  },
  RESET_SETTINGS_STORE: {
    default: false,
    verifier: /^(true|false)$/i,
    parser: (value) => value.toLocaleLowerCase() === 'true'
  },
  PAGINATION_OFFSET: {
    default: 20,
    verifier: /^[1-9]+$/,
    parser: (value) => parseInt(value),
  },
  ASSOCIATED_PAGES_PAGINATION_OFFSET: {
    default: 20,
    verifier: /^[1-9]+$/,
    parser: (value) => parseInt(value),
  },
  ALLOW_VERSION_UPDATE: {
    // "darwin | linux | win32" one of any of this separated by a "|"
    default: ['darwin', 'linux', 'win32'],
    verifier: /^(darwin|linux|win32|\s|\|)+$/i,
    parser: (value) => [...new Set(
      value.toLocaleLowerCase().replace(' ', '').split('|')
    )]
  }
}

// Extends config dictionary with default values
var configs = setConfigsDefaults(configs)
const filteredEnviroments = filteredEnviromentByPrefix(process.env)
const validated = validate(filteredEnviroments, configs)
export default validated