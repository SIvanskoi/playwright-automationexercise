export default {
    brands: {
        list: '/api/brandsList',
    },
    products: {
        list: '/api/productsList',
        search: '/api/searchProduct',
    },
        account: {
        create: '/api/createAccount',
        delete: '/api/deleteAccount',
        update: '/api/updateAccount',
        verify: '/api/verifyLogin',
        get: '/api/getUserDetailByEmail',
    }
};