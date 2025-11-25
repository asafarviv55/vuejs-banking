<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'


</script>

<template>
    <div class="mainDiv">
      <div id="first" class="nav">
          <nav>
              <ul>
                  <li><RouterLink to="/home">Home</RouterLink></li>
                  <li><RouterLink to="/accounts">Accounts</RouterLink></li>
                  <li><RouterLink to="/transactions">Transactions</RouterLink></li>
                  <li><RouterLink to="/transfers">Transfers</RouterLink></li>
                  <li><RouterLink to="/bills">Bill Payment</RouterLink></li>
                  <li><RouterLink to="/cards">Cards</RouterLink></li>
                  <li><RouterLink to="/loans">Loans</RouterLink></li>
                  <li><RouterLink to="/investments">Investments</RouterLink></li>
                  <li><RouterLink to="/beneficiaries">Beneficiaries</RouterLink></li>
                  <li><RouterLink to="/budgets">Budgets</RouterLink></li>
                  <li><RouterLink to="/users">Users</RouterLink></li>
              </ul>
          </nav>
      </div>
      <div id="second" >
        <RouterView />
      </div>
  </div>
</template>

<style>

  .mainDiv{
    display: block;
    align-items: center;
    text-align:center;
   
  }


	.nav {
		border:1px solid #ccc;
    border-width:1px 0;
    list-style:none;
    margin:0;
    padding:0;
	}
	
  .nav li {
	    display:inline;
	}


@import '@/assets/base.css';

  
a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
  margin: 9px;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

 
 

@media (min-width: 1024px) {
  body {
    display: flex;
  }

  #app {
    /* display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem; */
    width:1200px;
    margin: auto;
    display: block;
  }
 

  nav {
    margin-left: -1rem;
    font-size: 1.5rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
