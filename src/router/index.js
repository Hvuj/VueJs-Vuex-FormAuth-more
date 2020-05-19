import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'event-list',
    component: () =>
      import(/* webpackChunkName:"EventList" */ '../views/EventList.vue'),
    props: true
  },
  {
    path: '/example',
    name: 'Example',
    component: () =>
      import(/* webpackChunkName:"Example" */ '../views/Example.vue')
  },
  {
    path: '/event/create',
    name: 'event-create',
    component: () =>
      import(/* webpackChunkName:"EventCreate" */ '../views/EventCreate.vue')
  },
  {
    path: '/event/:id',
    name: 'event-show',
    component: () =>
      import(/* webpackChunkName:"EventShow" */ '../views/EventShow.vue'),
    props: true,
    beforeEnter(routeTo, routeFrom, next) {
      // before this route is loaded
      store
        .dispatch('event/fetchEvent', routeTo.params.id)
        .then(event => {
          routeTo.params.event = event
          next()
        })
        .catch(error => {
          if (error.response && error.response.status == 404) {
            next({
              name: 'not-found',
              params: { resource: 'event' }
            })
          } else {
            next({ name: 'network-issue' })
          }
        })
    }
  },
  {
    path: '/nextwork-issue',
    name: 'network-issue',
    component: () =>
      import(/* webpackChunkName:"NetworkIssue" */ '../views/NetworkIssue.vue')
  },
  {
    path: '/404',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName:"Not-Found" */ '../views/NotFound.vue'),
    props: true
  },
  {
    path: '*',
    redirect: { name: 'not-found', params: { resource: 'page' } }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
