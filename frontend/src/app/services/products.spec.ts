import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ProductsService, Product } from './products';

describe('ProductsService', () => {
  it('should fetch the product list from the backend', () => {
    const expected: Product[] = [{ id: 1, name: 'Teclado', price: 200, isActive: true }];
    const httpMock = {
      get: vi.fn().mockReturnValue(of(expected)),
    } as any;

    const service = new ProductsService(httpMock);
    const result = service.getProducts();

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3333/api/v1/products');
    result.subscribe((products) => {
      expect(products).toEqual(expected);
    });
  });
});
