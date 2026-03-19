import PocketBase from 'pocketbase';

const PB_URL = 'https://db.mkg.vn';
const PREFIX = 'modi_';

export const pb = new PocketBase(PB_URL);

export const Collections = {
    PRODUCTS: `${PREFIX}products`,
    CATEGORIES: `${PREFIX}categories`,
    USERS: `${PREFIX}auth`,
    ORDERS: `${PREFIX}orders`,
    ORDER_ITEMS: `${PREFIX}order_items`,
    REVIEWS: `${PREFIX}reviews`,
    BLOG: `${PREFIX}blog`,
} as const;
