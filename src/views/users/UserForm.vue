<template>
  <form>
    <div class="card" v-if="isSubmitted">
      <div class="card-body">
        <h4 class="card-title">Form Data</h4>

        <p>Mail: <input type="email" v-model="userData.email"  > 
        </p>
        <!--   <p>Password: <b>{{ userData.password }}</b></p>
                <p>Satisfaction: <b>{{ userData.satisfaction }}</b></p>
                <p style="white-space: pre">Message: <b>{{ message }}</b></p>
                <p>Checkbox Options:</p>
                <ul>
                    <li v-for="item in checkboxOptions"><b>{{ item }}</b></li>
                </ul>
                <p>Gender: <b>{{ radioBoxOption }}</b></p>
                <p>Priority: <b>{{ selectedPriority }}</b></p>
                <p>Switched: <b>{{ customSwitch }}</b></p> -->
      </div>
    </div>
  </form>
</template>



<script type="module" lang="ts">
            import { user } from "@/models/user";
import { defineComponent } from 'vue'
                import axios from "axios";

export default defineComponent( {
  name: "App",
  list: "",
  data() {
return {
  list: [],
  isSubmitted: true,
     userData: user,
 };
  },
  async mounted() {
    const response = await axios.get<user>(`${import.meta.env.VITE_API_URL}/api/users/${this.$route.params['id']}`);
    this.userData = response.data;
  }});
       
</script>
