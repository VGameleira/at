import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { OrdersService, Order } from './orders';

describe('OrdersService', () => {
  it('should create an order with the backend contract', () => {
    const expected: Order = {
      id: 10,
      clientId: 3,
      status: 'pending',
      total: 280,
      items: [
        { productId: 2, quantity: 2, unitPrice: 140, total: 280 },
      ],
    };

    const httpMock = {
      post: vi.fn().mockReturnValue(of(expected)),
    } as any;

    const service = new OrdersService(httpMock);
    const payload = {
      clientId: 3,
      items: [{ productId: 2, quantity: 2 }],
    };

    const result = service.createOrder(payload);

    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3333/api/v1/orders', payload);
    result.subscribe((order) => {
      expect(order).toEqual(expected);
    });
  });
});
