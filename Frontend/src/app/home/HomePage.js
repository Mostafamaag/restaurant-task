"use client";

import { useState, useEffect } from 'react';
import Categories from './Categories';
import Products from './Products';

export default function HomePage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            console.log("selected", selectedCategories.length);
            const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
            const token = localStorage.getItem('token');

            let url = `${backend}/api/products`;
            if (selectedCategories.length > 0) {
                url += `/categories?categories=${selectedCategories.join(',')}`;
            }
            console.log(url);
            const res = await fetch(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();
            console.log(data)
            setProducts(data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch products whenever selectedCategories changes
    }, [selectedCategories]);

    return (
        <div>
            {/* Header */}
            <header className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Product Page</h1>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><a href="#" className="hover:underline">Home</a></li>
                            <li><a href="#" className="hover:underline">Products</a></li>
                            <li><a href="#" className="hover:underline">About</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="bg-gray-100 py-8">
                <div className="container mx-auto px-4 flex gap-8">
                    <Categories
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />
                    <Products products={products} />
                </div>
            </main>


            {/* <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2023 Product Page. All Rights Reserved.</p>
                </div>
            </footer> */}
        </div>
    );
}
