"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiMapPin, FiPhone, FiMail, FiGlobe, } from "react-icons/fi";
import { AiOutlineTag } from "react-icons/ai";
import { MdStoreMallDirectory } from "react-icons/md";
import { Search } from "lucide-react";
import Header from "@/components/Header";

interface Store {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  mapUrl: string;
  categories: string[];
}

const stores: Store[] = [
 {
  name: "Arunodaya Collections – First Branch",
  address:
    "AVK College Road, Ishwar Complex, P.J. Extension, Davanagere – 577002",
  city: "Davangere",
  phone: "8088131360",
  email: "arunodayacollections@gmail.com",
  mapUrl:
    "https://www.google.com/maps/search/Arunodaya+Collections+AVK+College+Road+Davanagere",
  categories: [
    "Ladies Wear",
    "Men’s Wear",
    "Kids Wear",
  ],
},
{
  name: "Arunodaya Collections – Second Branch",
  address:
    "PB Road, Opposite Aahar 2000, Near Gandhi Circle, Davanagere – 577002",
  city: "Davangere",
  phone: "081528 74447",
  email: "arunodayacollections@gmail.com",
  mapUrl:
    "https://www.google.com/maps/search/Arunodaya+Collections+PB+Road+Gandhi+Circle+Davanagere",
  categories: [
    "Ladies Wear",
    "Men’s Wear",
    "Kids Wear",
    "Ready-Made Garments",
  ],
},

];

export default function StoresPage() {
  const [query, setQuery] = useState("");

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(query.toLowerCase()) ||
      store.city.toLowerCase().includes(query.toLowerCase()) ||
      store.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white pt-2">
      <div className="max-w-6xl mx-auto flex-1 py-20 px-4">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-serif text-center mb-10 text-gray-900 flex items-center justify-center gap-2">
          <MdStoreMallDirectory className="w-8 h-8 text-gray-900" />
          Our Stores
        </h1>

        {/* Search Bar */}
        <div className="flex items-center max-w-md mx-auto bg-white border border-gray-200 rounded-full px-4 py-2 mb-14 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city or area..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Store Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <div
                key={index}
                className="bg-transparent border border-gray-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">
                    {store.name}
                  </h2>
                  <p className="flex items-start text-gray-700 text-sm mb-2">
                    <FiMapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    {store.address}
                  </p>
                  <p className="flex items-center text-gray-700 text-sm mb-1">
                    <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                    {store.phone !== "NA" ? (
                      <a href={`tel:${store.phone}`} className="hover:underline">
                        {store.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">Contact soon</span>
                    )}
                  </p>
                  <p className="flex items-center text-gray-700 text-sm mb-1">
                    <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`mailto:${store.email}`} className="hover:underline">
                      {store.email}
                    </a>
                  </p>
                  {store.website && (
                    <p className="flex items-center text-gray-700 text-sm mb-2">
                      <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                      <Link href={store.website} target="_blank" className="hover:underline">
                        Visit Website
                      </Link>
                    </p>
                  )}

                  {/* Categories */}
                  <div className="mt-4">
                    <p className="flex items-center text-gray-900 font-medium mb-2">
                      <AiOutlineTag className="w-4 h-4 mr-2 text-gray-400" />
                      Available Sections
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {store.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 text-xs sm:text-sm px-2 py-1"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Luxury Map Button */}
                  <Link
                    href={store.mapUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 mt-2 px-5 py-3 text-sm font-semibold bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 text-white rounded-md shadow-lg hover:shadow-xl transition"
                  >
                    <FiMapPin className="w-5 h-5" />
                    View on Map
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700 col-span-full">
              No stores found for "{query}". Try searching by city like
              "Davangere", "Belagavi" or "Ichalkaranji".
            </p>
          )}
        </div>
      </div>
      <Header/>
      <Footer />
    </div>
  );
}
