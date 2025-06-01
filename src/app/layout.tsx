import './globals.css'
import Navbar from '../components/custom/Navbar'
import {Metadata} from 'next'
import {FunctionComponent, PropsWithChildren} from 'react'

export const metadata: Metadata = {
  description: 'Bied op unieke items in onze online veilingen',
  title: 'Bidzilla',
}

const RootLayout: FunctionComponent<PropsWithChildren> = ({children}) => {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        <main className="bg-white m-10">{children}</main>
      </body>
    </html>
  )
}
export default RootLayout
