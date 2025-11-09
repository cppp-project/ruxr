import { createRouter, createWebHashHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import ExtensionList from '../views/ExtensionList.vue';
import ExtensionShow from '../views/ExtensionShow.vue';
import CodeOfConduct from '@/views/CodeOfConduct.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainPage
    },
    {
        path: '/extensions',
        name: 'Extensions',
        component: ExtensionList
    },
    {
        path: '/extensions/:id',
        name: 'ExtensionShow',
        component: ExtensionShow
    },
    {
        path: '/code-of-conduct',
        name: "CodeOfConduct",
        component: CodeOfConduct,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: "smooth"
            };
        }
        return { top: 0 };
    }
});

export default router;
