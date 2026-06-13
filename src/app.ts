import { ProductManager,Product } from "./product.js";
import { OrderManager } from "./order.js";
import { DashboardManager } from "./dashboard.js";

const dashboardManager = new DashboardManager();
const productManager = new ProductManager();
const orderManager = new OrderManager();

async function initializeApp() {
    await productManager.initialize();
    await productManager.renderProducts();
    // await orderManager.initialize();
    await orderManager.renderOrders();

    await setDashboardData();
    await submitProductForm();

}

async function setDashboardData() {
    await dashboardManager.calculateDashboardData();
    const dashboardData = dashboardManager.getDashboardData();
    document.getElementById("totalSales")!.textContent = dashboardData.totalSales.toString();
    document.getElementById("totalOrders")!.textContent = dashboardData.totalOrders.toString();
    document.getElementById("totalProducts")!.textContent = dashboardData.totalProducts.toString();
    document.getElementById("bestSellingProduct")!.textContent = `${dashboardData.bestSellingProduct.name} (${dashboardData.bestSellingProduct.quantity})`;
}

async function submitProductForm() {
  document.getElementById("productForm")!.addEventListener("submit", async (event) => {
        event.preventDefault();
        // Handle form submission logic here
        const nameInput = document.getElementById("productName") as HTMLInputElement;
        const priceInput = document.getElementById("productPrice") as HTMLInputElement;
        const quantityInput = document.getElementById("productQuantity") as HTMLInputElement;

        const newProduct: Product = {
            id: Number(Date.now()), 
            name: nameInput.value,
            price: parseFloat(priceInput.value),
            quantity: parseInt(quantityInput.value),
            isDeleted: false
        };
        
        await productManager.addProduct(newProduct);
        await productManager.renderProducts();
        await setDashboardData();
    });
}


initializeApp();
