// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

// Common interface for the Pools.
interface IPool {
    
    // --- Events ---
    
    event ETHBalanceUpdated(uint _newBalance);
    event KUSDBalanceUpdated(uint _newBalance);
    event ActivePoolAddressChanged(address _newActivePoolAddress);
    event DefaultPoolAddressChanged(address _newDefaultPoolAddress);
    event StabilityPoolAddressChanged(address _newStabilityPoolAddress);
    event EtherSent(address _to, uint _amount);

    // --- Functions ---
    
    function getETH() external view returns (uint);

    function getKUSDDebt() external view returns (uint);

    function increaseKUSDDebt(uint _amount) external;

    function decreaseKUSDDebt(uint _amount) external;
}
