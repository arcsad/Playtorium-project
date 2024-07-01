import React, { useState } from "react";
import { Product, Campaign } from "./Product";
import CalculatePrice from "./CalculatePrice";
import "./output.css";

const existingCampaigns: Campaign[] = [
  { campaign: "Fixed amount", category: "Coupon", discount: 0 },
  { campaign: "Percentage discount", category: "Coupon", discount: 0 },
  {
    campaign: "Percentage discount by item category",
    category: "Ontop",
    discount: 0,
  },
  {
    campaign: "Percentage discount by points",
    category: "Ontop",
    discount: 0,
  },
  { campaign: "Special campaigns", category: "Seasonal", discount: 0 },
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    category: "",
    price: 0,
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", category: "", price: 0 });
  };

  const handleCampaignSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campaignName = e.target.value;
    const campaign = existingCampaigns.find((c) => c.campaign === campaignName);
    if (
      campaign &&
      !selectedCampaigns.some((c) => c.campaign === campaignName)
    ) {
      setSelectedCampaigns([
        ...selectedCampaigns,
        { ...campaign, discount: 0 },
      ]);
    }
  };

  const handleDiscountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedCampaigns = selectedCampaigns.map((campaign, i) =>
      i === index
        ? {
            ...campaign,
            [name]:
              name === "discount" || name === "xAmount" || name === "yAmount"
                ? parseFloat(value)
                : value,
          }
        : campaign
    );
    setSelectedCampaigns(updatedCampaigns);
  };

  const handleRemoveCampaign = (campaignName: string) => {
    setSelectedCampaigns(
      selectedCampaigns.filter((c) => c.campaign !== campaignName)
    );
  };

  return (
    <div className="mt-6 w-96 ">
      <div className="max-w-4xl mx-auto p-8 ">
        <h1 className="text-3xl font-bold mb-4">Product Input</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category:
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price:
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Product
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-4">Select Campaign</h2>
        <select
          onChange={handleCampaignSelect}
          className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-4"
        >
          <option value="">Select a campaign</option>
          {existingCampaigns.map((campaign, index) => (
            <option key={index} value={campaign.campaign}>
              {campaign.campaign}
            </option>
          ))}
        </select>
        <ul className="mb-4">
          {selectedCampaigns.map((campaign, index) => (
            <li
              key={index}
              className="bg-white shadow-md rounded px-4 py-2 mb-2 flex items-center justify-between"
            >
              <div>
                <span className="font-bold">{campaign.campaign}</span> -{" "}
                {campaign.category}
                {campaign.campaign !== "Special campaigns" && (
                  <input
                    type="number"
                    name="discount"
                    value={campaign.discount}
                    onChange={(e) => handleDiscountChange(index, e)}
                    placeholder="Enter discount"
                    className="ml-2 p-1 border rounded"
                  />
                )}
                {campaign.campaign ===
                  "Percentage discount by item category" && (
                  <input
                    type="text"
                    name="itemCategory"
                    placeholder="Enter item category"
                    value={campaign.itemCategory || ""}
                    onChange={(e) => handleDiscountChange(index, e)}
                    className="ml-2 p-1 border rounded"
                  />
                )}
                {campaign.campaign === "Special campaigns" && (
                  <>
                    <input
                      type="number"
                      name="xAmount"
                      placeholder="Enter The price will reach the top."
                      value={campaign.xAmount || ""}
                      onChange={(e) => handleDiscountChange(index, e)}
                      className="ml-2 p-1 border rounded"
                    />
                    <input
                      type="number"
                      name="yAmount"
                      placeholder="Enter Discount"
                      value={campaign.yAmount || ""}
                      onChange={(e) => handleDiscountChange(index, e)}
                      className="ml-2 p-1 border rounded"
                    />
                  </>
                )}
              </div>
              <button
                onClick={() => handleRemoveCampaign(campaign.campaign)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <CalculatePrice products={products} campaigns={selectedCampaigns} />
      </div>
    </div>
  );
};

export default App;
