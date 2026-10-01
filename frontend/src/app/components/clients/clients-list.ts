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

  editingClientId: number | null = null;

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

  startEditClient(client: Client): void {
    this.editingClientId = client.id ?? null;
    this.newClient = { name: client.name, phone: client.phone };
  }

  cancelEditClient(): void {
    this.editingClientId = null;
    this.newClient = { name: '', phone: '' };
  }

  submitClient(): void {
    const name = this.newClient.name.trim();
    const phone = this.newClient.phone.trim();

    if (!name || !phone) {
      this.message.set('Informe nome e telefone do cliente.');
      return;
    }

    const request$ = this.editingClientId !== null
      ? this.clientsService.updateClient({ id: this.editingClientId, name, phone })
      : this.clientsService.createClient({ name, phone });

    request$.subscribe({
      next: (client) => {
        if (this.editingClientId !== null) {
          this.clients.update((current) => current.map((item) => (item.id === client.id ? client : item)));
          this.message.set('Cliente atualizado com sucesso.');
        } else {
          this.clients.update((current) => [...current, client]);
          this.message.set('Cliente cadastrado com sucesso.');
        }

        this.cancelEditClient();
      },
      error: () => {
        this.message.set(this.editingClientId !== null ? 'Erro ao atualizar o cliente.' : 'Erro ao cadastrar o cliente.');
      },
    });
  }
}
