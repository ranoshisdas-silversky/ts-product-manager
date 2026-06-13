import { ProductManager } from "./product.js";
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

}

async function setDashboardData() {
    const dashboardData = dashboardManager.getDashboardData();
    document.getElementById("totalSales")!.textContent = dashboardData.totalSales.toString();
    document.getElementById("totalOrders")!.textContent = dashboardData.totalOrders.toString();
    document.getElementById("totalProducts")!.textContent = dashboardData.totalProducts.toString();
    document.getElementById("bestSellingProduct")!.textContent = `${dashboardData.bestSellingProduct.name} (${dashboardData.bestSellingProduct.quantity})`;
}

initializeApp();
