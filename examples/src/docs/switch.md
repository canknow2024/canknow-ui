:::demo

```html
<template>
    <div>
        <div>
            <c-switch v-model="switch1">
                <icon name="light" slot="open"></icon>
                <icon name="dark" slot="close"></icon>
            </c-switch>
            <c-switch :width="100">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </c-switch>
            <c-switch>
                <span slot="open">Open long text test</span>
                <span slot="close">Close long text test</span>
            </c-switch>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DocumentSwitch',
        data () {
            return {
                switch1: false
            }
        },
    };
</script>    
```
:::