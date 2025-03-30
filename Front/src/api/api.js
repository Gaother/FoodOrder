import axios from 'axios';
import { sub } from 'date-fns';

const API_BASE_URL = 'https://api-stock.destockdis.com/api';
// const API_BASE_URL = 'http://localhost:2700/api';

const getAuthConfig = () => {
    const JWtoken = localStorage.getItem('JWToken');
    return JWtoken ? { headers: { 'Authorization': `Bearer ${JWtoken}` } } : {};
};

const sendRequest = async (method, endpoint, data = {}) => {
    try {
        const config = getAuthConfig();
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({ method, url, data, ...config });
        // console.log(response);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const sendRequestWithoutAuth = async (method, endpoint, data = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({ method, url, data });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const api = {
    /* DB Backup */
    async getDBBackupList() {
        return sendRequest('get', '/backup/generate');
    },
    async getDBBackupItem(jsonFile) {
        return sendRequest('get', `/backup/download/${jsonFile}`);
    },
    /* Auth Methods */
    async register(user) {
        return sendRequest('post', '/users/register', user);
    },

    async login(user) {
        return sendRequestWithoutAuth('post', '/users/login', user);
    },

    async logout() {
        return sendRequest('post', '/users/logout');
    },

    async requestPasswordReset(email) {
        return sendRequestWithoutAuth('post', '/reset-password/forgot-password', email);
    },

    async resetPassword(token, password) {
        return sendRequestWithoutAuth('put', `/reset-password/${token}`, password);
    },

    /* CRUD user */
    async createUser(user) {
        return sendRequest('post', '/users', user);
    },

    async getAllUsers() {
        return sendRequest('get', '/users');
    },

    async getUserById(userId) {
        return sendRequest('get', `/users/${userId}`);
    },
    
    async updateUser(userId, user) {
        return sendRequest('put', `/users/${userId}`, user);
    },

    async deleteUser(userId) {
        return sendRequest('delete', `/users/${userId}`);
    },

    async getUserRole() {
        return sendRequest('get', '/users/role');
    },

    async getUserTeam() {
        return sendRequest('get', '/users/team');
    },

    async getUserInfo() {
        return sendRequest('get', '/users/info');
    },

    async getAllUserHistories() {
        return sendRequest('get', '/user-histories');
    },

    async markNotificationsAsRead(notificationIds) {
        return sendRequest('post', '/users/mark-as-read', { notificationIds });
    },

    async subscribeUserToPushNotifications(subscription) {
        return sendRequest('post', '/users/subscribe-to-push-notifications', subscription);
    },

    async markPushNotificationsAsSend(notificationIds) {
        return sendRequest('post', '/users/mark-push-notifications-as-send', { notificationIds });
    },

    /* Brand Methods */
    async addBrand(brand) {
        return sendRequest('post', '/brands', brand);
    },

    async getAllBrand() {
        return sendRequest('get', '/brands');
    },

    async getBrandById(id) {
        return sendRequest('get', `/brands/${id}`);
    },

    async updateBrand(id, brand) {
        return sendRequest('put', `/brands/${id}`, brand);
    },

    async deleteBrand(id) {
        return sendRequest('delete', `/brands/${id}`);
    },

    /* Product Specifications Methods */
    async addProductSpecifications(ProductSpecifications) {
        return sendRequest('post', '/product-specifications', ProductSpecifications);
    },

    async getAllProductSpecifications() {
        return sendRequest('get', '/product-specifications');
    },

    async getProductSpecificationsById(id) {
        return sendRequest('get', `/product-specifications/${id}`);
    },

    async getProductSpecificationsValueByProductSpecificationsId(id) {
        return sendRequest('get', `/product-specifications/value/${id}`);
    },

    async updateProductSpecifications(id, ProductSpecifications) {
        return sendRequest('put', `/product-specifications/${id}`, ProductSpecifications);
    },

    async deleteProductSpecifications(id) {
        return sendRequest('delete', `/product-specifications/${id}`);
    },

    /* Product Specifications Value Methods */
    async addProductSpecificationsValues(ProductSpecificationsValues) {
        return sendRequest('post', '/product-specifications-values', ProductSpecificationsValues);
    },

    async getAllProductSpecificationsValues() {
        return sendRequest('get', '/product-specifications-values');
    },

    async getProductSpecificationsValuesById(id) {
        return sendRequest('get', `/product-specifications-values/${id}`);
    },

    async updateProductSpecificationsValues(id, ProductSpecificationsValues) {
        return sendRequest('put', `/product-specifications-values/${id}`, ProductSpecificationsValues);
    },

    async deleteProductSpecificationsValues(id) {
        return sendRequest('delete', `/product-specifications-values/${id}`);
    },

    /* Product Methods */
    async addProduct(product) {
        return sendRequest('post', '/products', product);
    },

    async getAllProducts() {
        return sendRequest('get', '/products');
    },

    async getFilteredProducts(filters = {}) {
        const endpoint = '/products/filter'; // Met à jour l'endpoint si nécessaire
        const body = filters; // Le body contient l'objet des filtres dynamiques
        
        // console.log("Filters sent to the API:", body);
        
        return sendRequest('post', endpoint, body);
    },

    async getProductById(id) {
        return sendRequest('get', `/products/${id}`);
    },

    async updateProduct(id, product) {
        return sendRequest('put', `/products/${id}`, product);
    },

    async deleteProduct(id) {
        return sendRequest('delete', `/products/${id}`);
    },

    async downloadProductExcel() {
        const config = { ...getAuthConfig(), responseType: 'blob' }; // Add responseType: 'blob' to the config
        return axios.get(`${API_BASE_URL}/products/download-excel`, config);
    },

    /* Cart Methods */

    async getActiveUserCart() {
        return sendRequest('get', '/cart/active-user-cart');
    },

    async getUserCart() {
        return sendRequest('get', '/cart/user-cart');
    },
    
    async addProductToCart(body) {
        return sendRequest('post', '/cart/product', body);
    },

    async updateCart(id, body) {
        return sendRequest('put', `/cart/${id}`, body);
    },

    async removeProductInCart(body) {
        return sendRequest('delete', '/cart/product', body);
    },

    async activeCartUserAction(body) {
        return sendRequest('put', '/cart/active-cart-user-action', body);
    },

    async CartAdminAction(body) {
        return sendRequest('put', '/cart/admin-action', body);
    },

    async getFilteredCart(body) {
        return sendRequest('post', '/cart/filter', body);
    },

    async downloadCartPdf(cartId) {
        const config = { ...getAuthConfig(), responseType: 'blob' }; // Add responseType: 'blob' to the config
        return axios.get(`${API_BASE_URL}/cart/download-pdf/${cartId}`, config);
    },

    async uploadOpenSiCSVToUpdateProductStock(csv) {
        return sendRequest('post', '/products/update-stock', csv);
    },
    // /* SupportTicket Methods */
    // async createSupportTicket(ticket) {
    //     return sendRequest('post', '/supportTicket', ticket);
    // },
    // async getAllSupportTicket() {
    //     return sendRequest('get', '/supportTicket');
    // },

    // async getSupportTicketById(id) {
    //     return sendRequest('get', `/supportTicket/${id}`);
    // },

    // async updateSupportTicketById(id, ticket) {
    //     return sendRequest('put', `/supportTicket/${id}`, ticket);
    // },

    // async deleteSupportTicketById(id) {
    //     return sendRequest('delete', `/supportTicket/${id}`);
    // },

    // /* SupportTag Methods */
    // async createSupportTag(tag) {
    //     return sendRequest('post', '/supportTag', tag);
    // },

    // async getAllSupportTag() {
    //     return sendRequest('get', '/supportTag');
    // },

    // async getSupportTagById(id) {
    //     return sendRequest('get', `/supportTag/${id}`);
    // },

    // async updateSupportTagById(id, tag) {
    //     return sendRequest('put', `/supportTag/${id}`, tag);
    // },

    // async deleteSupportTagById(id) {
    //     return sendRequest('delete', `/supportTag/${id}`);
    // },

    // /* DailyReport */

    // async generateDailyReport() {
    //     return sendRequest('get', '/dailyReports/gen');
    // },

    // async getLastestDailyReport() {
    //     return sendRequest('get', '/dailyReports/latest');
    // },

    // async getDailyReportById(id) {
    //     return sendRequest('get', `/dailyReports/${id}`);
    // },

    // async getFilteredAllDailyReport({ month, day, year } = {}) {
    //     let endpoint = '/dailyReports?';
    //     const params = { month, day, year };
    //     for (const [key, value] of Object.entries(params)) {
    //         if (value !== undefined) {
    //             endpoint += `${key}=${value}&`;
    //         }
    //     }
    //     console.log(endpoint);
    //     return sendRequest('get', endpoint);
    // },

    // async getGraphDataDailyReportNbProduct() {
    //     return sendRequest('get', '/dailyReports/graph-data');
    // },

    // /* mettre ici les bon arguments et crée la route back si nécessaire*/
    // async getFilteredCustomer({ firstname, lastname, email, phone, prestashopIds, originSite, orderReference, size, page, id } = {}) {
    //     let endpoint = '/customers/filter?';
    //     let body = {};
    //     if (id) {
    //         body = { id };
    //     } else
    //         body = {};
    //     const params = { firstname, lastname, email, phone, prestashopIds, originSite, orderReference, size, page };
    //     for (const [key, value] of Object.entries(params)) {
    //         if (value !== undefined) {
    //             endpoint += `${key}=${value}&`;
    //         }
    //     }
    //     console.log(endpoint);
    //     return sendRequest('post', endpoint, body);
    // },
    

    // ... ici, vous pouvez continuer avec d'autres méthodes si nécessaire
};

export default api;

