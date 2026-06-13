export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isDeleted?: boolean;
}

const API_URL = 'http://localhost:3000/products';
const productTable = document.getElementById("productTable") as HTMLTableSectionElement;
export class ProductManager {
    private products: Product[] = [];
    
    constructor() {
        this.initialize();
    }

    async initialize() {
        // Initialize with some sample products
        this.products = await fetch(API_URL)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching products:', error);
                return [];
            });
    }

    async renderProducts() {
        productTable.innerHTML = '';
        this.products.forEach(product => {
            if (!product.isDeleted) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <button onclick="editProduct('${product.id}')">Edit</button>
                    <button class="product-delete-btn">Delete</button>
                </td>
            `;
            const deleteButton = row.querySelector('.product-delete-btn') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => {
                this.deleteProduct(product.id);
            });
            productTable.appendChild(row);
            }
        });
    }

    async addProduct(product: Product): Promise<void> {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product added:', data);
            this.products.push(data);
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });
    }

    async getProductById(id: string): Promise<Product | undefined> {
        return await fetch(`${API_URL}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching product:', error);
                return undefined;
            });
    }

    getAllProducts(): Product[] {
        return this.products;
    }

    async updateProduct(id: string, updatedProduct: Partial<Product>): Promise<void> {
        const product = await this.getProductById(id);
        if (product) {
            Object.assign(product, updatedProduct);
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })
            .then(response => response.json())
            .then(data => {
                // console.log(`Product with ID ${id} updated.`, data);
                this.initialize();
                this.renderProducts();
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
        }
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.getProductById(id);
        if (product) {
            product.isDeleted = true;
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isDeleted: true })
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Product with ID ${id} marked as deleted.`, data);
                this.initialize();
                this.renderProducts();
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            }); 
        }
    }
}