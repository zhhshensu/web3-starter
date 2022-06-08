import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
// import Details from './pages/Details';
// import Rented from './pages/Rented';
import Header from './components/Header'
import { AppContextProvider } from './AppContext'
import './App.css'

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider)
}

const App = () => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (data) => {
      console.log('data', data)
      window.location.reload()
    })
  }

  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div className="w-full min-h-screen bg-black flex flex-col">
          <Header />
          <div>
            <Routes>
              <Route exact path='/' element={<Home />} />
              {/* <Route exact path='/details' component={Details} /> */}
              {/* <Route exact path='/rented' component={Rented} /> */}
            </Routes>
          </div>
        </div>
      </Web3ReactProvider>
    </AppContextProvider>
  )
}

export default App
