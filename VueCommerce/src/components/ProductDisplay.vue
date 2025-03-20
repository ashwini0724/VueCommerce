<template>
    <div class="product-card">
        <img :src="product.thumbnail" :alt="product.title" class="product-image" />

        <h2 class="product-name">{{ product.title }}</h2>
        <p class="product-price">${{ product.price.toFixed(2) }}</p>

        <div class="button-container">
            <button @click="$emit('add-to-cart', product)" class="add-to-cart">ADD TO CART</button>
            <button @click="toggleWishlist" class="wishlist-button">
                <i :class="['heart-icon', isInWishlist ? 'fas fa-heart' : 'far fa-heart']"></i>
            </button>
        </div>
        <a href="#" @click.prevent="$emit('view-details', product)" class="view-details-link">
            View Details
        </a>
    </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

export default {
    props: ['product'],
    data() {
        return {
            isInWishlist: false,
        };
    },
    methods: {
        toggleWishlist() {
            this.isInWishlist = !this.isInWishlist;
            this.$emit('toggle-wishlist', { product: this.product, isInWishlist: this.isInWishlist });
        },
    },
};
</script>

<style scoped>
.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
    max-width: 100%;
    border-radius: 8px;
}

.product-name {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
    font-family: "Arial", sans-serif;

}

.product-price {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.add-to-cart {
    padding: 8px 38px;
    background-color: #406acb;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 7px;
}

.add-to-cart:hover {
    background-color: #3658a5;
}

.view-details-link {
    font-size: 14px;
    font-weight: 600;
    color: #007bff;
    text-decoration: underline;
    transition: color 0.3s ease, text-decoration 0.3s ease;
}

.view-details-link:hover {
    color: #0056b3;
    text-decoration: none;
}

/* Wishlist Heart Icon */
.wishlist-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #ccc;
}

.wishlist-button .heart-icon {
    transition: color 0.3s ease;
}

.wishlist-button:hover .heart-icon,
.wishlist-button .fa-heart {
    color: red;
}

.wishlist-button.selected .heart-icon {
    color: red;
}
</style>