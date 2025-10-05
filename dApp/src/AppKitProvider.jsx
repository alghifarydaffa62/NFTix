import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { sepolia } from '@reown/appkit/networks' 

const projectId = 'b2ae975ba183c0267aa383b521b43b1e'

const metadata = {
  name: 'NFTix',
  description: 'NFT based ticketing system',
  url: 'https://nftix.app',
  icons: ['https://nftix.app/icon.png']
}

const ethersAdapter = new EthersAdapter()

createAppKit({
  adapters: [ethersAdapter], 
  networks: [sepolia], 
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false, 
    socials: false, // Disable social logins  
  },
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  ]
})

export default function AppKitProvider({ children }) {
  return children
}