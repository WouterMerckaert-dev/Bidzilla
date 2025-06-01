import 'server-only'
import {pbkdf2Sync, randomBytes} from 'crypto'

// Deze opties zijn willekeurig gekozen, in een productieomgeving moet de iteraties variabele worden afgestemd op basis
// van de hardware capaciteiten.
// Hoe hoger het aantal iteraties, hoe veiliger de hash en hoe langer het duurt om de hash te berekenen.
// The aantal iteraties moet zo hoog mogelijk zijn, maar de hash moet nog steeds snel genoeg berekend worden zodat de
// gebruiker niet te lang moet wachten om in te loggen.
// Naarmate de CPU kracht toeneemt, neemt ook het aantal iteraties toe, dit zorgt ervoor dat het algoritme beter bestand
// blijft tegen brute-force aanvallen.
const options = {
  // De lengte van de uiteindelijke hash in bytes.
  keyLength: 64,
  // Het aantal iteraties, i.e. het aantal hashes dat wordt berekend.
  iterations: 600000,
}

/**
 * Hash een gegeven plain-text wachtwoord zodat het veilig in de database kan worden opgeslagen.
 *
 * @param password Het wachtwoord dat gehasht moet worden.
 */
export function hashPassword(password: string): string {
  const salt = getSalt()
  const hash = pbkdf2Sync(password, salt, options.iterations, options.keyLength, 'sha512').toString('hex')
  return `${options.iterations}$${options.keyLength}$${hash}$${salt}`
}

/**
 * Controleer of een hash in de database overeenkomt met een gegeven wachtwoord.
 *
 * @param dbHash De hash uit de database, inclusief de salt en gebruikte parameters voor pbkdf2.
 * @param password Het wachtwoord dat de gebruiker ingegeven heeft.
 */
export function verifyPassword(dbHash: string, password: string): boolean {
  const [iterations, hashLength, hash, salt] = dbHash.split('$')
  const passwordHash = pbkdf2Sync(password, salt, Number(iterations), Number(hashLength), 'sha512').toString('hex')
  return passwordHash === hash
}

/**
 * Genereer een willekeurige salt.
 */
function getSalt(): string {
  // Salt is een string die toegevoegd wordt aan elk wachtwoord zodat de hash moeilijker te kraken is.
  // Salt is uniek voor elk wachtwoord, dit betekent dat het onmogelijk wordt om een rainbow table te genereren, i.e.
  // een lijst van wachtwoorden en hun respectievelijke hashes.
  return randomBytes(32).toString('hex')
}
