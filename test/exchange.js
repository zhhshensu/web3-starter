const { toWei } = require('./helper')
const Exchange = artifacts.require('Exchange')
const MyToken = artifacts.require('MyToken')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { transformAsserterArgs } = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('Exchange', function (accounts) {
  console.log('accounts', accounts)
  let token
  let exchange
  let deployer = accounts[0]
  let feeAccount = accounts[2]
  let user1 = accounts[3]
  let feePercent = 10
  beforeEach(async () => {
    token = await MyToken.new()
    // transfer some tokens to user1
    token.tranfersToken(user1, toWei(5))
    exchange = await Exchange.new(feeAccount, feePercent)
  })
  // describe('deployment', () => {
  //   it('track the fee account', async () => {
  //     const result = await exchange.feeAccount()
  //     assert.equal(result, feeAccount)
  //   })
  //   it('track the fee percent', async () => {
  //     const result = await exchange.feePercent()
  //     assert.equal(result, feePercent)
  //   })
  // })
  // describe('deposit tokens', async () => {
  //   let result
  //   let balance
  //   let amount = toWei(5)
  //   beforeEach(async () => {
  //     balance = await token.balanceOf(deployer)
  //     balance = await token.balanceOf(feeAccount)
  //     balance = await token.balanceOf(user1)
  //     // 批准交易
  //     await token.approve(exchange.address, amount, {
  //       from: user1,
  //     })
  //     // 存入币
  //     result = await exchange.depositToken(token.address, amount, {
  //       from: user1,
  //     })
  //   })
  //   describe('success', () => {
  //     it('tracks the token deposit', async () => {
  //       console.log('交易账户', exchange.address)
  //       balance = await token.balanceOf(exchange.address)
  //       assert.equal(balance.toString(), amount)
  //       balance = await token.balanceOf(token.address)
  //       balance = await exchange.tokens(token.address, user1)
  //       assert.equal(balance.toString(), amount)
  //     })
  //     it('emits a Deposit event', async () => {
  //       // result.logs 格式如下
  //       // logs: [
  //       //   {
  //       //     logIndex: 1,
  //       //     transactionIndex: 0,
  //       //     transactionHash: '0x40f80c792ccbe2ad51fc3c485cce4f4f73d30921412f1b45ef8173dd3e27ff10',
  //       //     blockHash: '0xeca4afab23a2142bee571d600fe293d13de19bfd81456393775d7981a4bec772',
  //       //     blockNumber: 836,
  //       //     address: '0xC1a06403F572Eacab1eE1F9040048F9952a4D754',
  //       //     type: 'mined',
  //       //     id: 'log_4fa9a7b3',
  //       //     event: 'Deposit',
  //       //     args: [Result]
  //       //   }
  //       // ]
  //       const log = result.logs[0]
  //       assert.equal(log.event, 'Deposit')
  //       const event = log.args
  //       assert.equal(event.receiver, token.address)
  //       assert.equal(event.sender, user1)
  //       assert.equal(event.amount.toString(), amount)
  //       assert.equal(event.balance.toString(), amount)
  //     })
  //   })
  //   describe('failure', () => {
  //     it('rejects Ether deposits', async () => {})
  //     it('fails when no tokens are approved', async () => {})
  //   })
  // })
  // describe('deposit Ether tokens', async () => {
  //   let result
  //   let amount
  //   let balance
  //   let ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
  //   beforeEach(async () => {
  //     amount = toWei(2)
  //     // 存入币
  //     result = await exchange.depositEther({
  //       from: user1,
  //       value: amount,
  //     })
  //   })
  //   it('tracks the ether deposit', async () => {
  //     balance = await exchange.tokens(ETHER_ADDRESS, user1)
  //     assert.equal(balance.toString(), amount)
  //   })
  // })
  // // 提取以太币
  // describe('----withdrawing Ether----', async () => {
  //   let result
  //   let ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
  //   beforeEach(async () => {
  //     // 先存入一定量的以太币
  //     await exchange.depositEther({
  //       from: user1,
  //       value: toWei(2),
  //     })
  //   })
  //   describe('success', async () => {
  //     beforeEach(async () => {
  //       result = await exchange.withdrawEther(toWei(1), {
  //         from: user1,
  //       })
  //     })
  //     it('withdraws Ether funds', async () => {
  //       balance = await exchange.tokens(ETHER_ADDRESS, user1)
  //       assert.equal(balance.toString(), toWei(1))
  //     })
  //     it('emits a WithDraw event', async () => {
  //       // result.logs 格式如下
  //       // logs: [
  //       //   {
  //       //     logIndex: 1,
  //       //     transactionIndex: 0,
  //       //     transactionHash: '0x40f80c792ccbe2ad51fc3c485cce4f4f73d30921412f1b45ef8173dd3e27ff10',
  //       //     blockHash: '0xeca4afab23a2142bee571d600fe293d13de19bfd81456393775d7981a4bec772',
  //       //     blockNumber: 836,
  //       //     address: '0xC1a06403F572Eacab1eE1F9040048F9952a4D754',
  //       //     type: 'mined',
  //       //     id: 'log_4fa9a7b3',
  //       //     event: 'Deposit',
  //       //     args: [Result]
  //       //   }
  //       // ]
  //       const log = result.logs[0]
  //       assert.equal(log.event, 'WithDraw')
  //       const event = log.args
  //       assert.equal(event.receiver, ETHER_ADDRESS)
  //       assert.equal(event.sender, user1)
  //       assert.equal(event.amount.toString(), toWei(1))
  //       assert.equal(event.balance.toString(), toWei(1))
  //     })
  //   })
  //   describe('failure', async () => {
  //     it('rejects withdraws for insufficient balances', async () => {
  //       // 安装chai-as-promised 可以使用2中方式测试reject的异常
  //       // 第一种：expect(promise).to.eventually.be.rejected
  //       // 第二种：promise.should.be.rejected
  //       // rejectedWith()，它可以让你指定错误类/构造函数。

  //       await exchange.withdrawEther(toWei(100), {
  //         from: user1,
  //       }).should.be.rejected
  //     })
  //   })
  // })
  // // 账户余额测试
  // describe('checking balances', async () => {
  //   let amount
  //   let balance
  //   let ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
  //   beforeEach(async () => {
  //     amount = toWei(1)
  //     // 存入币
  //     result = await exchange.depositEther({
  //       from: user1,
  //       value: amount,
  //     })
  //   })
  //   it('returns user balances', async () => {
  //     balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
  //     assert.equal(balance.toString(), amount)
  //   })
  // })
  // // 创建订单
  // describe('making orders', async () => {
  //   let result
  //   let ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
  //   beforeEach(async () => {
  //     result = await exchange.makeOrder(
  //       token.address,
  //       toWei(1),
  //       ETHER_ADDRESS,
  //       toWei(1),
  //       {
  //         from: user1,
  //       }
  //     )
  //     console.log('result', result)
  //   })
  //   it('tracks the newly created order', async () => {
  //     const orderCount = await exchange.orderCount()
  //     assert.equal(orderCount.toString(), 1)
  //     const order = await exchange.orders('1')
  //     console.log('order', order)
  //   })
  //   it('emit an order event', async () => {
  //     // todo
  //   })
  // })
  // 取消订单
  describe('cancel actions', async () => {
    let result
    let ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
    beforeEach(async () => {
      // user1 deposit ethers
      await exchange.depositEther({
        from: user1,
        value: toWei(1),
      })
      // user1 make an order to buy tokens with Ether
      await exchange.makeOrder(
        token.address,
        toWei(1),
        ETHER_ADDRESS,
        toWei(1),
        {
          from: user1,
        }
      )
      console.log('orders', exchange)
    })
    describe('cancelling orders', async () => {
      let result
      describe('success', async () => {
        beforeEach(async () => {
          result = await exchange.cancelOrder('1', {
            from: user1,
          })
        })
        it('update cancelled orders', async () => {
          const orderCancelled = await exchange.orderCancelled(1)
          assert.equal(orderCancelled, true)
        })
      })
    })
  })
})
