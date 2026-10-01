import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/clients';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss',
})
export class ClientsListComponent implements OnInit {
  readonly clients = signal<Client[]>([]);
  readonly loading = signal(false);
  readonly message = signal('');

  newClient = {
    name: '',
    phone: '',
  };

  constructor(private readonly clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.clientsService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Não foi possível carregar os clientes.');
        this.loading.set(false);
      },
    });
  }

  submitClient(): void {
    const name = this.newClient.name.trim();
    const phone = this.newClient.phone.trim();

    if (!name || !phone) {
      this.message.set('Informe nome e telefone do cliente.');
      return;
    }

    this.clientsService
      .createClient({
        name,
        phone,
      })
      .subscribe({
        next: (client) => {
          this.clients.update((current) => [...current, client]);
          this.newClient = { name: '', phone: '' };
          this.message.set('Cliente cadastrado com sucesso.');
        },
        error: () => {
          this.message.set('Erro ao cadastrar o cliente.');
        },
      });
  }
}
