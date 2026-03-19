/** Product categories for MODI.vn */
export const ProductCategory = {
    BEDROOM: 'BEDROOM',
    LIVING_ROOM: 'LIVING_ROOM',
    APARTMENT: 'APARTMENT',
    SMART: 'SMART',
    COMBO: 'COMBO',
} as const;
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

export const ProductCategoryLabels: Record<ProductCategory, string> = {
    BEDROOM: 'Phòng Ngủ',
    LIVING_ROOM: 'Phòng Khách',
    APARTMENT: 'Căn Hộ Dịch Vụ',
    SMART: 'Smart Furniture',
    COMBO: 'Combo Tiết Kiệm',
};

export const ProductCategoryIcons: Record<ProductCategory, string> = {
    BEDROOM: '🛏️',
    LIVING_ROOM: '🛋️',
    APARTMENT: '🏢',
    SMART: '💡',
    COMBO: '📦',
};

/** Material types */
export const MaterialType = {
    MDF: 'MDF',
    MFC: 'MFC',
    NATURAL_WOOD: 'NATURAL_WOOD',
    METAL: 'METAL',
    FABRIC: 'FABRIC',
    LEATHER: 'LEATHER',
    MIXED: 'MIXED',
} as const;
export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType];

export const MaterialTypeLabels: Record<MaterialType, string> = {
    MDF: 'Gỗ MDF',
    MFC: 'Gỗ MFC',
    NATURAL_WOOD: 'Gỗ Tự Nhiên',
    METAL: 'Kim Loại',
    FABRIC: 'Vải',
    LEATHER: 'Da',
    MIXED: 'Hỗn Hợp',
};

/** Product status */
export const ProductStatus = {
    IN_STOCK: 'IN_STOCK',
    PRE_ORDER: 'PRE_ORDER',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const ProductStatusLabels: Record<ProductStatus, string> = {
    IN_STOCK: 'Còn hàng',
    PRE_ORDER: 'Đặt trước',
    OUT_OF_STOCK: 'Hết hàng',
};

/** Order status */
export const OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PRODUCING: 'PRODUCING',
    SHIPPING: 'SHIPPING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatus, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PRODUCING: 'Đang sản xuất',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
};

export const PaymentMethod = {
    COD: 'COD',
    BANK_TRANSFER: 'BANK_TRANSFER',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const UserRole = {
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/** Interfaces */
export interface Product {
    id: string;
    name: string;
    slug: string;
    category: ProductCategory;
    material: MaterialType;
    dimensions: string;
    price: number;
    salePrice?: number;
    images: string[];
    description: string;
    features: string[];
    status: ProductStatus;
    rating: number;
    reviewCount: number;
    colors: string[];
    sku: string;
    collectionId?: string;
    collectionName?: string;
    created: string;
    updated: string;
}

export interface OrderItem {
    id: string;
    order: string;
    product: string;
    quantity: number;
    unitPrice: number;
    color: string;
    created: string;
    updated: string;
}

export interface Order {
    id: string;
    customer: string;
    items: OrderItem[];
    totalAmount: number;
    shippingFee: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    phone: string;
    notes: string;
    created: string;
    updated: string;
}

export interface Review {
    id: string;
    product: string;
    user: string;
    userName: string;
    rating: number;
    comment: string;
    images: string[];
    created: string;
}

/** Helper */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function formatPriceShort(price: number): string {
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(1).replace('.0', '') + ' triệu';
    if (price >= 1_000) return (price / 1_000).toFixed(0) + 'K';
    return formatPrice(price);
}
