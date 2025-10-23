<template>
  <div>
    <div class="form-content">
      <div class="form-content-value">
        <span :style="{'margin-right': '30px', color: color}">{{form.areaCodeListName}}　{{form.deliveryAddress}}　{{form.receiveLinkName}}　{{form.receiveLinkTel}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplicinAddress',
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: "var(--font-color)",
    },
  },
}
</script>