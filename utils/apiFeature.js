import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ChatAppAddress } from "../Context/ChatAppContext";
import ChatAppABI from "../artifacts/contracts/ChatApp.sol/ChatApp.json";

// Check if the wallet is connected
export const CheckIfWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      console.log("Please install MetaMask");
      return false;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      console.log("Wallet is connected:", accounts[0]);
      return true;
    } else {
      console.log("No wallet connected");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Connect to the wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      console.log("Please install MetaMask");
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Wallet connected:", await signer.getAddress());
    return signer;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get the contract instance
const getContract = (signer) => {
  return new ethers.Contract(ChatAppAddress, ChatAppABI.abi, signer);
};

// Connecting with the contract
export const connectingWithContract = async () => {
  try {
    const signer = await connectWallet();
    if (!signer) return null;
    return getContract(signer);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Example function: Create an account on the ChatApp contract
export const createAccount = async (name) => {
  try {
    const chatAppContract = await connectingWithContract();
    if (!chatAppContract) return;

    const transaction = await chatAppContract.createAccount(name);
    await transaction.wait();
    console.log("Account created successfully");
  } catch (error) {
    console.log(error);
  }
};

// Example function: Get username
export const getUserName = async (address) => {
  try {
    const chatAppContract = await connectingWithContract();
    if (!chatAppContract) return null;

    const userName = await chatAppContract.getUserName(address);
    console.log("Username:", userName);
    return userName;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Example function: Add friend
export const addFriend = async (friendKey, name) => {
  try {
    const chatAppContract = await connectingWithContract();
    if (!chatAppContract) return;

    const transaction = await chatAppContract.addFriend(friendKey, name);
    await transaction.wait();
    console.log("Friend added successfully");
  } catch (error) {
    console.log(error);
  }
};

// Example function: Send message
export const sendMessage = async (friendKey, message) => {
  try {
    const chatAppContract = await connectingWithContract();
    if (!chatAppContract) return;

    const transaction = await chatAppContract.sendMessage(friendKey, message);
    await transaction.wait();
    console.log("Message sent successfully");
  } catch (error) {
    console.log(error);
  }
};

// Example function: Read messages
export const readMessage = async (friendKey) => {
  try {
    const chatAppContract = await connectingWithContract();
    if (!chatAppContract) return null;

    const messages = await chatAppContract.readMessage(friendKey);
    console.log("Messages:", messages);
    return messages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
