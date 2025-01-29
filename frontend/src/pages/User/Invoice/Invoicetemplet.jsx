import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Template1 from "./Templete1";
import Template2 from "./Templete2";
import Template3 from "./Templete3";

export default function Invoicetemplet() {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("purple");
  const [selectedFont, setSelectedFont] = useState("font-sans");

  const [clientData, setClientData] = useState({
    name: "Acme Corp",
    date: "12/26/2024",
    dueDate: "01/26/2025",
    salespersonname: "John Doe",
    
  });

  const [items, setItems] = useState([
    {
      item : "Service 1",
      description: "Service 1",
      quantity: 2,
      price: 500.0,
      status: "paid",
      tax: 10.0,
    },
    {
      item : "Service 2",
      description: "Service 2",
      quantity: 1,
      price: 800.0,
      status: "unpaid",
      tax: 8.0,
    },
    {
      item : "Service 3",
      description: "Service 3",
      quantity: 3,
      price: 300.0,
      status: "paid",
      tax: 3.0,
    },
    {
      item : "Service 4",
      description: "Service 4",
      quantity: 5,
      price: 200.0,
      status: "unpaid",
      tax: 20.0,
    },
    {
      item : "Service 5",
      description: "Service 5",
      quantity: 4,
      price: 150.0,
      status: "paid",
      tax: 15.0,
    },
  ]);

  const [totalAmount, setTotalAmount] = useState("$1,800.00");

  const colorClasses = {
    purple: { name: "Purple", value: "#805AD5" },
    blue: { name: "Blue", value: "#4299E1" },
    red: { name: "Red", value: "#E53E3E" },
    green: { name: "Green", value: "#48BB78" },
    gray: { name: "Gray", value: "#A0AEC0" },
  };

  const fonts = [
    { name: "Sans", value: "font-sans" },
    { name: "Serif", value: "font-serif" },
    { name: "Mono", value: "font-mono" },
  ];

  // Template images
  const templateImages = [
    { name: "Modern", imgSrc: "/img/temp1.png" },
    { name: "Professional", imgSrc: "/img/temp2.png" },
    { name: "Minimal", imgSrc: "/img/temp3.png" },
  ];

  const templates = [
    { name: "Modern", component: Template1 },
    { name: "Professional", component: Template2 },
    { name: "Minimal", component: Template3 },
  ];

  const nextTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
  };

  const previousTemplate = () => {
    setCurrentTemplateIndex(
      (prev) => (prev - 1 + templates.length) % templates.length
    );
  };

  const CurrentTemplateComponent = templates[currentTemplateIndex].component;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="bg-white p-4 md:p-6 shadow rounded-lg">
          <p class Name="text-3xl font-bold mb-6">
            Customize Template
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mt-4">Template</h3>
              <div className="flex items-center justify-between">
                <button
                  className="p-2 border rounded-md hover:bg-gray-100"
                  onClick={previousTemplate}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4">
                  <img
                    src={templateImages[currentTemplateIndex].imgSrc}
                    alt={templates[currentTemplateIndex].name}
                    className="h-40 object-cover rounded-lg"
                  />
                </div>

                <button
                  className="p-2 border rounded-md hover:bg-gray-100"
                  onClick={nextTemplate}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium pb-3">Color Theme</h3>
              <div className="flex gap-2">
                {Object.entries(colorClasses).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedColor(key)}
                    style={{ backgroundColor: color.value }}
                    className={`h-8 w-8 rounded-full ${
                      selectedColor === key
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium pb-3">Font Style</h3>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white pb-3 w-full md:w-[85%] shadow rounded-lg">
            <CurrentTemplateComponent
              color={selectedColor}
              font={selectedFont}
              colorClasses={colorClasses}
              clientData={clientData}
              items={items}
              totalAmount={totalAmount}
              selectedTemplate={currentTemplateIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
