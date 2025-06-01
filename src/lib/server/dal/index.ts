import * as users from './users'
import * as auctions from './auctions'
import * as bids from './bids'
import * as categories from './categories'
import * as reviews from './reviews'
import * as winners from './winners'

/**
 * Om het aantal import statements te beperken en de code overzichtelijk te houden, groeperen we alle dal functies in
 * dit bestand.
 * We exporteren alle named exports opnieuw zodat we iets als `import {signInOrRegister} from '@dal'`
 * kunnen gebruiken.
 * Let op, hiervoor moet de '@dal' alias wel correct geconfigureerd zijn in tsconfig.json.
 */
export * from './users'
export * from './auctions'
export * from './bids'
export * from './categories'
export * from './reviews'
export * from './winners'

/**
 * We voorzien hier een default export met alle actions in de volledige applicatie.
 * Aangezien we op verschillende plaatsen in de applicatie gebruik maken van functies met dezelfde naam, is het handig
 * als we die functies niet altijd moeten importen met naam, maar wel als een object dat alle functies in één laag
 * groepeert.
 */
const DAL = {
  ...users,
  ...auctions,
  ...bids,
  ...categories,
  ...reviews,
  ...winners,
}

export default DAL
