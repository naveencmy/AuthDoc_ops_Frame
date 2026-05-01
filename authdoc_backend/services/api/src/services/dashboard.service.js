// services/dashboard.service.js

import db from "../config/database.js"

export class DashboardService {

  static async getDashboard() {

    const [
      totals,
      quality,
      queue,
      trend,
      distribution,
      exportsStats
    ] = await Promise.all([
      this.getTotals(),
      this.getQuality(),
      this.getQueueStats(),
      this.getTrend(),
      this.getDistribution(),
      this.getExportStats()
    ])

    return {
      ...totals,
      ...quality,
      ...queue,
      trend,
      distribution,
      ...exportsStats
    }
  }

  // ------------------------
  // TOP METRICS
  // ------------------------

  static async getTotals() {
    const res = await db.query(`
      SELECT
        COUNT(*) AS total_documents
      FROM documents
    `)

    return {
      total_documents: Number(res.rows[0].total_documents)
    }
  }

  static async getQuality() {
    const res = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE validation_status='VERIFIED') AS verified,
        COUNT(*) FILTER (WHERE validation_status='FLAGGED') AS flagged,
        COUNT(*) FILTER (WHERE validation_status='LOW_CONFIDENCE') AS low_confidence,
        COUNT(*) FILTER (WHERE validation_status='MISSING') AS missing,
        COUNT(*) AS total
      FROM documents
    `)

    const row = res.rows[0]
    const total = Number(row.total) || 1

    return {
      verified_rate: Number(row.verified) / total,
      flagged_rate: Number(row.flagged) / total,
      manual_review: Number(row.flagged) + Number(row.low_confidence) + Number(row.missing)
    }
  }

  static async getQueueStats() {
    const res = await db.query(`
      SELECT COUNT(*) AS in_queue
      FROM documents
      WHERE processing_status NOT IN ('COMPLETED', 'FAILED')
    `)

    return {
      in_queue: Number(res.rows[0].in_queue)
    }
  }

  static async getExportStats() {
    const res = await db.query(`
      SELECT COUNT(*) AS exports_generated
      FROM exports
      WHERE status='completed'
    `)

    return {
      exports_generated: Number(res.rows[0].exports_generated)
    }
  }

  // ------------------------
  // TREND GRAPH (last 7 days)
  // ------------------------

  static async getTrend() {
    const res = await db.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM documents
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC
    `)

    return res.rows.map(r => ({
      date: r.date,
      count: Number(r.count)
    }))
  }

  // ------------------------
  // STATUS DISTRIBUTION
  // ------------------------

  static async getDistribution() {
    const res = await db.query(`
      SELECT
        validation_status,
        COUNT(*) as count
      FROM documents
      GROUP BY validation_status
    `)

    return res.rows.map(r => ({
      status: r.validation_status,
      count: Number(r.count)
    }))
  }
}