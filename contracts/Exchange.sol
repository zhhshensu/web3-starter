// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MyToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Exchange {
    using SafeMath for uint256;
    // Variables
    address public feeAccount; // the account that receive exchange fees
    uint256 public feePercent; // the fee percent

    address constant ETHER = address(0);

    // 交易需要记录币的转入转出，定义mapping，可以理解为是个合约内的全局变量，或者数据结构。
    // 定义key为币种，value为(key为用户，value为币的数量的)对象
    mapping(address => mapping(address => uint256)) public tokens;
    uint256 public orderCount; // 记录订单id
    // a way Store the order
    mapping(uint256 => _Order) public orders;
    // cancel orders
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;
    // events
    event Deposit(
        address receiver,
        address sender,
        uint256 amount,
        uint256 balance
    );
    event WithDraw(
        address receiver,
        address sender,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address userFill,
        uint256 timestamp
    );
    // a way to Modal the order
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    // a way Store the order
    // add the order to storage

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // 存入以太币
    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        // emit deposit 事件
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 提取以太币
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // 存入代币
    function depositToken(address _token, uint256 _amount) public {
        // 不允许以太币的转入
        require(_token != ETHER);
        // address(this) 表示当前的Exchange合约
        require(
            MyToken(_token).tranferFrom(msg.sender, address(this), _amount)
        );
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        // emit deposit 事件
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        // 将mytoken转移给当前用户
        require(MyToken(_token).transferToken(msg.sender, _amount));
    }

    // 检查账户余额
    function balanceOf(address _token, address _owner)
        public
        view
        returns (uint256 balance)
    {
        return tokens[_token][_owner];
    }

    // add the order to storage

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender); // _order is my order
        require(_order.id == _id); // order must exist
        orderCancelled[_id] = true;
        emit Cancel(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);
        require(!orderCancelled[_id]);
        // fetch the order
        _Order storage _order = orders[_id];
        // execute trade
        // charge fee
        // emit trade event
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );
        // make order as filled
        orderFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // for example:
        // {
        //   msg.sender: user1,
        //   _tokenGet: token.address,
        //   _amountGet: toWei(1),
        //   _tokenGive: ETHER_ADDRESS,
        //   _amountGive: toWei(1)
        // }
        // execute trade
        // swap the difference from ecah token

        // fee paid by the user that fills the order   msg.sender
        // fee deducted from _amountGet
        uint256 _feeAmount = _amountGive.mul(feePercent).div(100);
        // msg.sender 在这里作为fill the order 的人，_user是创建订单的人
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(
            _amountGet.add(_feeAmount)
        );
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(
            _feeAmount
        );
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(
            _amountGive
        );
        emit Trade(
            _orderId,
            _user,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            msg.sender,
            block.timestamp
        );

        // charge fee
        // emit trade event
    }
}

// 交易功能点
// Deposit & Withdraw Funds 存取款
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees 收费
// TODO
// [x] Set the fee account
// [X] Deposit Ether
// [X] WithDraw Ether
// [X] Deposit tokens
// [X] WithDraw tokens
// [X] Check Balances
// [x] make order
// [x] cancel order
// [] fill order
// [] charge fees
