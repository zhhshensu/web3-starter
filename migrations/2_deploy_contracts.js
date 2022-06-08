const MyToken = artifacts.require('MyToken')
const Exchange = artifacts.require('Exchange')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MyToken)
  const feeAccount = accounts[0]
  const feePercent = 10
  await deployer.deploy(Exchange, feeAccount, feePercent)
}
