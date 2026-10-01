import Product from '#models/product'
import {
  createProductValidator,
  updateProductStatusValidator,
  updateProductValidator,
} from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index() {
    return Product.query().orderBy('name', 'asc')
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await Product.create({
      ...payload,
      isActive: payload.isActive ?? true,
    })

    return response.created(product)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateProductValidator)
    const product = await Product.findOrFail(params.id)

    product.merge(payload)
    await product.save()

    return product
  }

  async updateStatus({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateProductStatusValidator)
    const product = await Product.findOrFail(params.id)

    product.isActive = payload.isActive
    await product.save()

    return product
  }
}
