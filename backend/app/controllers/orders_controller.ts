import Client from '#models/client'
import Order from '#models/order'
import Product from '#models/product'
import { createOrderValidator, updateOrderStatusValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'

const allowedTransitions: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['finished', 'cancelled'],
  finished: [],
  cancelled: [],
}

export default class OrdersController {
  async index() {
    const orders = await Order.query()
      .preload('client')
      .preload('items', (query) => query.preload('product'))
      .orderBy('created_at', 'desc')

    return orders
  }

  async show({ params }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('client')
      .preload('items', (query) => query.preload('product'))
      .firstOrFail()

    return order
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)

    await Client.findByOrFail('id', payload.clientId)

    const productIds = payload.items.map((item) => item.productId)
    const products = await Product.query().whereIn('id', productIds).where('is_active', true)

    if (products.length !== productIds.length) {
      return response.badRequest({ message: 'Some products are invalid or inactive' })
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    const order = await Order.create({
      clientId: payload.clientId,
      status: 'pending',
      total: 0,
    })

    let total = 0

    const orderItems = payload.items.map((item) => {
      const product = productMap.get(item.productId)

      if (!product) {
        throw new Error('Product not found')
      }

      const unitPrice = Number(product.price)
      const itemTotal = unitPrice * item.quantity
      total += itemTotal

      return {
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        total: itemTotal,
      }
    })

    await order.related('items').createMany(orderItems)
    order.total = total
    await order.save()

    await order.load('client')
    await order.load('items', (query) => query.preload('product'))

    return response.created(order)
  }

  async updateStatus({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateOrderStatusValidator)
    const order = await Order.findOrFail(params.id)

    if (order.status === 'cancelled') {
      return response.badRequest({ message: 'Pedido cancelado não pode voltar para outro status' })
    }

    const transitions = allowedTransitions[order.status] ?? []

    if (!transitions.includes(payload.status)) {
      return response.badRequest({
        message: `Status inválido para o pedido atual: ${order.status}`,
      })
    }

    order.status = payload.status
    await order.save()

    return order
  }
}
