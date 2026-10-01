import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './products';

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  total?: number;
  product?: Product;
}

export interface Order {
  id?: number;
  clientId: number;
  status: 'pending' | 'preparing' | 'ready' | 'finished' | 'cancelled';
  total: number;
  items: OrderItem[];
  client?: {
    id?: number;
    name: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly apiUrl = 'http://localhost:3333/api/v1/orders';

  constructor(private readonly http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(payload: { clientId: number; items: OrderItemPayload[] }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, payload);
  }

  updateStatus(id: number, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }
}
