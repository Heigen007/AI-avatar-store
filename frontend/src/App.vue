<template>
    {{ UserProfile.requiredVersion }} |
    {{ UserProfile.appVersion }}
  <router-view />
</template>

<script setup lang="ts">
import { UserProfile } from './models/UserProfile';


defineOptions({
  name: 'App'
});
</script>
