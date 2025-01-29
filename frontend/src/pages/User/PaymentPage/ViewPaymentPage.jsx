import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPaymentPage = () => {
  const { id } = useParams(); // Get the payment ID from the URL
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Fetch the payment details based on the ID
    const fetchPaymentDetails = (id) => {
      const paymentData = {
        1: {
          date: "2024-12-15",
          payment: "Payment1",
          type: "Invoice Payment",
          referenceNumber: "12345",
          customerName: "John Doe",
          companyName: "ABC Corp",
          invoice: "INV001",
          mode: "Cash",
          amount: "$250",
          unusedCredits: "$50",
          workPhone: "123-456-7890",
          email: "john@example.com",
        },
        2: {
          date: "2024-12-15",
          payment: "Payment2",
          type: "Retainer Payment",
          referenceNumber: "67890",
          customerName: "Jane Smith",
          companyName: "XYZ Ltd",
          invoice: "INV002",
          mode: "Card",
          amount: "$400",
          unusedCredits: "$100",
          workPhone: "987-654-3210",
          email: "jane@example.com",
        },
      };
      setPaymentDetails(paymentData[id]); // Set payment data based on the ID
    };

    fetchPaymentDetails(id); // Fetch data when the component mounts
  }, [id]);

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#F6F8FB] p-5">
      <div className="bg-white rounded-lg p-5 shadow-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-5">Payment Receipt</h2>

        {/* Payment Details */}
        <div className="mb-5">
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold">Payment Date:</p>
              <p>{paymentDetails.date}</p>
            </div>
            <div>
              <p className="font-semibold">Invoice Number:</p>
              <p>{paymentDetails.invoice}</p>
            </div>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold">Payment Type:</p>
              <p>{paymentDetails.type}</p>
            </div>
            <div>
              <p className="font-semibold">Payment Mode:</p>
              <p>{paymentDetails.mode}</p>
            </div>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold">Reference Number:</p>
              <p>{paymentDetails.referenceNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Customer Name:</p>
              <p>{paymentDetails.customerName}</p>
            </div>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold">Company Name:</p>
              <p>{paymentDetails.companyName}</p>
            </div>
            <div>
              <p className="font-semibold">Work Phone:</p>
              <p>{paymentDetails.workPhone}</p>
            </div>
          </div>

          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{paymentDetails.email}</p>
            </div>
          </div>

          {/* Payment Amount & Unused Credits */}
          <div className="flex justify-between mb-3 border-t pt-3">
            <div>
              <p className="font-semibold">Amount:</p>
              <p>{paymentDetails.amount}</p>
            </div>
            <div>
              <p className="font-semibold">Unused Credits:</p>
              <p>{paymentDetails.unusedCredits}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5">
          <p className="text-gray-600 text-sm">Thank you for your payment!</p>
          <p className="text-gray-500 text-xs">
            This is a computer-generated receipt, no signature required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentPage;
