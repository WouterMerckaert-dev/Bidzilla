import * as passwordUtils from './passwordUtils'
import * as sessionCookieUtils from './sessionCookieUtils'

export * from './passwordUtils'
export * from './sessionCookieUtils'

const Utils = {
  ...passwordUtils,
  ...sessionCookieUtils,
}

export default Utils
