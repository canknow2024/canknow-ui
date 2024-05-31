
:::demo
```html
<template>
    <div>
        <c-statistic-bar>
            <c-statistic-bar-item label="总用户数" :value="100"></c-statistic-bar-item>
            <c-statistic-bar-item label="新增用户数" :value="100"></c-statistic-bar-item>
            <c-statistic-bar-item label="消失用户数" :value="100"></c-statistic-bar-item>
        </c-statistic-bar>
    </div>
</template>

<script>
    export default {
        name: 'StatisticBarDemo'
    }
</script>
```
:::
