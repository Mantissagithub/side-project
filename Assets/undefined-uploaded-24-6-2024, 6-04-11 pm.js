const products = {
    1: {
        price: "9.99",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A sleek, reusable water bottle perfect for keeping you hydrated on the go."
    },
    2: {
        price: "29.99",
        image: "https://images.unsplash.com/photo-1621609764049-5ee1db3d7c35?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A sturdy and spacious backpack ideal for travel and daily use."
    },
    3: {
        price: "599.99",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A high-end smartphone with cutting-edge features and sleek design."
    }
};

function updateProductDetails() {
    const productSelect = document.getElementById('product');
    const selectedProduct = productSelect.value;

    if (selectedProduct) {
        const productDetails = products[selectedProduct];
        const tax = parseFloat(document.getElementById('tax').value);
        const totalPrice = (parseFloat(productDetails.price) + tax).toFixed(2);
        document.getElementById('price').textContent = `$${totalPrice}`;
        document.getElementById('product-image').src = productDetails.image;
        document.getElementById('product-description').textContent = productDetails.description;
    }
}

document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const product = document.getElementById('product').value;

    if (!cardNumber || !expiryDate || !cvv || !product) {
        alert('Please fill out all fields.');
        return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Please enter a valid 16-digit card number.');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
    }

    if (!/^\d{3}$/.test(cvv)) {
        alert('Please enter a valid 3-digit CVV.');
        return;
    }

    alert('Payment successful!');
});

// // Add event listener to the card number field
// document.getElementById('card-number').addEventListener('input', function(event) {
//     const cardNumber = event.target.value;
//     const formattedCardNumber = cardNumber.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
//     event.target.value = formattedCardNumber;
// });

// // Add event listener to the expiry date field
// document.getElementById('expiry-date').addEventListener('input', function(event) {
//     const expiryDate = event.target.value;
//     if (expiryDate.length === 2) {
//         event.target.value += '/';
//     }
// });

// Add event listener to the card number field to move cursor to the next field after filling
document.getElementById('card-number').addEventListener('input', function(event) {
    if (event.target.value.length === 16) {
        document.getElementById('expiry-date').focus();
    }
});

// Add event listener to the expiry date field to move cursor to the next field after filling
document.getElementById('expiry-date').addEventListener('input', function(event) {
    if (event.target.value.length === 5) {
        document.getElementById('cvv').focus();
    }
});

// Add event listener to the cvv field to move cursor to the submit button after filling
document.getElementById('cvv').addEventListener('input', function(event) {
    if (event.target.value.length === 3) {
        document.getElementById('checkout-form').focus();
    }
});