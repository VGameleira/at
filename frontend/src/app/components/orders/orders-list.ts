import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../services/clients';
import { OrdersService, Order } from '../../services/orders';
import { ProductsService, Product } from '../../services/products';
import { Client } from '../../models/client';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
})
export class OrdersListComponent implements OnInit {
  readonly orders = signal<Order[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly message = signal('');

  selectedClientId = 0;
  selectedProductId = 0;
  selectedQuantity = 1;
  draftItems: Array<{ productId: number; quantity: number }> = [];

  readonly statusOptions = ['pending', 'preparing', 'ready', 'finished', 'cancelled'];

  constructor(
    private readonly ordersService: OrdersService,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    this.loadOrders();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (clients) => this.clients.set(clients),
      error: () => this.message.set('Não foi possível carregar os clientes.'),
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => this.products.set(products.filter((product) => product.isActive)),
      error: () => this.message.set('Não foi possível carregar os produtos ativos.'),
    });
  }

  loadOrders(): void {
    this.loading.set(true);
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Não foi possível carregar os pedidos.');
      },
    });
  }

  addItem(): void {
    if (!this.selectedProductId) {
      this.message.set('Selecione um produto para adicionar ao pedido.');
      return;
    }

    if (this.selectedQuantity <= 0) {
      this.message.set('A quantidade deve ser maior que zero.');
      return;
    }

    const existing = this.draftItems.find((item) => item.productId === this.selectedProductId);
    if (existing) {
      existing.quantity += this.selectedQuantity;
    } else {
      this.draftItems.push({
        productId: this.selectedProductId,
        quantity: this.selectedQuantity,
      });
    }

    this.selectedProductId = 0;
    this.selectedQuantity = 1;
    this.message.set('Item adicionado ao pedido.');
  }

  removeItem(productId: number): void {
    this.draftItems = this.draftItems.filter((item) => item.productId !== productId);
  }

  submitOrder(): void {
    if (!this.selectedClientId) {
      this.message.set('Selecione um cliente para criar o pedido.');
      return;
    }

    if (this.draftItems.length === 0) {
      this.message.set('Adicione ao menos um item ao pedido.');
      return;
    }

    this.ordersService
      .createOrder({
        clientId: this.selectedClientId,
        items: this.draftItems,
      })
      .subscribe({
        next: (order) => {
          this.orders.update((current) => [order, ...current]);
          this.selectedClientId = 0;
          this.draftItems = [];
          this.message.set('Pedido criado com sucesso.');
        },
        error: () => {
          this.message.set('Não foi possível criar o pedido.');
        },
      });
  }

  updateStatus(order: Order, status: string): void {
    this.ordersService.updateStatus(order.id ?? 0, status as Order['status']).subscribe({
      next: (updatedOrder) => {
        this.orders.update((current) =>
          current.map((item) => (item.id === updatedOrder.id ? updatedOrder : item)),
        );
        this.message.set(`Status do pedido atualizado para ${updatedOrder.status}.`);
      },
      error: () => {
        this.message.set('Não foi possível atualizar o status do pedido.');
      },
    });
  }

  getProductName(productId: number): string {
    const product = this.products().find((item) => item.id === productId);
    return product?.name ?? 'Produto';
  }
}
