import { ProductManager, Product } from "./product.js";

export interface Order {
    id: string;
    productId: string;
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
            if (!product.isDeleted) { 
            const option = document.createElement('option');
            option.value = product.id.toString();
            option.textContent = product.name;
            productSelect.appendChild(option);
            }
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
                <button onclick="editOrder('${order.id}')">
                    Edit
                </button>
                <button class="order-delete-btn">
                    Delete
                </button>
            </td>
        `;
            const deleteButton = row.querySelector('.order-delete-btn') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => {
                this.deleteOrder(order.id);
            });
            orderTable.appendChild(row);
        }
    }

    async addOrder(order: Order): Promise<void> {
        // console.log("Adding order:", order);
        const product = await this.productManager.getProductById(order.productId);
        if (product) {
            order.totalPrice = product.price * order.quantity;
            product.quantity -= order.quantity;
            if (product.quantity < 0) {
                alert(`Not enough stock for product ${product.name}. Available quantity: ${product.quantity + order.quantity}`);
                return;
            }
            // console.log("Updating product quantity:", product.id, product.quantity);
            await this.productManager.updateProduct(product.id, { quantity: product.quantity });
        } else {
            alert(`Product with ID ${order.productId} not found.`);
            return;
        }


        fetch(ORDER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
            alert('Order added successfully!');
            this.orders.push(data);
        })
        .catch(error => {
            alert('Error adding order: ' + error.message);
        });
    }

    getOrderById(id: string): Order | undefined {
        return this.orders.find(order => order.id === id);
    }

    getAllOrders(): Order[] {
        return this.orders;
    }

    updateOrder(id: string, updatedOrder: Partial<Order>): void {
        const order = this.getOrderById(id);
        if (order) {
            Object.assign(order, updatedOrder);
        }
    }

    async deleteOrder(id: string): Promise<void> {
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