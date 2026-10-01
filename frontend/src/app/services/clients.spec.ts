import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ClientsService } from './clients';
import { Client } from '../models/client';

describe('ClientsService', () => {
  it('should fetch the client list from the backend', () => {
    const expected: Client[] = [{ id: 1, name: 'Maria', phone: '11999999999' }];
    const httpMock = {
      get: vi.fn().mockReturnValue(of(expected)),
    } as any;

    const service = new ClientsService(httpMock);
    const result = service.getClients();

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3333/api/v1/clients');
    result.subscribe((clients) => {
      expect(clients).toEqual(expected);
    });
  });
});
