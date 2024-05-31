:::demo

```html
<template>
    <div>
        <c-page-header page-title="application title" :menu-list="menus">
            <div class="page-header-right-wrap">
                <c-dropdown class="user-block-dropdown margin-right-1">
                    <div class="flex-horizontal">
                        <div class="user-info">
                            <div class="font-weight-bold">canknow</div>
                            <div>3230525823@qq.com</div>
                        </div>
                        <online-status class="component-span-left" :status="true">
                            <c-avatar size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></c-avatar>
                        </online-status>
                    </div>
                    <c-dropdown-menu slot="dropdown" class="user-block-dropdown">
                        <c-dropdown-menu-item title="item1"></c-dropdown-menu-item>
                        <c-dropdown-menu-item title="item2"></c-dropdown-menu-item>
                    </c-dropdown-menu>
                </c-dropdown>
            </div>
        </c-page-header>
        <c-page-header theme="color" page-title="application title" :menu-list="menus" class="background-color-primary">
            <div class="page-header-right-wrap">
                <c-dropdown class="user-block-dropdown margin-right-1">
                    <div class="flex-horizontal">
                        <div class="user-info">
                            <div class="font-weight-bold">canknow</div>
                            <div>3230525823@qq.com</div>
                        </div>
                        <c-online-status class="component-span-left" :status="true">
                            <c-avatar size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></c-avatar>
                        </c-online-status>
                    </div>
                    <c-dropdown-menu slot="dropdown" class="user-block-dropdown">
                        <c-dropdown-menu-item title="item1"></c-dropdown-menu-item>
                        <c-dropdown-menu-item title="item2"></c-dropdown-menu-item>
                    </c-dropdown-menu>
                </c-dropdown>
            </div>
        </c-page-header>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                menus: [
                    {
                        icon: 'user',
                        title: 'item 1',
                        name: 'item1',
                    },
                    {
                        icon: 'user',
                        title: 'item 2',
                        name: 'item2',
                    }
                ]
            };
        }
    }
</script>
```
:::
