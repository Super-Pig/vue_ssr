<template>
  <div class="container">
    <h1>{{message}}</h1>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: "Hello world",
    };
  },
};
</script>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
</style>
