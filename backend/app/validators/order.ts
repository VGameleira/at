import vine from '@vinejs/vine'

export const createOrderItemValidator = vine.object({
  productId: vine.number().positive(),
  quantity: vine.number().min(1),
})

export const createOrderValidator = vine.create({
  clientId: vine.number().positive(),
  items: vine.array(createOrderItemValidator).minLength(1),
})
