import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const views = {
  MainLayout: () => import('@/layouts/MainLayout.vue'),
  CarList: () => import('@/views/CarList.vue'),
  CarPage: () => import('@/views/CarPage.vue'),
  NotFound: () => import('@/views/NotFound.vue'),
  CarEdit: () => import('@/views/CarEdit.vue'),
  CarEditForm: () => import('@/views/CarEditForm.vue'),
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MainLayout',
    component: views.MainLayout,
    children: [
      { path: '', name: 'CarList', component: views.CarList },
      {
        path: '/catalog/:id',
        name: 'CarPage',
        component: views.CarPage,
        props: true,
      },
      {
        path: '/edit',
        name: 'CarEdit',
        component: views.CarEdit,
      },
      {
        path: '/edit/:id',
        name: 'CarEditForm',
        component: views.CarEditForm,
        props: true,
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: views.NotFound,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
