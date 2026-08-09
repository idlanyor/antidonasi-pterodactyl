import http from '@/api/http';

export interface StoreProduct {
    id: number;
    name: string;
    description: string | null;
    price: number; // in sen (MYR cents)
    memory: number;
    disk: number;
    cpu: number;
    backup_limit: number;
    database_limit: number;
    allocation_limit: number;
    egg: string | null;
    node: string | null;
}

export interface StoreOrder {
    id: number;
    order_number: string;
    amount: number; // in sen
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    product: string | null;
    created_at: string | null;
    paid_at: string | null;
    server_id: number | null;
}

export interface StoreCheckoutResponse {
    order_id: number;
    order_number: string;
    status: string;
    payment_url: string;
}

export interface PaymentChannel {
    id: string;
    name: string;
    logo: string;
}

export interface GuestCheckoutRequest {
    product_id: number;
    channel?: string;
    name: string;
    email: string;
    telephone?: string;
}

export interface StoreOrderStatus {
    id: number;
    order_number: string;
    amount: number;
    status: StoreOrder['status'];
    product: string | null;
    server_id: number | null;
}

export const getStoreProducts = (): Promise<StoreProduct[]> =>
    http.get('/api/client/store/products').then(({ data }) => data.data);

export const getStoreOrders = (): Promise<StoreOrder[]> =>
    http.get('/api/client/store/orders').then(({ data }) => data.data);

export const checkoutStoreProduct = (productId: number): Promise<StoreCheckoutResponse> =>
    http.post('/api/client/store/checkout', { product_id: productId }).then(({ data }) => data.data);

export const retryStoreOrder = (orderId: number): Promise<StoreCheckoutResponse> =>
    http.post('/api/client/store/retry', { order_id: orderId }).then(({ data }) => data.data);

export const getPublicChannels = (): Promise<PaymentChannel[]> =>
    http.get('/api/store/public/channels').then(({ data }) => data.data);

export const checkoutStoreProductGuest = (data: GuestCheckoutRequest): Promise<StoreCheckoutResponse> =>
    http.post('/api/store/public/checkout', data).then(({ data }) => data.data);

export const getStoreOrderStatus = (orderId: number): Promise<StoreOrderStatus> =>
    http.get(`/api/store/public/orders/${orderId}`).then(({ data }) => data.data);
