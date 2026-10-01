import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../services/products';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsListComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly message = signal('');

  newProduct = {
    name: '',
    price: 0,
    isActive: true,
  };

  constructor(private readonly productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Não foi possível carregar os produtos.');
        this.loading.set(false);
      },
    });
  }

  submitProduct(): void {
    const name = this.newProduct.name.trim();
    const price = Number(this.newProduct.price);

    if (!name || Number.isNaN(price) || price <= 0) {
      this.message.set('Informe nome e preço válidos para o produto.');
      return;
    }

    this.productsService
      .createProduct({
        name,
        price,
        isActive: this.newProduct.isActive,
      })
      .subscribe({
        next: (product) => {
          this.products.update((current) => [...current, product]);
          this.newProduct = { name: '', price: 0, isActive: true };
          this.message.set('Produto cadastrado com sucesso.');
        },
        error: () => {
          this.message.set('Erro ao cadastrar o produto.');
        },
      });
  }

  toggleStatus(product: Product): void {
    const nextStatus = !product.isActive;

    this.productsService.updateStatus(product.id ?? 0, nextStatus).subscribe({
      next: (updated) => {
        this.products.update((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      },
      error: () => {
        this.message.set('Não foi possível alterar o status do produto.');
      },
    });
  }
}
