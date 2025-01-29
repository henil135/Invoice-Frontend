import React from "react";

export const TermsandCondition = () => {
  const textStyle = "text-gray-700 text-base leading-relaxed"; // Common text styling

  return (
    <div className="mx-auto max-w-4xl p-6 overflow-y-scroll h-[450px] shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Terms and Conditions
      </h1>
      <p className={`${textStyle} mb-4`}>
        Welcome to our platform. By accessing or using our services, you agree
        to be bound by these Terms and Conditions. Please read them carefully
        before proceeding.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        1. Introduction
      </h2>
      <p className={`${textStyle} mb-4`}>
        These Terms and Conditions govern your use of our website and services.
        By accessing our platform, you accept these terms in full. If you
        disagree with these terms, you must not use our services.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        2. User Responsibilities
      </h2>
      <p className={`${textStyle} mb-4`}>
        Users are expected to provide accurate information when signing up and
        must ensure that their use of the platform complies with applicable laws
        and regulations.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        3. Intellectual Property
      </h2>
      <p className={`${textStyle} mb-4`}>
        All content on this platform, including text, graphics, logos, and
        software, is owned by us or our licensors and is protected by copyright
        laws. You may not reproduce, distribute, or create derivative works from
        this content without prior permission.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        4. Limitation of Liability
      </h2>
      <p className={`${textStyle} mb-4`}>
        We are not liable for any direct, indirect, or consequential damages
        arising from your use of the platform. This includes but is not limited
        to loss of data, revenue, or profits.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        5. Changes to Terms
      </h2>
      <p className={`${textStyle} mb-4`}>
        We reserve the right to update these Terms and Conditions at any time.
        Continued use of the platform following changes indicates your
        acceptance of the new terms.
      </p>
      <p className={`${textStyle} mt-6`}>
        If you have any questions or concerns about these Terms and Conditions,
        please contact our support team.
      </p>
    </div>
  );
};
