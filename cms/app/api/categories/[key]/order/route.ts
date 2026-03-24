import { NextResponse } from "next/server";
import {
  readCategoriesData,
  writeCategoriesData,
  readDuas,
  writeDuas,
  type Dua,
} from "@/lib/data";

interface OrderItem {
  type: "dua" | "subcategory";
  id: string;
  order: number;
}

interface OrderPayload {
  items: OrderItem[];
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key: categoryKey } = await params;
    const payload: OrderPayload = await request.json();

    if (!payload.items || !Array.isArray(payload.items)) {
      return NextResponse.json(
        { error: "Invalid payload: items array required" },
        { status: 400 }
      );
    }

    // Update categories.json (subcategory orders)
    const categoriesData = readCategoriesData();
    const categoryIndex = categoriesData.categories.findIndex(
      (c) => c.key === categoryKey
    );

    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Update subcategory orders
    const subcategoryOrders = new Map<string, number>();
    payload.items
      .filter((item) => item.type === "subcategory")
      .forEach((item) => {
        subcategoryOrders.set(item.id, item.order);
      });

    categoriesData.categories[categoryIndex].subcategories =
      categoriesData.categories[categoryIndex].subcategories.map((sub) => ({
        ...sub,
        order: subcategoryOrders.has(sub.key)
          ? subcategoryOrders.get(sub.key)
          : sub.order,
      }));

    writeCategoriesData(categoriesData);

    // Update duas.json (dua orders for this category)
    const duas = readDuas();
    const duaOrders = new Map<string, number>();
    payload.items
      .filter((item) => item.type === "dua")
      .forEach((item) => {
        duaOrders.set(item.id, item.order);
      });

    const updatedDuas = duas.map((dua: Dua) => {
      const duaIdStr = String(dua.id);
      if (duaOrders.has(duaIdStr)) {
        return {
          ...dua,
          order: {
            ...(dua.order || {}),
            [categoryKey]: duaOrders.get(duaIdStr),
          },
        };
      }
      return dua;
    });

    writeDuas(updatedDuas);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key: categoryKey } = await params;

    const categoriesData = readCategoriesData();
    const category = categoriesData.categories.find(
      (c) => c.key === categoryKey
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const duas = readDuas();
    const categoryDuas = duas.filter((d: Dua) =>
      d.categoryKey.includes(categoryKey)
    );

    // Build combined list
    const items: Array<{
      type: "dua" | "subcategory";
      id: string;
      nameEn: string;
      nameMy: string;
      order: number;
    }> = [];

    category.subcategories.forEach((sub, index) => {
      items.push({
        type: "subcategory",
        id: sub.key,
        nameEn: sub.nameEn,
        nameMy: sub.nameMy,
        order: sub.order ?? index + 1000,
      });
    });

    categoryDuas.forEach((dua: Dua, index: number) => {
      items.push({
        type: "dua",
        id: String(dua.id),
        nameEn: dua.titleEn,
        nameMy: dua.titleMy,
        order: dua.order?.[categoryKey] ?? index + 2000,
      });
    });

    // Sort by order
    items.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      category,
      items,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
