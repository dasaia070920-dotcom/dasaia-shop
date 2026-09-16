"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import DashboardStats from "./components/DashboardStats";

import { Product } from "@/types/product";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    await Promise.all([
      loadProducts(),
      loadOrders(),
    ]);
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(data || []);
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("email,total");

    if (error) {
      alert(error.message);
      return;
    }

    const orders = data || [];

    setTotalOrders(orders.length);

    const customers = new Set(
      orders.map((order) => order.email)
    );

    setTotalCustomers(customers.size);

    const sales = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    setTotalSales(sales);
  }

  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Dashboard
      </h1>

      <DashboardStats
        totalProducts={products.length}
        totalOrders={totalOrders}
        totalCustomers={totalCustomers}
        totalSales={totalSales}
      />

      <div className="mt-10 rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-4 text-2xl font-semibold">
          Bienvenida al panel de DASAIA
        </h2>

        <p className="mb-6 text-gray-600">
          Desde aquí podrás gestionar toda tu tienda:
          productos, pedidos, clientes, estadísticas y mucho más.
        </p>

        <Link
          href="/admin/products"
          className="inline-flex rounded-xl bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
        >
          Ir a Productos
        </Link>
            </div>
    </>
  );
}