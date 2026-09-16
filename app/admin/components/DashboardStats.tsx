type Props = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalSales: number;
};

export default function DashboardStats({
  totalProducts,
  totalOrders,
  totalCustomers,
  totalSales,
}: Props) {
  const cards = [
    {
      title: "Productos",
      value: totalProducts,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Pedidos",
      value: totalOrders,
      icon: "🛒",
      color: "bg-purple-500",
    },
    {
      title: "Clientes",
      value: totalCustomers,
      icon: "👥",
      color: "bg-green-500",
    },
    {
      title: "Ventas",
      value: `${totalSales.toFixed(2)} €`,
      icon: "💶",
      color: "bg-black",
    },
  ];

  return (
    <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white p-6 shadow-lg"
        >
          <div
            className={`mb-5 inline-flex rounded-2xl ${card.color} p-4 text-3xl text-white`}
          >
            {card.icon}
          </div>

          <h3 className="text-gray-500">
            {card.title}
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}