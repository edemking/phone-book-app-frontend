<script setup>
import Posts from './components/Posts.vue'
import { inject, reactive } from 'vue'
import { usePostsStore } from './stores/posts';
import { useToast } from "vue-toastification";

// Get toast interface
const toast = useToast();

// fetchContacts();
</script>

<template>
  <main>
    <div class="text-center mb-5">
      <h1><font-awesome-icon icon="address-book" /> Phone Book App</h1>
    </div>
    <Posts :contacts="contacts" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
