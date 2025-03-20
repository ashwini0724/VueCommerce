<template>
    <div v-if="isOpen" class="overlay" @click.self="closeCart">
        <div class="modal" :no-close-on-backdrop="true">
            <!-- Close (X) Button -->
            <button class="close-button" @click="closeCart" noclose>×</button>

            <h2 class="cart-header">Your Cart</h2>
                  <!-- Check if cart is empty -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>"Your cart is empty! Start adding some amazing products."</p>
      </div>

            <div v-else class="cart-content">
                <!-- Cart Items -->
                <div class="cart-items">
                    <div v-for="item in cartItems" :key="item.id" class="cart-item">
                        <img :src="item.thumbnail" alt="Product image" />

                        <div class="cart-details">
                            <div class="item-name">{{ item.name }}</div>
                            <div class="item-price">${{ item.price }}</div>
                        </div>

                        <div class="quantity-controls">
                            <button @click="decrement(item.id)" class="quantity-button">-</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="increment(item.id)" class="quantity-button">+</button>
                        </div>

                        <div class="item-total">
                            ${{ (item.price * item.quantity).toFixed(2) }}
                        </div>

                        <button class="remove-button" @click="removeFromCart(item.id)">×</button>
                    </div>
                </div>

                <!-- Cart Summary (on the side) -->
                <div class="cart-summary">
                    <h3 class="summary-title">Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${{ totalPrice }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <!-- Add Coupon Code -->
                    <div class="add-coupon">
                        <a href="#" @click.prevent="applyCoupon">Add coupon code</a>
                    </div>

                    <div class="summary-total">
                        <span>Total</span>
                        <span>${{ totalPrice }}</span>
                    </div>
                    <button class="checkout-button">CHECKOUT</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    props: ["isOpen", "closeCart"],
    computed: {
        ...mapGetters(["cartItems", "totalPrice"]),
    },
    methods: {
        ...mapMutations(["removeFromCart", "updateQuantity"]),
        increment(productId) {
            const item = this.cartItems.find(item => item.id === productId);
            if (item) {
                this.updateQuantity({ productId, quantity: item.quantity + 1 });
            }
        },
        decrement(productId) {
            const item = this.cartItems.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                this.updateQuantity({ productId, quantity: item.quantity - 1 });
            }
        },
        applyCoupon() {
            alert("Coupon feature coming soon!");
        }
    },
};
</script>

<style lang="css" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: #fff;
    width: 80%;
    max-width: 1000px;
    padding: 2rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
}

.cart-header {
    font-size: 2rem;
    text-align: center;
}

.cart-content {
    display: flex;
    gap: 2rem;
}

.cart-items {
    flex: 2;
    max-height: 500px;
    overflow-y: auto;
}

.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding: 1.5rem 0;
}

.cart-item img {
    width: 80px;
    height: auto;
    margin-right: 1rem;
}

.cart-details {
    flex: 1;
    font-size: 1.1rem;
}

.item-name {
    font-weight: bold;
}

.item-price {
    color: #666;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-button {
    background: #f5f5f5;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 4px;
}

.remove-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

/* Cart Summary */
.cart-summary {
    flex: 1;
    padding: 1.5rem;
    background: #D1E5F4;
    border-radius: 8px;
    height: fit-content;
    font-size: 1.1rem;
}

.summary-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    font-size: 1rem;
}

.add-coupon {
    margin: 1rem 0;
    font-size: 1rem;
}

.add-coupon a {
    color: #2E7D32;
    text-decoration: none;
    font-weight: bold;
}

.add-coupon a:hover {
    text-decoration: underline;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: bold;
    border-top: 1px solid #ccc;
    padding-top: 1rem;
    margin-top: 1rem;
}

.checkout-button {
    background: #2E7D32;
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 8px;
    width: 100%;
    margin-top: 1rem;
}
</style>