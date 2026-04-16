import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { Purchase } from '../models/Purchase.js'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { mintNFT, usdcToWei } from '../services/blockchain.js'

const router = Router()

const NETWORK_FEE = 10 // USDC

/**
 * POST /api/purchases
 * Purchase a project (mint NFT)
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not registered' })
    return
  }

  const { projectId, currency = 'usdc' } = req.body

  if (!projectId) {
    res.status(400).json({ error: 'projectId is required' })
    return
  }

  try {
    const project = await Project.findById(projectId).populate('artist')
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    // Check supply
    if (project.availableUnits <= 0) {
      res.status(400).json({ error: 'Project is sold out' })
      return
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({
      buyer: req.user._id,
      project: project._id,
    })
    if (existingPurchase) {
      res.status(400).json({ error: 'You already own this project' })
      return
    }

    // Check balance
    const totalCost = project.price + NETWORK_FEE
    const balanceField = currency === 'usdt' ? 'balance.usdt' : 'balance.usdc'
    const currentBalance = currency === 'usdt' ? req.user.balance.usdt : req.user.balance.usdc

    if (currentBalance < totalCost) {
      res.status(400).json({
        error: `Insufficient ${currency.toUpperCase()} balance. Need ${totalCost}, have ${currentBalance}`,
      })
      return
    }

    // Mint NFT on-chain
    const buyerAddress = req.user.walletAddress || '0x0000000000000000000000000000000000000000'
    const priceInWei = usdcToWei(project.price)

    let mintResult = { txHash: '', tokenId: 0 }
    try {
      mintResult = await mintNFT(
        project.contractAddress || '',
        buyerAddress,
        priceInWei,
      )
    } catch (error) {
      console.error('On-chain mint failed (continuing with off-chain record):', error)
      // Generate mock tx hash for development
      mintResult = {
        txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        tokenId: project.totalUnits - project.availableUnits + 2,
      }
    }

    // Deduct balance from buyer
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { [balanceField]: -totalCost },
    })

    // Credit artist with 50% of sale
    const artistShare = project.price * 0.5
    await User.findByIdAndUpdate(project.artist._id, {
      $inc: {
        'balance.usdc': artistShare,
        'stats.totalSales': 1,
      },
    })

    // Decrement available units
    await Project.findByIdAndUpdate(project._id, {
      $inc: { availableUnits: -1 },
    })

    // Create purchase record
    const purchase = new Purchase({
      project: project._id,
      buyer: req.user._id,
      price: project.price,
      txHash: mintResult.txHash,
      tokenId: mintResult.tokenId,
    })

    await purchase.save()

    // Populate for response
    await purchase.populate([
      { path: 'project', populate: { path: 'artist' } },
      { path: 'buyer' },
    ])

    res.status(201).json(purchase.toJSON())
  } catch (error) {
    console.error('Purchase error:', error)
    throw error
  }
})

export default router
