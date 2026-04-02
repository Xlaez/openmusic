import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { Purchase } from '../models/Purchase.js'
import { User } from '../models/User.js'
import mongoose from 'mongoose'

const router = Router()

/**
 * GET /api/dashboard/stats/:artistId
 * Get dashboard stats for an artist
 */
router.get('/stats/:artistId', async (req: Request, res: Response) => {
  const { artistId } = req.params

  try {
    const artist = await User.findById(artistId)
    if (!artist) {
      res.status(404).json({ error: 'Artist not found' })
      return
    }

    // Get all projects by this artist
    const projects = await Project.find({ artist: artistId })
    const projectIds = projects.map((p) => p._id)

    // Get purchase stats
    const purchaseStats = await Purchase.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          totalSales: { $sum: 1 },
          uniqueBuyers: { $addToSet: '$buyer' },
        },
      },
    ])

    const stats = purchaseStats[0] || { totalRevenue: 0, totalSales: 0, uniqueBuyers: [] }

    // Calculate change (compare last 30d vs previous 30d)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

    const recentSales = await Purchase.countDocuments({
      project: { $in: projectIds },
      createdAt: { $gte: thirtyDaysAgo },
    })
    const previousSales = await Purchase.countDocuments({
      project: { $in: projectIds },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    })

    const salesChange = previousSales > 0 ? ((recentSales - previousSales) / previousSales) * 100 : 0

    res.json({
      totalSales: stats.totalRevenue,
      totalListeners: stats.uniqueBuyers?.length || 0,
      projectsReleased: projects.length,
      countriesReached: Math.min(stats.uniqueBuyers?.length || 0, 50), // Estimate
      salesChange: Math.round(salesChange * 10) / 10,
    })
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/dashboard/sales/:artistId?range=30d|90d|all
 * Get sales chart data
 */
router.get('/sales/:artistId', async (req: Request, res: Response) => {
  const { artistId } = req.params
  const range = (req.query.range as string) || '30d'

  try {
    const projects = await Project.find({ artist: artistId })
    const projectIds = projects.map((p) => p._id)

    let dateFilter: any = {}
    let groupFormat: string

    if (range === '30d') {
      dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      groupFormat = '%Y-%m-%d'
    } else if (range === '90d') {
      dateFilter = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      groupFormat = '%Y-%m-%d'
    } else {
      // all time - group by month
      groupFormat = '%Y-%m'
    }

    const matchStage: any = { project: { $in: projectIds } }
    if (dateFilter.$gte) {
      matchStage.createdAt = dateFilter
    }

    const salesData = await Purchase.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: 1, _id: 0 } },
    ])

    res.json(salesData)
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/dashboard/top-projects/:artistId
 * Get top selling projects for an artist
 */
router.get('/top-projects/:artistId', async (req: Request, res: Response) => {
  const { artistId } = req.params

  try {
    const projects = await Project.find({ artist: artistId })
    const projectIds = projects.map((p) => p._id)

    const topProjects = await Purchase.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          sales: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ])

    // Populate project details
    const result = await Promise.all(
      topProjects.map(async (tp) => {
        const project = await Project.findById(tp._id)
        return {
          id: tp._id.toString(),
          title: project?.title || 'Unknown',
          type: project?.type || 'single',
          sales: tp.sales,
          revenue: tp.revenue,
          available: project?.availableUnits || 0,
          total: project?.totalUnits || 0,
        }
      }),
    )

    res.json(result)
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/dashboard/top-buyers/:artistId
 * Get top buyers for an artist's projects
 */
router.get('/top-buyers/:artistId', async (req: Request, res: Response) => {
  const { artistId } = req.params

  try {
    const projects = await Project.find({ artist: artistId })
    const projectIds = projects.map((p) => p._id)

    const topBuyers = await Purchase.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$buyer',
          purchases: { $sum: 1 },
          totalSpent: { $sum: '$price' },
          firstPurchase: { $min: '$createdAt' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ])

    // Populate buyer details
    const result = await Promise.all(
      topBuyers.map(async (tb) => {
        const user = await User.findById(tb._id)
        return {
          id: tb._id.toString(),
          username: user?.username || user?.displayName || 'Unknown',
          avatar: user?.avatar || '',
          purchases: tb.purchases,
          totalSpent: tb.totalSpent,
          joinDate: tb.firstPurchase?.toISOString() || new Date().toISOString(),
        }
      }),
    )

    res.json(result)
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/dashboard/activity/:artistId
 * Get recent purchase activity for an artist's projects
 */
router.get('/activity/:artistId', async (req: Request, res: Response) => {
  const { artistId } = req.params

  try {
    const projects = await Project.find({ artist: artistId })
    const projectIds = projects.map((p) => p._id)

    const recentPurchases = await Purchase.find({ project: { $in: projectIds } })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('buyer')
      .populate('project')

    const result = recentPurchases.map((purchase: any) => {
      const timeAgo = getTimeAgo(purchase.createdAt)
      return {
        id: purchase._id.toString(),
        user: purchase.buyer?.username || purchase.buyer?.displayName || 'Unknown',
        action: 'purchased',
        project: purchase.project?.title || 'Unknown',
        timeAgo,
        amount: purchase.price,
      }
    })

    res.json(result)
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default router
