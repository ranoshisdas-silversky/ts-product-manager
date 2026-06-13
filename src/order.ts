import { ProductManager, Product } from "./product.js";

interface Order {
    id: number;
    productId: number;
    quantity: number;
    totalPrice: number;
}

const ORDER_API_URL = 'http://localhost:3000/orders';
const orderTable = document.getElementById("orderTable") as HTMLTableSectionElement;
const productSelect = document.getElementById("productSelect") as HTMLSelectElement;

export class OrderManager {
    private orders: Order[] = [];
    private productManager: ProductManager = new ProductManager();

    constructor() {
        this.initialize();
    }

    async initialize() {
        this.orders = await fetch(ORDER_API_URL)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching orders:', error);
                return [];
            });
    }

    async renderOrders() {
        orderTable.innerHTML = '';
        productSelect.innerHTML = '';
        const products = await this.productManager.getAllProducts();
        
        products.forEach(product => {   
            const option = document.createElement('option');
            option.value = product.id.toString();
            option.textContent = product.name;
            productSelect.appendChild(option);
        });

        for (const order of this.orders) {
            let product = await this.productManager.getProductById(order.productId);
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${order.id}</td>
            <td>${product?.name ||`Unknown Product with ID ${order.productId}`}</td>
            <td>${order.quantity}</td>
            <td>${order.totalPrice}</td>
            <td>
                <button onclick="editOrder(${order.id})">
                    Edit
                </button>
                <button onclick="deleteOrder(${order.id})">
                    Delete
                </button>
            </td>
        `;
            const deleteButton = row.querySelector('button:last-child') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => {
                this.deleteOrder(order.id);
            });
            orderTable.appendChild(row);
        }
    }

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    getOrderById(id: number): Order | undefined {
        return this.orders.find(order => order.id === id);
    }

    getAllOrders(): Order[] {
        return this.orders;
    }

    updateOrder(id: number, updatedOrder: Partial<Order>): void {
        const order = this.getOrderById(id);
        if (order) {
            Object.assign(order, updatedOrder);
        }
    }

    async deleteOrder(id: number): Promise<void> {
        const order = this.getOrderById(id);
        if (order) {
            await fetch(`${ORDER_API_URL}/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                this.orders = this.orders.filter(order => order.id !== id);
                this.initialize();
                this.renderOrders();
            })
            .catch(error => {
                console.error('Error deleting order:', error);
            });
        }
    }
}  