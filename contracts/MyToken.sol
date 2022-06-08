// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyToken {
    using SafeMath for uint256;
    string public name = "TutorialToken";
    string public symbol = "TT";
    uint256 constant decimals = 18;
    uint256 constant INITIAL_SUPPLY = 100 * (10 ** decimals); // equal 10 ^ 18
    uint256 public totalSupply;
    // Solidity语法event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // Track balances
    // 定义了一个映射类型变量balances，key为address类型，值为无符整型，应该是用来存储每个账户的余额，可以存多个。
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowance;

    constructor() {
        totalSupply = INITIAL_SUPPLY;
        //Solidity自身携带的特殊变量以及函数：
        // msg.sender (address): 信息的发送方 (当前调用)
        // tx.origin (address): 交易发送方地址(完全的链调用)
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    // send token
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        // 如果余额不足，则返回发送币失败
        // if (balances[msg.sender] < _amount) return false;

        // 换成require, require语法成功后，执行后面的代码
        require(_to != address(0));
        // 否则从发送方余额中减去发送值，
        balances[_from] = balances[_from].sub(_amount);
        // 然后在接收方的余额中加入发送值数量。
        balances[_to] = balances[_to].add(_amount);
        // 使用以上event关键字声明的方法
        emit Transfer(msg.sender, _to, _amount);
    }

    // 函数声明部分没有盲点，方法名，参数列表，函数可见性，返回值类型定义。
    function transferToken(address _to, uint256 _amount)
        public
        returns (bool success)
    {
        require(balances[msg.sender] >= _amount);
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function tranferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) {
        require(_amount <= balances[_from]);
        require(_amount <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(
            _amount
        );
        _transfer(_from, _to, _amount);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}

// contract MyToken {
//   uint256 INITIAL_SUPPLY = 100;
//   mapping(address => uint256) balances;

//   event Transfer(address indexed _from, address indexed _to, uint256 _value);

//   function MyToken() public {
//     balances[tx.origin] = INITIAL_SUPPLY;
//   }
//   function sendToken(address _to, uint256 _amount) public returns (bool success) {
//     if (balances[msg.sender] < _amount) return false;
//     balances[msg.sender] -= _amount;
//     balances[_to] += _amount;
//     Transfer(msg.sender, _to, _amount);
//     return true;
//   }
//   function balanceOf(address _owner) public returns (uint256 balance) {
//     return balances[_owner];
//   }
// }
