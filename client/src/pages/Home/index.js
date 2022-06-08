import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import { colors } from '../../theme'

const Home = () => {
  const { active } = useWeb3React()
  // const { rentalsAddress } = useRentals();

  const NotActive = () => {
    return (
      <span>
        Connect{' '}
        {
          <span>
            <a
              style={{ color: colors.green }}
              href='https://faucet.ropsten.be/'
              target='blank'
            >
              Ropsten
            </a>
          </span>
        }{' '}
        wallet to continue.
      </span>
    )
  }

  return <>{!active && <NotActive />}</>
}

export default Home
