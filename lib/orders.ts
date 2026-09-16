import { supabase } from "./supabase";

type OrderData = {
  customer_name: string;
  customer_lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
};

type OrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export async function createOrder(
  order: OrderData,
  items: OrderItem[]
) {
  if (!items.length) {
    throw new Error("El carrito está vacío.");
  }

  /*
   * Comprobamos el stock de TODOS los productos
   * antes de crear el pedido.
   */
  for (const item of items) {
    const { data: product, error } = await supabase
      .from("products")
      .select("id, name, stock")
      .eq("id", item.id)
      .single();

    if (error || !product) {
      throw new Error(
        `No se ha encontrado el producto "${item.name}".`
      );
    }

    const stock = Number(product.stock) || 0;

    if (stock < item.quantity) {
      throw new Error(
        `No hay suficientes unidades de "${item.name}". Stock disponible: ${stock}.`
      );
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * Creamos el pedido solamente después de comprobar
   * que todos los productos tienen stock suficiente.
   */
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        ...order,
        user_id: user?.id ?? null,
      },
    ])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  /*
   * Restamos las unidades vendidas.
   */
  for (const item of items) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (productError || !product) {
      throw new Error(
        `No se ha podido actualizar el stock de "${item.name}".`
      );
    }

    const currentStock = Number(product.stock) || 0;

    const newStock = Math.max(
      0,
      currentStock - item.quantity
    );

    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock: newStock,
      })
      .eq("id", item.id);

    if (stockError) {
      throw stockError;
    }
  }

  return orderData;
}