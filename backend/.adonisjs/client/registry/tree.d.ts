/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  clients: {
    clients: {
      index: typeof routes['clients.clients.index']
      store: typeof routes['clients.clients.store']
      update: typeof routes['clients.clients.update']
    }
  }
  products: {
    products: {
      index: typeof routes['products.products.index']
      store: typeof routes['products.products.store']
      update: typeof routes['products.products.update']
      updateStatus: typeof routes['products.products.update_status']
    }
  }
  orders: {
    orders: {
      index: typeof routes['orders.orders.index']
      store: typeof routes['orders.orders.store']
      updateStatus: typeof routes['orders.orders.update_status']
    }
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
