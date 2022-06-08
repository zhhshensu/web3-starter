const MyToken = artifacts.require('MyToken')

const { toWei } = require('./helper')

contract('MyToken test', async (accounts) => {
  const name = 'TutorialToken'
  const symbol = 'TT'
  const decimals = 18
  const INITIAL_SUPPLY = 100 * 10 ** decimals // 100 ^ 18  
  const totalSupply = toWei(100).toString() // 100 eth
  let token
  let deployer = accounts[0]
  let receiver = accounts[1]
  beforeEach(async () => {
    token = await MyToken.new()
  })
  describe('development', () => {
    it('track the name', async () => {
      const result = await token.name()
      assert.equal(result, name)
    })
    it('track the symbol', async () => {
      const result = await token.symbol()
      assert.equal(result, symbol)
    })
    it('track the decimals', async () => {
      const result = await token.decimals()
      assert.equal(result, decimals)
    })
    it('track the initial supply', async () => {
      const result = await token.INITIAL_SUPPLY()
      assert.equal(result, INITIAL_SUPPLY)
    })
    it('track the total supply', async () => {
      const result = await token.totalSupply()
      assert.equal(result, totalSupply)
    })

    it('assigns the total supply to the deployer', async () => {
      const result = await token.balanceOf(accounts[0])
      assert.equal(result, totalSupply)
    })
  })
  describe('sending tokens', async () => {
    let emitTransferResult
    it('tranfer token balances', async () => {
      let balance
      balance = await token.balanceOf(deployer)
      console.log('deployer before balance', balance.toString())
      balance = await token.balanceOf(receiver)
      console.log('receiver before balance', balance.toString())
      // trandfer
      emitTransferResult = await token.transferToken(
        receiver,
        toWei(20)
      )
      // after transfer
      balance = await token.balanceOf(deployer)
      console.log('deployer after balance', balance.toString())
      balance = await token.balanceOf(receiver)
      console.log('receiver after balance', balance.toString())
    })
    it('emits a transfer event', async () => {
      console.log(emitTransferResult)
    })
  })
  describe('test accouts', async () => {
    it('should put 10000 MetaCoin in the first account', async () => {
      await MyToken.deployed()
      const balance = await web3.eth.getBalance(accounts[0])
      console.log('balance', balance.toString())
      // assert.equal(balance.valueOf(), 10000)
    })
  })
})

// const MetaCoin = artifacts.require("MetaCoin");

// contract("2nd MetaCoin test", async accounts => {
//   it("should put 10000 MetaCoin in the first account", async () => {
//     const instance = await MetaCoin.deployed();
//     const balance = await instance.getBalance.call(accounts[0]);
//     assert.equal(balance.valueOf(), 10000);
//   });

//   it("should call a function that depends on a linked library", async () => {
//     const meta = await MetaCoin.deployed();
//     const outCoinBalance = await meta.getBalance.call(accounts[0]);
//     const metaCoinBalance = outCoinBalance.toNumber();
//     const outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
//     const metaCoinEthBalance = outCoinBalanceEth.toNumber();
//     assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);
//   });

//   it("should send coin correctly", async () => {
//     // Get initial balances of first and second account.
//     const account_one = accounts[0];
//     const account_two = accounts[1];

//     const amount = 10;

//     const instance = await MetaCoin.deployed();
//     const meta = instance;

//     const balance = await meta.getBalance.call(account_one);
//     const account_one_starting_balance = balance.toNumber();

//     balance = await meta.getBalance.call(account_two);
//     const account_two_starting_balance = balance.toNumber();
//     await meta.sendCoin(account_two, amount, { from: account_one });

//     balance = await meta.getBalance.call(account_one);
//     const account_one_ending_balance = balance.toNumber();

//     balance = await meta.getBalance.call(account_two);
//     const account_two_ending_balance = balance.toNumber();

//     assert.equal(
//       account_one_ending_balance,
//       account_one_starting_balance - amount,
//       "Amount wasn't correctly taken from the sender"
//     );
//     assert.equal(
//       account_two_ending_balance,
//       account_two_starting_balance + amount,
//       "Amount wasn't correctly sent to the receiver"
//     );
//   });
// });
