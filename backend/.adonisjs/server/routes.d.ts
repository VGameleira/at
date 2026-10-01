import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'clients.clients.index': { paramsTuple?: []; params?: {} }
    'clients.clients.store': { paramsTuple?: []; params?: {} }
    'clients.clients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.products.index': { paramsTuple?: []; params?: {} }
    'products.products.store': { paramsTuple?: []; params?: {} }
    'products.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.products.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.orders.index': { paramsTuple?: []; params?: {} }
    'orders.orders.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'clients.clients.index': { paramsTuple?: []; params?: {} }
    'products.products.index': { paramsTuple?: []; params?: {} }
    'orders.orders.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'clients.clients.index': { paramsTuple?: []; params?: {} }
    'products.products.index': { paramsTuple?: []; params?: {} }
    'orders.orders.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'clients.clients.store': { paramsTuple?: []; params?: {} }
    'products.products.store': { paramsTuple?: []; params?: {} }
    'orders.orders.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'clients.clients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'products.products.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}