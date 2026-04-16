import { ethers } from 'ethers'
import { env } from '../config/env.js'

// ABI fragments for the contracts we interact with
const FACTORY_ABI = [
  'function createProject(string memory _name, string memory _symbol, uint256 _maxSupply, uint256 _priceInWei, address _artist, string memory _projectURI) external returns (address)',
  'function projectCount() external view returns (uint256)',
  'function getProject(uint256 _projectId) external view returns (tuple(address nftContract, address artist, string name, uint256 maxSupply, uint256 priceInWei))',
  'event ProjectCreated(uint256 indexed projectId, address indexed nftContract, address indexed artist, string name, uint256 maxSupply, uint256 priceInWei)',
]

const NFT_ABI = [
  'function mint(address to) external payable',
  'function platformMint(address to) external',
  'function availableSupply() external view returns (uint256)',
  'function totalMinted() external view returns (uint256)',
  'function maxSupply() external view returns (uint256)',
  'function priceInWei() external view returns (uint256)',
  'event Minted(address indexed buyer, uint256 indexed tokenId, uint256 price)',
]

let provider: ethers.JsonRpcProvider | null = null
let platformWallet: ethers.Wallet | null = null

function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(env.BASE_SEPOLIA_RPC_URL)
  }
  return provider
}

function getPlatformWallet(): ethers.Wallet | null {
  if (!env.PLATFORM_PRIVATE_KEY) {
    console.warn('⚠️  PLATFORM_PRIVATE_KEY not set. Blockchain operations will be simulated.')
    return null
  }
  if (!platformWallet) {
    platformWallet = new ethers.Wallet(env.PLATFORM_PRIVATE_KEY, getProvider())
  }
  return platformWallet
}

/**
 * Deploy a new OpenMusicNFT contract for a project via the factory
 */
export async function createProjectOnChain(
  name: string,
  maxSupply: number,
  priceInWei: string,
  artistAddress: string,
  projectURI: string = '',
): Promise<{ contractAddress: string; txHash: string; tokenId: number }> {
  const wallet = getPlatformWallet()

  if (!wallet || !env.FACTORY_CONTRACT_ADDRESS) {
    // Simulation mode - return mock data
    console.log('🔧 Simulating on-chain project creation (no wallet/factory configured)')
    return {
      contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      tokenId: Math.floor(Math.random() * 1000),
    }
  }

  const factory = new ethers.Contract(env.FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, wallet)

  // Generate a symbol from the name (first 4 chars uppercase)
  const symbol = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase() || 'OMUSIC'

  const tx = await factory.createProject(name, symbol, maxSupply, priceInWei, artistAddress, projectURI)

  const receipt = await tx.wait()

  // Parse the ProjectCreated event
  const event = receipt.logs
    .map((log: any) => {
      try {
        return factory.interface.parseLog({ topics: log.topics, data: log.data })
      } catch {
        return null
      }
    })
    .find((e: any) => e?.name === 'ProjectCreated')

  if (!event) {
    throw new Error('ProjectCreated event not found in transaction receipt')
  }

  return {
    contractAddress: event.args.nftContract,
    txHash: receipt.hash,
    tokenId: Number(event.args.projectId),
  }
}

/**
 * Mint an NFT on a project's contract for a buyer
 */
export async function mintNFT(
  nftContractAddress: string,
  buyerAddress: string,
  priceInWei: string,
): Promise<{ txHash: string; tokenId: number }> {
  const wallet = getPlatformWallet()

  if (!wallet) {
    // Simulation mode
    console.log('🔧 Simulating NFT mint (no wallet configured)')
    return {
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      tokenId: Math.floor(Math.random() * 1000),
    }
  }

  const nft = new ethers.Contract(nftContractAddress, NFT_ABI, wallet)

  const tx = await nft.mint(buyerAddress, { value: priceInWei })
  const receipt = await tx.wait()

  // Parse the Minted event
  const event = receipt.logs
    .map((log: any) => {
      try {
        return nft.interface.parseLog({ topics: log.topics, data: log.data })
      } catch {
        return null
      }
    })
    .find((e: any) => e?.name === 'Minted')

  if (!event) {
    throw new Error('Minted event not found in transaction receipt')
  }

  return {
    txHash: receipt.hash,
    tokenId: Number(event.args.tokenId),
  }
}

/**
 * Get the available supply of a project's NFT contract
 */
export async function getAvailableSupply(nftContractAddress: string): Promise<number> {
  const wallet = getPlatformWallet()
  if (!wallet) return -1

  const nft = new ethers.Contract(nftContractAddress, NFT_ABI, getProvider())
  const supply = await nft.availableSupply()
  return Number(supply)
}

/**
 * Convert USDC price to wei (using a fixed test rate for testnet)
 * On testnet we use 1 USDC = 0.001 ETH for simplicity
 */
export function usdcToWei(usdcAmount: number): string {
  const ethAmount = usdcAmount * 0.001
  return ethers.parseEther(ethAmount.toString()).toString()
}

/**
 * Get the platform wallet address
 */
export function getPlatformAddress(): string {
  const wallet = getPlatformWallet()
  return wallet?.address || '0x0000000000000000000000000000000000000000'
}
