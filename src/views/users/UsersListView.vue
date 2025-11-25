<template>
  <div class="users">
    <h1>users</h1>
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <table id="table" class="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">BirthDate</th>
              <th scope="col">PhoneNumber</th>
              <th scope="col">CreatedAt</th>
              <th>UpdatedAt</th>
              <th>CreatedBy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in list" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
             <td>{{ getFormattedDate(user.birthDate) }}</td>
              <td>{{ user.phoneNumber }}</td>
             <td>{{ getFormattedDate(user.createdAt) }}</td>
                 <td>{{ getFormattedDate(user.updatedAt) }}</td>
              <td>{{ user.createdBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import moment from "moment";

export default {
  name: "App",
  list: "",
  data() {
    return {
      list: [],
    };
  },
  async mounted() {
    //let result = await axios.get("https://api.jokes.one/jod?category=animal");
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/list`);
    console.info(result);
    this.list = result.data;
  },
  methods: {
    getFormattedDate(date: any) {
      return moment(date).format("YYYY-MM-DD");
    },
  },
};
</script>

<style>
.users {
  min-height: 100vh;
}

table {
  width: 700px;
  border-collapse: collapse;
  font-family: Tahoma, Geneva, sans-serif;
  width: 2%;
}
table td {
  padding: 15px;
}
table thead td {
  background-color: #54585d;
  color: #ffffff;
  font-weight: bold;
  font-size: 13px;
  border: 1px solid #54585d;
}
table tbody td {
  color: #636363;
  border: 1px solid #dddfe1;
}
table tbody tr {
  background-color: #f9fafb;
}
table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}
</style>
