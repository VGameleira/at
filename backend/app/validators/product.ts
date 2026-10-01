import vine from '@vinejs/vine'

const name = () => vine.string().trim().minLength(2).maxLength(120)
const price = () => vine.number().positive()

export const createProductValidator = vine.create({
  name: name(),
  price: price(),
  isActive: vine.boolean().optional(),
})

export const updateProductValidator = vine.create({
  name: name(),
  price: price(),
  isActive: vine.boolean(),
})

export const updateProductStatusValidator = vine.create({
  isActive: vine.boolean(),
})
