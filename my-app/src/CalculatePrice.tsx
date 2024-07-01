import React from "react";
import { Product } from "./Product";
import { Campaign } from "./Campaign";

interface CalculatePriceProps {
  products: Product[];
  campaigns: Campaign[];
}

const CalculatePrice: React.FC<CalculatePriceProps> = ({
  products,
  campaigns,
}) => {
  const applyDiscounts = (
    products: Product[],
    campaigns: Campaign[]
  ): number => {
    let totalPrice = products.reduce(
      (total, product) => total + product.price,
      0
    );

    const campaignCategories = new Set();
    const order = { Coupon: 1, Ontop: 2, Seasonal: 3 } as const;

    const sortedCampaigns = campaigns
      .sort((a, b) => {
        return (
          (order[a.category as keyof typeof order] || 0) -
          (order[b.category as keyof typeof order] || 0)
        );
      })
      .filter((campaign) => {
        if (campaignCategories.has(campaign.category)) return false;
        campaignCategories.add(campaign.category);
        return true;
      });

    sortedCampaigns.forEach((campaign) => {
      if (campaign.category === "Coupon") {
        if (campaign.campaign.includes("Fixed amount")) {
          totalPrice -= campaign.discount;
        } else {
          totalPrice -= (totalPrice * campaign.discount) / 100;
        }
      } else if (campaign.category === "On Top") {
        if (campaign.campaign === "Percentage discount by item category") {
          products.forEach((product) => {
            if (product.category === campaign.itemCategory) {
              const discountAmount = (product.price * campaign.discount) / 100;
              totalPrice -= discountAmount;
            }
          });
        } else if (campaign.campaign === "Percentage discount by points") {
          const maxDiscount = totalPrice * 0.2;
          const pointsDiscount = Math.min(campaign.discount, maxDiscount);
          totalPrice -= pointsDiscount;
        } else {
          totalPrice -= (totalPrice * campaign.discount) / 100;
        }
      } else if (campaign.category === "Seasonal") {
        if (campaign.campaign === "Special campaigns") {
          const { xAmount, yAmount } = campaign;
          if (xAmount && yAmount) {
            const discountMultiplier = totalPrice / xAmount;
            const totalDiscount = discountMultiplier * yAmount;
            totalPrice -= totalDiscount;
          }
        } else {
          totalPrice -= (totalPrice * campaign.discount) / 100;
        }
      }
    });

    return totalPrice < 0 ? 0 : totalPrice;
  };

  const finalPrice = applyDiscounts(products, campaigns);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{product.name}</span> -{" "}
            {product.category} - ${product.price.toFixed(1)}
          </li>
        ))}
      </ul>
      <h2 className="text-3xl font-bold mt-4">
        Final Price: ${finalPrice.toFixed(1)}
      </h2>
    </div>
  );
};

export default CalculatePrice;
