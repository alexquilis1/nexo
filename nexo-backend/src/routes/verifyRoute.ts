import { Router } from 'express'
import { verifyByExpediente } from '../controllers/verifyController'

const router = Router()

router.get('/', async (req: any, res: any) => {
  try {
    const { expediente } = req.query

    if (!expediente || typeof expediente !== 'string') {
      return res.status(400).json({ error: 'Expediente requerido' })
    }

    const result = await verifyByExpediente(expediente)

    if (!result.success) {
      return res.status(404).json(result)
    }

    res.status(200).json(result)

  } catch (error: any) {
    res.status(500).json({
      success: false,
      verified: false,
      error: error.message
    })
  }
})

export default router