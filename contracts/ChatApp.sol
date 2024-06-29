// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ChatApp {
    struct User {
        string name;
        Friend[] friendList;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    AllUserStruct[] private allUsers;

    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;

    function checkUserExist(address pubkey) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    function createAccount(string calldata name) external {
        require(!checkUserExist(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");
        userList[msg.sender].name = name;
        allUsers.push(AllUserStruct(name, msg.sender));
    }

    function getUserName(address pubkey) external view returns (string memory) {
        require(checkUserExist(pubkey), "User is not registered");
        return userList[pubkey].name;
    }

    function addFriend(address friendKey, string calldata name) external {
        require(checkUserExist(msg.sender), "Create an account first");
        require(checkUserExist(friendKey), "Friend doesn't have an account");
        require(msg.sender != friendKey, "Can't add yourself");
        require(!checkAlreadyFriends(msg.sender, friendKey), "You are already friends");

        _addFriend(msg.sender, friendKey, name);
        _addFriend(friendKey, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns (bool) {
        for (uint256 i = 0; i < userList[pubkey1].friendList.length; i++) {
            if (userList[pubkey1].friendList[i].pubkey == pubkey2) {
                return true;
            }
        }
        return false;
    }

    function _addFriend(address userKey, address friendKey, string memory name) internal {
        Friend memory newFriend = Friend({
            pubkey: friendKey,
            name: name
        });
        userList[userKey].friendList.push(newFriend);
    }

    function getMyFriendList() external view returns (Friend[] memory) {
        return userList[msg.sender].friendList;
    }

    function getChatCode(address pubkey1, address pubkey2) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(pubkey1 < pubkey2 ? pubkey1 : pubkey2, pubkey1 < pubkey2 ? pubkey2 : pubkey1));
    }

    function sendMessage(address friendKey, string calldata _msg) external {
        require(checkUserExist(msg.sender), "Create an account first");
        require(checkUserExist(friendKey), "User is not registered");
        require(checkAlreadyFriends(msg.sender, friendKey), "You are not friends already");

        bytes32 chatCode = getChatCode(msg.sender, friendKey);
        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    function readMessage(address friendKey) external view returns (Message[] memory) {
        bytes32 chatCode = getChatCode(msg.sender, friendKey);
        return allMessages[chatCode];
    }

    function getAllUsers() public view returns (AllUserStruct[] memory) {
        return allUsers;
    }
}
