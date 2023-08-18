// import router from './router';
import store from '@/store/'
import Vue from 'vue'
Vue.directive('permission', {
  inserted (el, binding) {
    const permission = binding.value; // 获取权限值
    // console.log(el);
    // const page_name = router.currentRoute.value.name; // 获取当前路由名称
    // const have_permissions = store.state.permissionArray[page_name] || ''; // 当前用户拥有的权限
    // console.log(store.state);
    const have_permissions = store.state.Common.permissionsArray
    if (!have_permissions.includes(permission)) {
      // console.log('移除了');
      el.parentElement.removeChild(el); //不拥有该权限移除dom元素
    }
  },
});
