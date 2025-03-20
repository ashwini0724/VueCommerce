<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">&times;</button>
      <img :src="product.thumbnail" :alt="product.title" class="product-image" />
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
      <p class="product-description">{{ product.description }}</p>
      
      <button @click="$emit('add-to-cart', product)" class="add-to-cart">Add to Cart</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    product: Object,
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Product Image */
.product-image {
  max-width: 100%;
  border-radius: 8px;
}

/* Product Title */
.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

/* Price */
.product-price {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

/* Add to Cart Button */
.add-to-cart {
  padding: 8px 20px;
  background-color: #406acb;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
}

.add-to-cart:hover {
  background-color: #3658a5;
}
</style>
