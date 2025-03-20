import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    products: [],
    categories: [],
    cart: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
      state.categories = [...new Set(products.map(product => product.category))];
    },
    addToCart(state, product) {
      const item = state.cart.find(item => item.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
    },
    updateQuantity(state, { productId, quantity }) {
        const item = state.cart.find(item => item.id === productId);
        if (item && !isNaN(quantity) && quantity >= 1) {
          item.quantity = quantity;
        }
      }
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        commit('setProducts', response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    removeFromCart({ commit }, productId) {
      commit('removeFromCart', productId);
    },
    updateQuantity({ commit }, payload) {
      commit('updateQuantity', payload);
    }
  },
  getters: {
    filteredProducts: (state) => (searchQuery, selectedCategories) => {
      return state.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return matchesSearch && matchesCategory;
      });
    },
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    cartItems: state => state.cart,
    totalPrice: state => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }
});