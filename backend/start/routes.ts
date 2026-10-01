/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [controllers.Clients, 'index'])
        router.post('/', [controllers.Clients, 'store'])
        router.put('/:id', [controllers.Clients, 'update'])
      })
      .prefix('clients')
      .as('clients')

    router
      .group(() => {
        router.get('/', [controllers.Products, 'index'])
        router.post('/', [controllers.Products, 'store'])
        router.put('/:id', [controllers.Products, 'update'])
        router.patch('/:id/status', [controllers.Products, 'updateStatus'])
      })
      .prefix('products')
      .as('products')

    router
      .group(() => {
        router.get('/', [controllers.Orders, 'index'])
        router.post('/', [controllers.Orders, 'store'])
      })
      .prefix('orders')
      .as('orders')

    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
