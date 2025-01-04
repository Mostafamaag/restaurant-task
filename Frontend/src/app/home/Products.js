export default function Products({ products }) {
    return (
        <section className="flex-1">
            <div className="grid grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white shadow-md rounded-md p-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="rounded-md w-full h-40 object-cover mb-4"
                        />
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        {/* <p className="text-gray-500">{product.restaurant}</p> */}
                        <p className="text-yellow-600 font-bold mt-2">Price {product.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
