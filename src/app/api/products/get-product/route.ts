import { connectToDB } from "@/lib/database/connectToDB";
import { Products } from "@/lib/database/db_model/product.models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectToDB();
    const req = request.nextUrl.searchParams;
    const hasProductId = req.has("product-id");
    if (hasProductId) {
      const productId = req.get("product-id");
      const products = await Products.findOne({ _id: String(productId) });
      return NextResponse.json({ products });
    }
    const limit = req.get("limit");
    const skip = req.get("skip");
    const productCategory = req.has("category") && req.getAll("category");
    const res = productCategory
      ? await Products.find({ productCategory })
          .limit(Number(limit))
          .skip(Number(skip) || 0)
      : await Products.find({})
          .limit(Number(limit))
          .skip(Number(skip) || 0);

    const count = productCategory
      ? await Products.find({ productCategory }).countDocuments()
      : await Products.countDocuments();
    return NextResponse.json({ products: res, count });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ products: null });
  }
};
