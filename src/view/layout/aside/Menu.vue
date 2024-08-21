<template>
  <div class="pt-5 pb-15">
    <ul class="menu-nav m-0 p-0" v-for="section in filteredMenus" :key="section.title">
      <li class="menu-section">
        <h4 class="menu-text">{{ section.title }}</h4>
        <i class="menu-icon flaticon-more-v2"></i>
      </li>

      <router-link v-for="menus in section.items" :key="menus.text" :to="`${menus.to}`" v-slot="{ href, navigate, isActive, isExactActive }">
        <li v-if="!menus.children" aria-haspopup="true" data-menu-toggle="hover" class="menu-item" :class="[ isActive && 'menu-item-active', isExactActive && 'menu-item-active' ]">
          <a :href="href" class="menu-link" @click="navigate">
            <i :class="'menu-icon ' + menus.icon"></i>
            <span class="menu-text">{{ menus.text }}</span>
          </a>
        </li>

        <li v-else aria-haspopup="true" data-menu-toggle="hover" class="menu-item menu-item-submenu" v-bind:class="{
          'menu-item-open': hasActiveChildren(menus.to)
        }">
          <a href="#" class="menu-link menu-toggle">
            <i :class="'menu-icon ' + menus.icon"></i>
            <span class="menu-text"> {{ menus.text }} </span>
            <i class="menu-arrow"></i>
          </a>
          <div class="menu-submenu menu-submenu-classic menu-submenu-right">
            <ul class="menu-subnav" v-for="children in menus.children" :key="children.text">
              <router-link v-if="!children.subChildren" :to="`${children.to}`" v-slot="{ href, navigate, isActive, isExactActive }">
                <li aria-haspopup="true" data-menu-toggle="hover" class="menu-item" :class="[
                  isActive && 'menu-item-active',
                  isExactActive && 'menu-item-active'
                ]">
                  <a :href="href" class="menu-link" @click="navigate">
                    <i :class="'menu-icon ' + children.icon"></i>
                    <span class="menu-text"> {{ children.text }} </span>
                  </a>
                </li>
              </router-link>

              <li v-else aria-haspopup="true" data-menu-toggle="hover" class="menu-item menu-item-submenu" v-bind:class="{
                'menu-item-open': hasActiveChildren(children.to)
              }">
                <a href="#" class="menu-link menu-toggle">
                  <i :class="'menu-icon ' + children.icon"></i>
                  <span class="menu-text"> {{ children.text }}</span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="menu-submenu">
                  <span class="menu-arrow"></span>
                  <ul class="menu-subnav">
                    <router-link v-for="subChildren in children.subChildren" :key="subChildren.text" :to="`${subChildren.to}`" v-slot="{ href, navigate, isActive, isExactActive }">
                      <li aria-haspopup="true" data-menu-toggle="hover" class="menu-item" :class="[
                        isActive && 'menu-item-active',
                        isExactActive && 'menu-item-active'
                      ]">
                        <a :href="href" class="menu-link" @click="navigate">
                          <i :class="'menu-icon ' + subChildren.icon"></i>
                          <span class="menu-text">{{ subChildren.text }}</span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { MENUS } from './menu.ts';

export default {
  name: "KTMenu",
  data() {
    return {
      MENUS,
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
    
    userRole() {
      return this.currentUser.role;
    },
    
    filteredMenus() {
      return this.MENUS.map(section => {
        const filteredItems = section.items.map(menu => {
          if (!menu.children) {
            return this.hasRole(menu.roles) ? menu : null;
          } else {
            const filteredChildren = menu.children.map(child => {
              if (!child.subChildren) {
                return this.hasRole(child.roles) ? child : null;
              } else {
                const filteredSubChildren = child.subChildren.filter(subChild => this.hasRole(subChild.roles));
                return filteredSubChildren.length > 0 ? { ...child, subChildren: filteredSubChildren } : null;
              }
            }).filter(item => item !== null);
            return filteredChildren.length > 0 ? { ...menu, children: filteredChildren } : null;
          }
        }).filter(item => item !== null);

        return filteredItems.length > 0 ? { ...section, items: filteredItems } : null;
      }).filter(section => section !== null);
    }
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route.path.indexOf(match) !== -1;
    },
    hasRole(roles) {
      if (!roles) return true; // Jika tidak ada properti roles, tampilkan menu tersebut untuk semua pengguna
      return roles.includes(this.userRole);
    }
  }
};
</script>
