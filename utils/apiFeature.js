import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ChatAppABI from "../artifacts/contracts/ChatApp.sol/ChatApp.json";
const ChatAppAddress= "0x5FbDB2315678afecb367f032d93F642f64180aa3"
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
const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(ChatAppAddress, ChatAppABI.abi, signerOrProvider);
};

// Connecting with the contract
export const connectingWithContract = async () => {
  try {
    const web3modal= new Web3Modal()
    const connection= await web3modal.connect();
    const provider= new ethers.providers.Web3Provider(connection)
    const signer =provider.getSigner()
    const contract= fetchContract(signer)
    if (!signer) return null;
    return fetchContract(signer);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Convert timestamp to readable date/time
export const convertTime = (timestamp) => {
  const date = new Date(timestamp.toNumber()); // Convert seconds to milliseconds
  return date.toLocaleString(); // Adjust formatting as needed
};
