import MetamaskConnectButton from './MetamaskConnectButton'
import Balance from './Balance'

function Header() {
  return (
    <div className='w-full flex justify-between p-4 items-center'>
      <Balance />
      <MetamaskConnectButton />
    </div>
  )
}

export default Header
