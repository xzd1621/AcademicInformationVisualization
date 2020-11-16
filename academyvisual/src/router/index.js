import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import wordCloud from "../components/academyWordCloud";
import test from "../components/test";
import halibote from "../components/halibote";
import mnist from "../components/mnist";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },

    {
      path: '/wordCloud',
      name: 'wordCloud',
      component: wordCloud
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/halibote',
      name: 'halibote',
      component: halibote
    },
    {
      path: '/mnist',
      name: 'mnist',
      component: mnist
    },
  ]
})
