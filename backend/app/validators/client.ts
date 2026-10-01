import vine from '@vinejs/vine'

const name = () => vine.string().trim().minLength(2).maxLength(120)
const phone = () => vine.string().trim().minLength(8).maxLength(30)

export const createClientValidator = vine.create({
  name: name(),
  phone: phone(),
})

export const updateClientValidator = vine.create({
  name: name(),
  phone: phone(),
})