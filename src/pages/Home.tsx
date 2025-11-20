import { useState, useEffect } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
	useChainId,
	useSwitchChain
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import '../App.css';
import nft from '../assets/gif_dw.gif';

// Contract ABI - replace with your actual ABI
const DIAMOND_DAO_ABI: any[] = [
  {
	"inputs": [
	  {
		"internalType": "string",
		"name": "_initBaseURI",
		"type": "string"
	  },
	  {
		"internalType": "string",
		"name": "_initNotRevealedUri",
		"type": "string"
	  },
	  {
		"internalType": "address",
		"name": "_tokenContract",
		"type": "address"
	  }
	],
	"stateMutability": "nonpayable",
	"type": "constructor"
  },
  {
	"inputs": [],
	"name": "ApprovalCallerNotOwnerNorApproved",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "ApprovalQueryForNonexistentToken",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "ApprovalToCurrentOwner",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "ApproveToCaller",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "BalanceQueryForZeroAddress",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "MintToZeroAddress",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "MintZeroQuantity",
	"type": "error"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "operator",
		"type": "address"
	  }
	],
	"name": "OperatorNotAllowed",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "OwnerIndexOutOfBounds",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "OwnerQueryForNonexistentToken",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "TokenIndexOutOfBounds",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "TransferCallerNotOwnerNorApproved",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "TransferFromIncorrectOwner",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "TransferToNonERC721ReceiverImplementer",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "TransferToZeroAddress",
	"type": "error"
  },
  {
	"inputs": [],
	"name": "URIQueryForNonexistentToken",
	"type": "error"
  },
  {
	"anonymous": false,
	"inputs": [
	  {
		"indexed": true,
		"internalType": "address",
		"name": "owner",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "address",
		"name": "approved",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "Approval",
	"type": "event"
  },
  {
	"anonymous": false,
	"inputs": [
	  {
		"indexed": true,
		"internalType": "address",
		"name": "owner",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "address",
		"name": "operator",
		"type": "address"
	  },
	  {
		"indexed": false,
		"internalType": "bool",
		"name": "approved",
		"type": "bool"
	  }
	],
	"name": "ApprovalForAll",
	"type": "event"
  },
  {
	"anonymous": false,
	"inputs": [
	  {
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	  }
	],
	"name": "OwnershipTransferred",
	"type": "event"
  },
  {
	"anonymous": false,
	"inputs": [
	  {
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	  },
	  {
		"indexed": true,
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "Transfer",
	"type": "event"
  },
  {
	"inputs": [],
	"name": "MAX_SUPPLY",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "OPERATOR_FILTER_REGISTRY",
	"outputs": [
	  {
		"internalType": "contract IOperatorFilterRegistry",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "Tier1_referral_payments",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "Tier1_referrals",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"name": "Tier1_referrer",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "Tier2_referral_payments",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "Tier2_referrals",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"name": "Tier2_referrer",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address[]",
		"name": "receiver",
		"type": "address[]"
	  },
	  {
		"internalType": "uint256[]",
		"name": "quantity",
		"type": "uint256[]"
	  }
	],
	"name": "airdrop",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "operator",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "approve",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "owner",
		"type": "address"
	  }
	],
	"name": "balanceOf",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "contractURI",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "count",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "decimalCorrector",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "decimalNumber",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "destinationAddress",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "divider",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "divider2",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "getApproved",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "getBaseURI",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "getChainlinkDataFeedLatestAnswer",
	"outputs": [
	  {
		"internalType": "int256",
		"name": "",
		"type": "int256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "getTheMintPrice",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "owner",
		"type": "address"
	  },
	  {
		"internalType": "address",
		"name": "operator",
		"type": "address"
	  }
	],
	"name": "isApprovedForAll",
	"outputs": [
	  {
		"internalType": "bool",
		"name": "",
		"type": "bool"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "max_per_wallet",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "to",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	  }
	],
	"name": "mint",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "quantity",
		"type": "uint256"
	  },
	  {
		"internalType": "address",
		"name": "ref",
		"type": "address"
	  }
	],
	"name": "mintInSameChainWithNative",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "quantity",
		"type": "uint256"
	  },
	  {
		"internalType": "address",
		"name": "ref",
		"type": "address"
	  }
	],
	"name": "mintInSameChainWithUSDT",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "mintPriceInUSDTInBips",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "name",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "notRevealedUri",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "owner",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "quantity",
		"type": "uint256"
	  }
	],
	"name": "ownerMint",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "ownerOf",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"name": "publicMinted",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "public_mint_status",
	"outputs": [
	  {
		"internalType": "bool",
		"name": "",
		"type": "bool"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "refRewardsPortion_Tier1",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "refRewardsPortion_Tier2",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "revealed",
	"outputs": [
	  {
		"internalType": "bool",
		"name": "",
		"type": "bool"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_tokenId",
		"type": "uint256"
	  },
	  {
		"internalType": "uint256",
		"name": "_salePrice",
		"type": "uint256"
	  }
	],
	"name": "royaltyInfo",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "from",
		"type": "address"
	  },
	  {
		"internalType": "address",
		"name": "to",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "safeTransferFrom",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "from",
		"type": "address"
	  },
	  {
		"internalType": "address",
		"name": "to",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  },
	  {
		"internalType": "bytes",
		"name": "data",
		"type": "bytes"
	  }
	],
	"name": "safeTransferFrom",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "savedAddresses",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"name": "savedQuantity",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "operator",
		"type": "address"
	  },
	  {
		"internalType": "bool",
		"name": "approved",
		"type": "bool"
	  }
	],
	"name": "setApprovalForAll",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "string",
		"name": "_newBaseURI",
		"type": "string"
	  }
	],
	"name": "setBaseURI",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "string",
		"name": "_contractURI",
		"type": "string"
	  }
	],
	"name": "setContractURI",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "_df",
		"type": "address"
	  }
	],
	"name": "setDataFeed",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_MAX_SUPPLY",
		"type": "uint256"
	  }
	],
	"name": "setMAX_SUPPLY",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_max_per_wallet",
		"type": "uint256"
	  }
	],
	"name": "setMax_per_wallet",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "string",
		"name": "_notRevealedURI",
		"type": "string"
	  }
	],
	"name": "setNotRevealedURI",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "_receiver",
		"type": "address"
	  },
	  {
		"internalType": "uint96",
		"name": "_royaltyFeesInBips",
		"type": "uint96"
	  }
	],
	"name": "setRoyaltyInfo",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "_tokenContract",
		"type": "address"
	  }
	],
	"name": "setTokenContract",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_decimalCorrector",
		"type": "uint256"
	  }
	],
	"name": "set_decimalCorrector",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_decimalNumber",
		"type": "uint256"
	  }
	],
	"name": "set_decimalNumber",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "_dAddress",
		"type": "address"
	  }
	],
	"name": "set_destinationAddress",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_divider",
		"type": "uint256"
	  }
	],
	"name": "set_divider",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_divider2",
		"type": "uint256"
	  }
	],
	"name": "set_divider2",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_mintPriceInUSDTInBips",
		"type": "uint256"
	  }
	],
	"name": "set_mintPriceInUSDTInBips",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_refRewardsPortion_Tier1",
		"type": "uint256"
	  }
	],
	"name": "set_refRewardsPortion_Tier1",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "_refRewardsPortion_Tier2",
		"type": "uint256"
	  }
	],
	"name": "set_refRewardsPortion_Tier2",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "bytes4",
		"name": "interfaceId",
		"type": "bytes4"
	  }
	],
	"name": "supportsInterface",
	"outputs": [
	  {
		"internalType": "bool",
		"name": "",
		"type": "bool"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "symbol",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "toggleReveal",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "toggle_public_mint_status",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "token",
	"outputs": [
	  {
		"internalType": "contract IERC20",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	  }
	],
	"name": "tokenByIndex",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "owner",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	  }
	],
	"name": "tokenOfOwnerByIndex",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "tokenURI",
	"outputs": [
	  {
		"internalType": "string",
		"name": "",
		"type": "string"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "tokenWithdrawal",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "token_Contract",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "totalSupply",
	"outputs": [
	  {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	  }
	],
	"stateMutability": "view",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "from",
		"type": "address"
	  },
	  {
		"internalType": "address",
		"name": "to",
		"type": "address"
	  },
	  {
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	  }
	],
	"name": "transferFrom",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [
	  {
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	  }
	],
	"name": "transferOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
  },
  {
	"inputs": [],
	"name": "withdraw",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
  }
];

const USDT_ABI: any[] = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "BlockPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "BlockReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_blockedUser",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "name": "DestroyedBlockedFunds",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_destination",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Mint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_contract",
        "type": "address"
      }
    ],
    "name": "NewPrivilegedContract",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Redeem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_contract",
        "type": "address"
      }
    ],
    "name": "RemovedPrivilegedContract",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_trustedDeFiContract",
        "type": "address"
      }
    ],
    "name": "addPrivilegedContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "addToBlockedList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_blockedUser",
        "type": "address"
      }
    ],
    "name": "destroyBlockedFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_decimals",
        "type": "uint8"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isBlocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isTrusted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_destination",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_recipients",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_values",
        "type": "uint256[]"
      }
    ],
    "name": "multiTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "nonces",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "removeFromBlockedList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_trustedDeFiContract",
        "type": "address"
      }
    ],
    "name": "removePrivilegedContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
;

const CONTRACT_ADDRESS = "0x3225E383B5d0B538bCF6A26BD708527B65f3CbD7" as `0x${string}`;
const USDT_ADDRESS = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" as `0x${string}`;
const AVAX_CHAIN_ID = 43114;

interface Notification {
	id: string;
	type: 'pending' | 'success' | 'error';
	message: string;
}

// Helper function to safely convert unknown data to number
const safeToNumber = (data: unknown): number => {
	if (data === null || data === undefined) return 0;

	// If it's a bigint
	if (typeof data === 'bigint') {
		return Number(data);
	}

	// If it's a number
	if (typeof data === 'number') {
		return data;
	}

	// If it's an array, take the first element
	if (Array.isArray(data) && data.length > 0) {
		return safeToNumber(data[0]);
	}

	// If it's a string, try to parse it
	if (typeof data === 'string') {
		const num = Number(data);
		return isNaN(num) ? 0 : num;
	}

	return 0;
};

// Helper function to safely convert to bigint for formatEther
const safeToBigInt = (data: unknown): bigint => {
	if (data === null || data === undefined) return BigInt(0);

	// If it's already a bigint
	if (typeof data === 'bigint') {
		return data;
	}

	// If it's a number
	if (typeof data === 'number') {
		return BigInt(Math.floor(data));
	}

	// If it's an array, take the first element
	if (Array.isArray(data) && data.length > 0) {
		return safeToBigInt(data[0]);
	}

	// If it's a string, try to parse it
	if (typeof data === 'string') {
		try {
			return BigInt(data);
		} catch {
			return BigInt(0);
		}
	}

	return BigInt(0);
};

const Home = () => {
	const [quantity, setQuantity] = useState(1);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [mintMethod, setMintMethod] = useState<'avax' | 'usdt'>('avax');
	const [showApproveButton, setShowApproveButton] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isNormalApproving, setIsNormalApproving] = useState(false);
	const [isMaxApproving, setIsMaxApproving] = useState(false);
	const { openConnectModal } = useConnectModal();

	// Separate state for tracking approval and mint transactions
	const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
	const [mintHash, setMintHash] = useState<`0x${string}` | undefined>(undefined);

	// RainbowKit + Wagmi hooks
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { writeContract, isPending: isWritePending } = useWriteContract();

	// Contract reads
	const { data: totalSupply } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'totalSupply',
	});

	const { data: mintPrice } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'getTheMintPrice',
	});

	const { data: usdtPrice } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'mintPriceInUSDTInBips',
	});

	const { data: userBalance } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'balanceOf',
		args: address ? [address as `0x${string}`] : undefined,
	});

	const { data: maxPerWallet } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'max_per_wallet',
	});

	const { data: maxSupply } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'MAX_SUPPLY',
	});

	const { data: publicMintStatus } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: DIAMOND_DAO_ABI,
		functionName: 'public_mint_status',
	});

	const { data: usdtAllowance } = useReadContract({
		address: USDT_ADDRESS,
		abi: USDT_ABI,
		functionName: 'allowance',
		args: address && isConnected ? [address as `0x${string}`, CONTRACT_ADDRESS] : undefined,
		query: {
			enabled: isConnected && mintMethod === 'usdt',
		}
	});

	// Watch for approval transaction confirmation
	const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
		hash: approvalHash,
	});

	// Watch for mint transaction confirmation
	const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({
		hash: mintHash,
	});

	// Derived values with safe type conversion
	const totalSupplyNum = safeToNumber(totalSupply);
	const maxSupplyNum = safeToNumber(maxSupply);
	const remainingSupply = maxSupplyNum - totalSupplyNum;
	const userBalanceNum = safeToNumber(userBalance);
	const maxPerWalletNum = safeToNumber(maxPerWallet);
	const remainingMints = Math.max(0, maxPerWalletNum - userBalanceNum);

	// Safe conversion for mint price - handle both single values and arrays
	const avaxPrice = mintPrice ? parseFloat(formatEther(safeToBigInt(mintPrice))) : 0;
	const usdtPriceNum = usdtPrice ? safeToNumber(usdtPrice) / 100 : 0;

	const totalAvaxCost = avaxPrice * quantity;
	const totalUsdtCost = usdtPriceNum * quantity;

	const isWrongNetwork = chainId !== AVAX_CHAIN_ID;
	const isLoading = isConnected && (isWritePending || isApproveConfirming || isMintConfirming || isProcessing);

	// Add notification
	const addNotification = (type: Notification['type'], message: string) => {
		const id = Date.now().toString();
		setNotifications(prev => [...prev, { id, type, message }]);
		setTimeout(() => {
			setNotifications(prev => prev.filter(notification => notification.id !== id));
		}, 5000);
	};

	// Extract meaningful error message
	const extractErrorMessage = (error: any): string => {
		const errorStr = error?.message || error?.toString() || 'Transaction failed';

		// User rejected
		if (errorStr.includes('User rejected') || errorStr.includes('User denied')) {
			return 'Transaction cancelled';
		}

		// Insufficient funds
		if (errorStr.includes('insufficient funds')) {
			return 'Insufficient funds';
		}

		// Gas estimation failed
		if (errorStr.includes('gas')) {
			return 'Transaction may fail - check gas/balance';
		}

		// Contract revert
		if (errorStr.includes('revert')) {
			const revertMatch = errorStr.match(/revert (.+?)(?:\.|$)/i);
			if (revertMatch) return revertMatch[1];
			return 'Transaction reverted';
		}

		// Fallback: extract first sentence or short message
		const firstSentence = errorStr.split(/[.\n]/)[0];
		return firstSentence.length > 80 ? 'Transaction failed' : firstSentence;
	};

	// Reset processing state when approval transaction is confirmed
	useEffect(() => {
		if (isApproveConfirmed) {
			setIsProcessing(false);
			setIsNormalApproving(false);
			setIsMaxApproving(false);
			addNotification('success', 'USDT approval confirmed!');
			setShowApproveButton(false);
		}
	}, [isApproveConfirmed]);

	useEffect(() => {
		getButtonText();
		console.log('Debug isLoading:', {
			isConnected,
			isWritePending,
			isApproveConfirming,
			isMintConfirming,
			isProcessing,
			isLoading
		});
	}, [isConnected, isWritePending, isApproveConfirming, isMintConfirming, isProcessing, isLoading]);

	// Reset processing state when mint transaction is confirmed
	useEffect(() => {
		if (isMintConfirmed) {
			setIsProcessing(false);
			addNotification('success', 'NFT minting confirmed!');
		}
	}, [isMintConfirmed]);

	// Check USDT allowance
	useEffect(() => {
		if (mintMethod === 'usdt' && usdtAllowance !== undefined) {
			const requiredAllowance = BigInt(Math.floor(totalUsdtCost * 1e6));
			const currentAllowance = safeToBigInt(usdtAllowance);
			setShowApproveButton(currentAllowance < requiredAllowance);
		}
	}, [usdtAllowance, totalUsdtCost, mintMethod]);

	// Handle mint with AVAX
	const handleMintWithAvax = async () => {
		if (!isConnected || isWrongNetwork) return;

		try {
			setIsProcessing(true);
			addNotification('pending', 'Minting your NFTs...');

			const value = parseEther(totalAvaxCost.toString());
			const referral = address || '0x0000000000000000000000000000000000000000';

			writeContract({
				address: CONTRACT_ADDRESS,
				abi: DIAMOND_DAO_ABI,
				functionName: 'mintInSameChainWithNative',
				args: [BigInt(quantity), referral as `0x${string}`],
				value,
			} as any, {
				onSuccess: (hash) => {
					setMintHash(hash);
					addNotification('success', 'Transaction submitted!');
				},
				onError: (error) => {
					setIsProcessing(false);
					const errorMsg = extractErrorMessage(error);
					if (!errorMsg.includes('cancelled')) {
						addNotification('error', errorMsg);
					}
				}
			});

		} catch (error: any) {
			setIsProcessing(false);
			const errorMsg = extractErrorMessage(error);
			if (!errorMsg.includes('cancelled')) {
				addNotification('error', errorMsg);
			}
		}
	};

	// Handle mint with USDT
	const handleMintWithUSDT = async () => {
		if (!isConnected || isWrongNetwork) return;

		try {
			setIsProcessing(true);
			addNotification('pending', 'Minting your NFTs with USDT...');

			const referral = address || '0x0000000000000000000000000000000000000000';

			writeContract({
				address: CONTRACT_ADDRESS,
				abi: DIAMOND_DAO_ABI,
				functionName: 'mintInSameChainWithUSDT',
				args: [BigInt(quantity), referral as `0x${string}`],
			} as any, {
				onSuccess: (hash) => {
					setMintHash(hash);
					addNotification('success', 'Transaction submitted!');
				},
				onError: (error) => {
					setIsProcessing(false);
					const errorMsg = extractErrorMessage(error);
					if (!errorMsg.includes('cancelled')) {
						addNotification('error', errorMsg);
					}
				}
			});

		} catch (error: any) {
			setIsProcessing(false);
			const errorMsg = extractErrorMessage(error);
			if (!errorMsg.includes('cancelled')) {
				addNotification('error', errorMsg);
			}
		}
	};

	// Handle USDT approval
	const handleApprove = async (max: boolean = false) => {
		if (!isConnected) return;

		try {
			if (max) {
				setIsMaxApproving(true);
			} else {
				setIsNormalApproving(true);
			}

			setIsProcessing(true);
			addNotification('pending', 'Approving USDT...');

			const amount = max
				? BigInt(2n ** 256n - 1n)
				: BigInt(Math.floor(totalUsdtCost * 1e6));

			writeContract({
				address: USDT_ADDRESS,
				abi: USDT_ABI,
				functionName: 'approve',
				args: [CONTRACT_ADDRESS, amount],
			} as any, {
				onSuccess: (hash) => {
					setApprovalHash(hash);
					addNotification('success', 'Approval submitted!');
				},
				onError: (error) => {
					setIsProcessing(false);
					setIsNormalApproving(false);
					setIsMaxApproving(false);
					const errorMsg = extractErrorMessage(error);
					if (!errorMsg.includes('cancelled')) {
						addNotification('error', errorMsg);
					}
				}
			});

		} catch (error: any) {
			setIsProcessing(false);
			setIsNormalApproving(false);
			setIsMaxApproving(false);
			const errorMsg = extractErrorMessage(error);
			if (!errorMsg.includes('cancelled')) {
				addNotification('error', errorMsg);
			}
		}
	};

	const incrementQuantity = () => {
		if (quantity < remainingMints && quantity < 100) {
			setQuantity(prev => prev + 1);
		}
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity(prev => prev - 1);
		}
	};

	const isButtonDisabled = !isConnected ||
		isWrongNetwork ||
		isLoading ||
		remainingMints <= 0 ||
		!publicMintStatus ||
		quantity > remainingMints;

	const getButtonText = () => {
		if (isWrongNetwork) return 'SWITCH TO AVAX';
		if (!publicMintStatus) return 'MINTING PAUSED';
		if (remainingMints <= 0) return 'MINT LIMIT REACHED';

		// Only show PROCESSING if we're actually connected AND loading
		if (isConnected && (isWritePending || isApproveConfirming || isMintConfirming || isProcessing)) {
			return 'PROCESSING...';
		}

		return `MINT ${quantity} NFT${quantity > 1 ? 'S' : ''}`;
	};

	return (
		<div className="presale-app">
			{/* Notifications */}
			<div className="notification-container">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification ${notification.type}`}
					>
						{notification.message}
					</div>
				))}
			</div>

			<main className="presale-container">
				<div className="presale-card">
					{/* Header Section */}
					<div className="card-header">
						<h2 className="gradient-text">AVAX DIAMOND WOMAN</h2>
						<p className="subtitle">Join the Royalty Club with Diamond Woman NFTs</p>

						{/* RainbowKit Connect Button */}
						<ConnectButton.Custom>
							{({
								account,
								chain,
								openAccountModal,
								openChainModal,
								openConnectModal,
								mounted,
							}) => {
								const ready = mounted;
								const connected = ready && account && chain;

								return (
									<div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
										{(() => {
											if (!connected) {
												return (
													<button
														onClick={openConnectModal}
														className="connect-button"
													>
														Connect
													</button>
												);
											}

											if (chain.unsupported) {
												return (
													<button
														onClick={openChainModal}
														className="connect-button"
													>
														Wrong network
													</button>
												);
											}

											return (
												<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>

													<button
														onClick={openAccountModal}
														className="connect-button connected"
													>
														{account.address.slice(0, 6)}...{account.address.slice(-4)}
													</button>
												</div>
											);
										})()}
									</div>
								);
							}}
						</ConnectButton.Custom>
					</div>

					{/* NFT Image Display */}
					<div className="nft-image-container">
						<img
							src={nft}
							alt="Diamond Woman NFT"
							className="nft-image"
						/>
					</div>

					{/* Metrics Section */}
					<div className="presale-metrics">
						{/*<div className="metric">
							<span className="metric-label">Minted</span>
							<span className="metric-value">{totalSupplyNum} / {maxSupplyNum}</span>
						</div>*/}
						<div className="metric">
							<span className="metric-label">Your NFTs</span>
							<span className="metric-value">{userBalanceNum}</span>
						</div>
						<div className="metric">
							<span className="metric-label">Remaining Mints</span>
							<span className="metric-value"><span className="metric-value">{Math.max(0, maxSupplyNum - totalSupplyNum)}</span></span>
						</div>
						<div className="metric">
							<span className="metric-label">Status</span>
							<span className="metric-value">
								{publicMintStatus ? 'LIVE' : 'PAUSED'}
							</span>
						</div>
					</div>

					{/* Payment Method Selection */}
					<div className="payment-methods">
						<button
							onClick={() => setMintMethod('avax')}
							className={`method-button ${mintMethod === 'avax' ? 'active' : ''}`}
						>
							Pay with AVAX
						</button>
						<button
							onClick={() => setMintMethod('usdt')}
							className={`method-button ${mintMethod === 'usdt' ? 'active' : ''}`}
						>
							Pay with USDT
						</button>
					</div>

					{/* Quantity Selector */}
					<div className="quantity-selector">
						<div className="quantity-controls">
							<button
								onClick={decrementQuantity}
								disabled={quantity <= 1}
								className="quantity-btn"
							>
								-
							</button>
							<span className="quantity-display">{quantity}</span>
							<button
								onClick={incrementQuantity}
								disabled={quantity >= remainingMints || quantity >= 100}
								className="quantity-btn"
							>
								+
							</button>
						</div>
						<div className="quantity-label">
							NFTs to mint (Max: {Math.min(remainingMints, 100)})
						</div>
					</div>

					{/* Cost Display */}
					<div className="cost-display">
						<div className="cost-item">
							<span>NFT Cost:</span>
							<span>
								{mintMethod === 'avax'
									? `${totalAvaxCost.toFixed(4)} AVAX`
									: `${totalUsdtCost.toFixed(2)} USDT`
								}
							</span>
						</div>
						<div className="cost-total">
							<span>Total Cost:</span>
							<span>
								{mintMethod === 'avax'
									? `${totalAvaxCost.toFixed(4)} AVAX`
									: `${totalUsdtCost.toFixed(2)} USDT`
								} + Gas
							</span>
						</div>
					</div>

					{/* Network Warning */}
					{isConnected && isWrongNetwork && (
						<div className="network-warning">
							Please switch to AVAX network to mint
						</div>
					)}

					{/* Mint/Approve Buttons */}
					{/* Mint/Approve Buttons */}
					{!isConnected ? (
						<button
							onClick={openConnectModal}
							className='buy-button gradient-bg'
						>
							CONNECT WALLET TO MINT
						</button>
					) : mintMethod === 'usdt' && showApproveButton ? (
						<div className="approval-buttons">
							<button
								onClick={() => handleApprove(false)}
								disabled={isNormalApproving || isMaxApproving || isWrongNetwork}
								className={`buy-button gradient-bg ${(isNormalApproving || isMaxApproving || isWrongNetwork) ? 'disabled' : ''}`}
							>
								{isNormalApproving ? 'PROCESSING...' : `APPROVE ${totalUsdtCost.toFixed(2)} USDT`}
							</button>
							<button
								onClick={() => handleApprove(true)}
								disabled={isNormalApproving || isMaxApproving || isWrongNetwork}
								className={`buy-button outline-button ${(isNormalApproving || isMaxApproving || isWrongNetwork) ? 'disabled' : ''}`}
							>
								{isMaxApproving ? 'PROCESSING...' : 'APPROVE MAX'}
							</button>
						</div>
					) : (
						<button
							onClick={mintMethod === 'avax' ? handleMintWithAvax : handleMintWithUSDT}
							disabled={isButtonDisabled}
							className='buy-button gradient-bg'
						>
							{getButtonText()}
						</button>
					)}
				</div>
			</main>
		</div>
	);
};

export default Home;
