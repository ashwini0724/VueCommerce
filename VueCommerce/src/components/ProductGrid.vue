<template>
  <div class="app-container">

    <!-- Header -->
    <header class="header">
      <div class="header-top">
        <h1 class="logo">VENIA</h1>
        <nav class="nav-menu">
          <ul>
            <li>
              <a href="#">Tops <span class="dropdown-arrow">&#9662;</span></a>
            </li>
            <li>
              <a href="#">Bottoms <span class="dropdown-arrow">&#9662;</span></a>
            </li>
            <li>
              <a href="#">Dresses <span class="dropdown-arrow">&#9662;</span></a>
            </li>
            <li>
              <a href="#">Accessories <span class="dropdown-arrow">&#9662;</span></a>
            </li>
            <li>
              <a href="#">Shop The Look <span class="dropdown-arrow">&#9662;</span></a>
            </li>
            <li>
              <a href="#">New Products <span class="dropdown-arrow">&#9662;</span></a>
            </li>
          </ul>
        </nav>


        <div class="header-icons">
          <button class="icon-button"><i class="fas fa-search"></i> Search</button>
          <button class="icon-button"><i class="fas fa-user"></i> Sign In</button>
          <button class="icon-button" @click="toggleCart">
            <i class="fas fa-shopping-cart"></i> View Cart ({{ cartItems.length }})
          </button>
        </div>
      </div>
      <div class="header-bottom">
        <div class="search-container">
          <input v-model="searchQuery" @keyup.enter="fetchProducts" placeholder="Search for Products, Brands and More"
            class="search-bar" />
          <button @click="fetchProducts" class="search-button">
            <i class="fas fa-search search-icon"></i> Search again
          </button>
        </div>
        <button @click="showFilters = !showFilters" class="filter-btn">
          <i class="fas fa-filter"></i> Filters
          <span v-if="selectedCategories.length">({{ selectedCategories.length }})</span>
        </button>

      </div>
    </header>

    <transition name="slide">
      <div v-if="showFilters" class="filters">
        <div class="filters-header">
          <button class="close-filters" @click="showFilters = false">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2>All Filters</h2>

        </div>
        <div class="filter-section">
          <h3>Categories</h3>
          <div v-for="category in categories" :key="category">
            <label>
              <input type="checkbox" v-model="selectedCategories" :value="category" />
              {{ category }}
            </label>

          </div>
          <button class="clear-filters" @click="clearFilters">
            <i class="fas fa-sync-alt"></i> Clear All
          </button>
        </div>
      </div>
    </transition>


    <!-- Sorting & Results -->
    <div class="results-container">
      <p class="results-text">
        Showing {{ filteredProducts.length }} results for <b>{{ getSearchQuery }}</b>
      </p>
      <div class="sort-container">
        <label for="sortBy">Sort by:</label>
        <select id="sortBy" v-model="sortBy" @change="sortProducts" class="sort-dropdown">
          <option value="name-asc">Name (A to Z)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
    </div>

    <!-- Product List -->
    <section class="product-list">
      <ProductDisplay v-for="product in displayedProducts" :key="product.id" :product="product" @add-to-cart="addToCart"
        @view-details="openModal" />
    </section>

    <!-- Product Detail Modal -->
    <ProductDetailModal v-if="showModal" :isOpen="showModal" :product="selectedProduct" @close-modal="closeModal"
      @add-to-cart="addToCart" />

    <div>
      <div v-for="(product, index) in paginatedProducts" :key="index">
        {{ product.name }}
      </div>

      <div v-if="hasMoreProducts" class="pagination-container">
        <button @click="loadMore" class="view-more-button">
          View More
        </button>
      </div>
    </div>

    <!-- Cart Modal -->
    <cart-modal v-if="showCart" :isOpen="showCart" :closeCart="() => (showCart = false)" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ProductDisplay from "@/components/ProductDisplay.vue";
import CartModal from "./CartModal.vue";
import ProductDetailModal from "./ProductDetailModal.vue";

export default {
  components: { ProductDisplay, CartModal, ProductDetailModal },
  data() {
    return {
      searchQuery: "",
      showFilters: false,
      selectedCategories: [],
      showCart: false,
      sortBy: "name-asc",
      itemsPerPage: 8,
      currentPage: 1,
      allProducts: [], // Full product list
      productsPerPage: 10,
      showModal: false,
      selectedProduct: null,
    };
  },
  computed: {
    ...mapState(["categories"]),
    ...mapGetters(["cartItems"]),
    filteredProducts() {
      const products = this.$store.getters.filteredProducts(
        this.searchQuery,
        this.selectedCategories
      );
      return Array.isArray(products) ? products : [];
    },
    sortedProducts() {
      const products = [...this.filteredProducts];

      switch (this.sortBy) {
        case "price-asc":
          return products.sort((a, b) => (a.price || 0) - (b.price || 0));
        case "price-desc":
          return products.sort((a, b) => (b.price || 0) - (a.price || 0));
        case "name-asc":
        default:
          return products.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      }
    },
    displayedProducts() {
      return this.sortedProducts.slice(0, this.currentPage * this.itemsPerPage);
    },
    hasMoreProducts() {
      return this.displayedProducts.length < this.sortedProducts.length;
    },
    getSearchQuery() {
      if (this.searchQuery && this.searchQuery.trim() !== "") {
        return `"${this.searchQuery}"`;
      } else if (this.selectedCategory && this.selectedCategory.trim() !== "") {
        return `"${this.selectedCategory}"`;
      }
      return `"All Products"`;
    },

  },
  methods: {
    ...mapActions(["fetchProducts", "addToCart"]),
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    sortProducts() {
      this.$forceUpdate();
    },
    loadMore() {
      this.currentPage++;
    },
    updateCategory(event) {
      this.selectedCategory = event.target.checked ? event.target.value : "";
    },
    clearFilters() {
      this.selectedCategories = [];
    },
    openModal(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
    },
    addToCart(product) {
      this.$store.dispatch("addToCart", product);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* Container */
.app-container {
  font-family: "Arial", sans-serif;
  padding: 40px 20px;
  max-width: 1200px;
  margin: auto;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  font-family: "Arial", sans-serif;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-left: -21px;
}

.nav-menu ul {
  list-style: none;
  display: flex;
  gap: 15px;
}

.nav-menu li a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
}

.header-icons {
  display: flex;
  gap: 15px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-container {
  display: flex;
  flex-grow: 1;
}

.search-bar {
  flex-grow: 1;
  padding: 8px;
  margin-right: 10px;
  margin-left: -21px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.search-icon,
.filter-icon {
  margin-right: 5px;
}

.search-button,
.filter-btn {
  padding: 14px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button {
  background-color: #d18447;
  color: white;
}

.filter-btn {
  background-color: #5a7d4f;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-btn:hover {
  background-color: #466238;
}


.search-icon {
  font-size: 18px;
  color: #fff;
  align-self: center;
}

.filter-icon {
  margin-right: 8px;
}

/* Filters */
.filters {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.filter-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.close-filters {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;
  transition: color 0.3s ease;
}

.close-filters:hover {
  color: #333;
}

.clear-filters {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 14px;
}

.clear-filters:hover {
  background-color: #cc0000;
}


/* Sorting & Results */
.results-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-text {
  font-size: 16px;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-dropdown {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Product List */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 40px;
}

/* Pagination */
.pagination-container {
  text-align: center;
  margin-top: 20px;
}

.view-more-button {
  padding: 14px 24px;
  font-size: 16px;
  background-color: #d18447;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>