"use client"
import React, { createContext, useState, useEffect } from 'react';
import { connectingWithContract, connectWallet } from '../utils/apiFeature';

export const ChatAppContext = createContext();

export const ChatAppProvider = ({ children }) => {
  const [account, setAccount] = useState(null); // To store current account details
  const [username, setUsername] = useState(''); // To store current username
  const [userAddress, setUserAddress] = useState(''); // To store current user address
  const [friendLists, setFriendLists] = useState([]); // To store lists of friends
  const [friendMsg, setFriendMsg] = useState({}); // To store messages from friends
  const [loading, setLoading] = useState(false); // Loading state indicator
  const [userLists, setUserLists] = useState([]); // List of all users
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = await connectingWithContract();
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      const username = await contract.getUserName(connectAccount);
      setUsername(username);
      const friends = await contract.getMyFriendList();
      setFriendLists(friends);
      const userList = await contract.getAllUsers();
      setUserLists(userList);
      setLoading(false);
    } catch (error) {
      setError("Please install and connect your wallet");
      setLoading(false);
    }
  };
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      if (!contract) throw new Error("Failed to connect to contract");

      const messages = await contract.readMessage(friendAddress);
      console.log("Messages from friend:", messages);

      // Assuming you want to update state with messages from friend
      setFriendMsg(messages);

    } catch (error) {
      console.error("Error reading messages:", error);
      setError("Failed to read messages");
    }
  };
  const createAccount = async (name, address) => {
    try {
      const contract = await connectingWithContract();
      if (!contract) throw new Error("Failed to connect to contract");

      const transaction = await contract.createAccount(name);
      setLoading(true)
      await transaction.wait();
      console.log("Account created successfully");

      // After creating account, update local state or refetch data
      setUsername(name); // Assuming username is set after account creation
      setUserAddress(address); // Update user address
      setAccount(await connectWallet()); // Refresh account details
      setFriendLists(await contract.getMyFriendList()); // Refresh friend list
      setUserLists(await contract.getAllUsers()); // Refresh user list

      // Optionally, you can also fetch other necessary data or update states
    } catch (error) {
      console.error("Error creating account:", error);
      setError("Failed to create account");
    }
  };
  return (
    <ChatAppContext.Provider
      value={{
        account,
        setAccount,
        username,
        setUsername,
        userAddress,
        setUserAddress,
        friendLists,
        setFriendLists,
        friendMsg,
        setFriendMsg,
        loading,
        setLoading,
        userLists,
        setUserLists,
        error,
        setError,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
