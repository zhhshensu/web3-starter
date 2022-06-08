import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import useEth from '../hooks/useEth'

function Balance() {
  const { account } = useWeb3React()
  const { ethBalance, fetchEthBalance } = useEth()
  useEffect(() => {
    if (account) {
      fetchEthBalance()
    }
  }, [account])
  return (
    <div className='border border-lime-400 rounded-sm py-2 px-2 text-white'>
      ETH Balance: {ethBalance}
    </div>
  )
}

export default Balance
