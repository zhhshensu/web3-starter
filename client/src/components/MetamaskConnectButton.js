import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { injected } from '../connectors'
import { useAppContext } from '../AppContext'

const pageState = {
  LOADING: 'LOADING',
  READY: 'READY',
}

const onLogOut = (deactivate, cb) => {
  deactivate()
  cb()
}

const MetamaskConnectButton = () => {
  const navigate = useNavigate()
  const { setContentError } = useAppContext()
  const { activate, active, account, deactivate } = useWeb3React()
  const [status, setStatus] = useState(pageState.LOADING)

  useEffect(() => {
    const tryActivate = async () => {
      await activate(injected, () => {
        setStatus(pageState.READY)
      })
      setStatus(pageState.READY)
    }
    tryActivate()
  }, [activate])

  if (status === pageState.LOADING) {
    return <span>Loading...</span>
  }

  if (status === pageState.READY && !active) {
    return (
      <button
        className='border border-red-400 rounded-sm text-white px-2 ml-2'
        onClick={() => {
          if (!window.ethereum) {
            setContentError(
              "Looks like you don't have Metamask, you'll need it to use this app."
            )
            return
          }
          activate(injected, (e) => {
            if (e instanceof UnsupportedChainIdError) {
              setContentError('Only Ropsten supported.')
            }
          })
        }}
      >
        Connect wallet
      </button>
    )
  }

  return (
    <div className='border border-lime-400 rounded-sm py-2 px-2 text-white flex justify-between'>
      <span>
        {account &&
          account.substring(0, 4) +
            `....` +
            account.substring(account.length - 4, account.length)}
      </span>
      <button
        className='border border-red-400 rounded-sm text-white px-2 ml-2'
        onClick={() => onLogOut(deactivate, () => navigate('/'))}
      >
        Log Out
      </button>
    </div>
  )
}

export default MetamaskConnectButton
