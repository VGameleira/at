import Client from '#models/client'
import { createClientValidator, updateClientValidator } from '#validators/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index() {
    return Client.query().orderBy('name', 'asc')
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)
    const client = await Client.create(payload)

    return response.created(client)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateClientValidator)
    const client = await Client.findOrFail(params.id)

    client.merge(payload)
    await client.save()

    return client
  }
}