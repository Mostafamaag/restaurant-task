import { useEffect, useState } from 'react';

export default function Categories({ selectedCategories, setSelectedCategories }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
            const token = localStorage.getItem('token');

            const res = await fetch(`${backend}/api/category`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await res.json();
            console.log(data);
            setCategories(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <aside className="bg-white shadow-md p-6 w-1/4">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            {categories.map((category) => (
                <div key={category.id} className="mb-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                        />
                        {category.name}
                    </label>
                </div>
            ))}
        </aside>
    );
}
