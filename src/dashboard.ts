import { ProductManager } from "./product.js";
import { OrderManager } from "./order.js";

interface DashboardData {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    bestSellingProduct: {
        name: string;
        quantity: number;
    };
}

export class DashboardManager {
    private productManager: ProductManager = new ProductManager();
    private orderManager: OrderManager = new OrderManager();

    private dashboardData: DashboardData = {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        bestSellingProduct: {
            name: "",
            quantity: 0
        }
    };

    constructor() {
        this.initialize();
    }

    async initialize() {
        await this.productManager.initialize();
        await this.orderManager.initialize();

        await this.calculateDashboardData();
    }

    async calculateDashboardData(): Promise<void> {
    const products = await this.productManager.getAllProducts();
    const orders = await this.orderManager.getAllOrders();

    this.dashboardData.totalProducts = products.length;
    this.dashboardData.totalOrders = orders.length;

    this.dashboardData.totalSales = orders.reduce(
        (total, order) => total + order.totalPrice,
        0
    );

    const productSalesMap: Record<number, number> = {};

    orders.forEach(order => {
        productSalesMap[order.productId] =
            (productSalesMap[order.productId] ?? 0) +
            order.quantity;
    });

    const entries = Object.entries(productSalesMap);

    if (entries.length > 0) {
        const [productId, quantity] = entries.reduce(
            (max, current) =>
                Number(current[1]) > Number(max[1])
                    ? current
                    : max
        );

        const product = products.find(
            p => p.id == Number(productId)
        );

        this.dashboardData.bestSellingProduct = {
            name:
                product?.name ??
                `Unknown Product (${productId})`,
            quantity: Number(quantity)
        };
    }
}

    getDashboardData(): DashboardData {
        return this.dashboardData;
    }
}