const adminApiUrl = process.env.NODE_ENV === "development" ? 'http://localhost:5000/admin/api/v1/' : 'https://api.anganwaditest.co.in/admin/api/v1/';
export const apiUrl = process.env.NODE_ENV === "development" ? 'http://localhost:5000/api/v1/' : 'https://api.anganwaditest.co.in/api/v1/';

export default adminApiUrl;