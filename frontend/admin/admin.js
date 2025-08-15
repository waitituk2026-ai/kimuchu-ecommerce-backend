document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (res.ok) {
            alert('Product added successfully!');
            e.target.reset();
        } else {
            alert('Failed to add product.');
        }
    } catch (error) {
        console.error(error);
        alert('Error adding product.');
    }
});
