<template>
    <div class="c-page-header" :class="classes">
        <div class="c-page-header-wrapper">
            <div class="c-page-header-title-block" v-if="showTitleBlock" @click="onTitleClick">
                <img class="c-page-header-page-logo" :src="pageLogo" v-if="pageLogo">
                <label class="c-page-header-page-title" v-if="pageTitle">{{pageTitle}}</label>
            </div>
            <slot name="left"></slot>
            <transition name="fade">
                <nav class="c-page-header-navigation" :class="menuItemStyle">
                    <c-menu ref="pageHeaderMenu"
                          :defaultActive="activeMenuName"
                          :defaultOpens="openNames"
                          mode="horizontal">
                        <template v-for="(item, index) in menuList">
                            <c-menu-item :key="index" :route="item.path" :index="item.name" @click="changeMenu(item)">
                                <template v-if="item.icon"><icon class="c-menu-item-icon" :name="item.icon"></icon></template>
                                <span slot="title" class="c-menu-item-title">{{item[menuTitleField]}}</span>
                            </c-menu-item>
                        </template>
                    </c-menu>
                </nav>
            </transition>
            <div class="flex-adapter"></div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import Emitter from 'canknow-ui-core/src/mixins/emitter';
import { oneOf } from 'canknow-ui-core/src/utils/assist';

export default {
  name: 'CPageHeader',
  mixins: [ Emitter ],
  props: {
    onTitleClick: {
      type: Function,
      default() {

      }
    },
    showTitleBlock: {
      type: Boolean,
      default: true
    },
    menuList: Array,
    pageTitle: {
      type: String
    },
    menuItemStyle: {
      type: String,
      validator (value) {
        return oneOf(value, ['inline', 'compact']);
      },
      default: 'inline'
    },
    defaultActiveMenuName: {
      type: String
    },
    menuTitleField: {
      type: String,
      default: 'title'
    },
    pageLogo: {
      type: String
    },
    openNames: {
      type: Array
    },
    shadow: {
      type: Boolean
    },
    fixedTop: {
      type: Boolean
    }
  },
  data () {
    return {
      activeMenuName: this.defaultActiveMenuName
    };
  },
  computed: {
    classes () {
      return [
        {
          'shadow': !!this.shadow,
          'fixed-top': !!this.fixedTop,
        }
      ];
    },
  },
  methods: {
    handleMenuChange (menuName) {
      this.$emit('change', this.menuList.find(menuItem => menuItem.name === menuName));
    },
    changeMenu (item) {
      this.$emit('change', item);
    }
  }
};
</script>
