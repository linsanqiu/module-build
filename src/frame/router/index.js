import Login from '@frame/views/login';
export const constantRouterMap = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: { needAuth: false }
    }
];
