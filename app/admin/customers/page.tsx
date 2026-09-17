"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Customer = {
  email: string;
  customer_name: string;
  customer_lastname: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  orders: number;
  totalSpent: number;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "email, customer_name, customer_lastname, phone, address, city, postal_code, total"
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const customerMap = new Map<string, Customer>();

    for (const order of data || []) {
      const existing = customerMap.get(order.email);

      if (existing) {
        existing.orders += 1;
        existing.totalSpent += Number(order.total || 0);
      } else {
        customerMap.set(order.email, {
          email: order.email,
          customer_name: order.customer_name || "",
          customer_lastname: order.customer_lastname || "",
          phone: order.phone || "",
          address: order.address || "",
          city: order.city || "",
          postal_code: order.postal_code || "",
          orders: 1,
          totalSpent: Number(order.total || 0),
        });
      }
    }

    setCustomers(Array.from(customerMap.values()));
    setLoading(false);
  }

  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Clientes
      </h1>

      <div className="rounded-3xl bg-white p-10 shadow">
        <h2 className="mb-8 text-2xl font-semibold">
          Gestión de clientes
        </h2>

        {loading ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-400">
            Cargando clientes...
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-400">
            Todavía no hay clientes registrados.
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer.email}
                className="rounded-2xl border p-6"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {customer.customer_name}{" "}
                      {customer.customer_lastname}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {customer.email}
                    </p>

                    {customer.phone && (
                      <p className="mt-1 text-gray-500">
                        Teléfono: {customer.phone}
                      </p>
                    )}

                    {(customer.address || customer.city) && (
                      <p className="mt-1 text-gray-500">
                        {customer.address}
                        {customer.address && customer.city ? ", " : ""}
                        {customer.city}
                        {customer.postal_code
                          ? ` (${customer.postal_code})`
                          : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-8 md:text-right">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pedidos
                      </p>

                      <p className="text-2xl font-bold">
                        {customer.orders}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Gastado
                      </p>

                      <p className="text-2xl font-bold">
                        {customer.totalSpent.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}