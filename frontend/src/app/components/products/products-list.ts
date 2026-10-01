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

  editingProductId: number | null = null;

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

  startEditProduct(product: Product): void {
    this.editingProductId = product.id ?? null;
    this.newProduct = {
      name: product.name,
      price: Number(product.price),
      isActive: Boolean(product.isActive),
    };
  }

  cancelEditProduct(): void {
    this.editingProductId = null;
    this.newProduct = { name: '', price: 0, isActive: true };
  }

  submitProduct(): void {
    const name = this.newProduct.name.trim();
    const price = Number(this.newProduct.price);

    if (!name || Number.isNaN(price) || price <= 0) {
      this.message.set('Informe nome e preço válidos para o produto.');
      return;
    }

    const request$ = this.editingProductId !== null
      ? this.productsService.updateProduct({
          id: this.editingProductId,
          name,
          price,
          isActive: this.newProduct.isActive,
        })
      : this.productsService.createProduct({
          name,
          price,
          isActive: this.newProduct.isActive,
        });

    request$.subscribe({
      next: (product) => {
        if (this.editingProductId !== null) {
          this.products.update((current) => current.map((item) => (item.id === product.id ? product : item)));
          this.message.set('Produto atualizado com sucesso.');
        } else {
          this.products.update((current) => [...current, product]);
          this.message.set('Produto cadastrado com sucesso.');
        }

        this.cancelEditProduct();
      },
      error: () => {
        this.message.set(this.editingProductId !== null ? 'Erro ao atualizar o produto.' : 'Erro ao cadastrar o produto.');
      },
    });
  }

  toggleStatus(product: Product): void {
    const nextStatus = !Boolean(product.isActive);

    this.productsService.updateStatus(product.id ?? 0, nextStatus).subscribe({
      next: (updated) => {
        this.products.update((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        this.message.set(`Produto ${updated.isActive ? 'ativado' : 'desativado'} com sucesso.`);
      },
      error: () => {
        this.message.set('Não foi possível alterar o status do produto.');
      },
    });
  }
}
