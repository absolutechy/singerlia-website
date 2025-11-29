import React from "react";

const TermsAndConditions: React.FC = () => {
  const sections = [
    {
      number: "1",
      title: "Definitions",
      content: (
        <>
          <p className="mb-3">
            Throughout this Agreement, the following terms shall have the meanings set forth below:
          </p>
          <ul className="space-y-2 ml-4">
            <li>
              <strong>• User / Client:</strong> Refers to any person who visits, registers, or uses the Platform to book or benefit from entertainment services.
            </li>
            <li>
              <strong>• Artist / Service Provider:</strong> Refers to any individual or entity offering live performance services or related activities through the Platform.
            </li>
            <li>
              <strong>• Booking:</strong> Refers to a confirmed agreement between a Client and an Artist for an event or performance.
            </li>
            <li>
              <strong>• Date:</strong> Refers to reservation provided by Users and Artists during registration or while using the Platform.
            </li>
            <li>
              <strong>• Payment Processor:</strong> Refers to any secure third-party entities (such as Stripe, PayPals, or Hyperpay) that handle secure payment transactions.
            </li>
            <li>
              <strong>• Commission:</strong> Refers to the service charge retained by Singerlia on each completed booking.
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "2",
      title: "Eligibility and Account Registration",
      content: (
        <>
          <p className="mb-3">
            Users must be at least 18 years old and legally competent to enter into this agreement. Each User or Artist must register using
            accurate and truthful information. Misrepresenting the confidentiality of login credentials is the sole responsibility of the account owner.
            Multiple accounts or impersonation of others is strictly prohibited. Singerlia may suspend or terminate any account found in
            violation of these terms.
          </p>
        </>
      ),
    },
    {
      number: "3",
      title: "Use of the Platform",
      content: (
        <>
          <p className="mb-3">
            You agree to use the Platform solely for lawful purposes and in accordance with these Terms. It is prohibited to use the Platform for
            fraudulent, harmful, or unauthorized activities, including (but limited to): Attempting illegal users or attempting
            unauthorized access to the system or other users' data.
          </p>
        </>
      ),
    },
    {
      number: "4",
      title: "Bookings and Payments",
      content: (
        <>
          <p className="mb-3">
            All bookings and payments must be processed through the Platform. Event fees are held in escrow by a licensed payment processor
            in compliance with Saudi Arabian Monetary Authority (SAMA) regulations until event completion. Upon successful completion, the
            funds are released to the Artist minus the agreed-upon commission. Clients are responsible for any applicable taxes on payments.
          </p>
          <p className="mb-3">
            Singerlia does not collect or store any credit card or banking information. All payment transactions are securely handled by
            third-party Payment Processor.
          </p>
          <p>
            All prices displayed are strictly products and may vary based to account locations.
          </p>
        </>
      ),
    },
    {
      number: "5",
      title: "Cancellations and Refunds",
      content: (
        <>
          <p className="mb-3">
            <strong>Client cancellations:</strong>
          </p>
          <ul className="space-y-1 ml-4 mb-3">
            <li>• More than 14 days before event: full refund</li>
            <li>• 7-14 days before event: 50% refund</li>
            <li>• Less than 7 days: no refund</li>
          </ul>
          <p className="mb-3">
            Artist must cancel at least 7 days prior to the scheduled event. Failure to perform without notice will result in refund issuance to the
            Client and possible account suspension. Artists may seek to be rewarded to Singerlia within 48 hours after the event.
          </p>
        </>
      ),
    },
    {
      number: "6",
      title: "Community & Conduct Guidelines",
      content: (
        <>
          <p className="mb-3">
            Singerlia strives to maintain a professional and respectful environment. Users and Artists agree to:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Maintain respectful, honesty and integrity in all interactions or reviews.</li>
            <li>• Refrain from uploading content that contains violence, nudity, illegal, obscene, or vulgar.</li>
            <li>• Avoid impersonating others or posting false information.</li>
            <li>• Avoid defamatory content about, or abuse towards, any user or entity.</li>
            <li>• Report any misuse or policy violations immediately to Singerlia.</li>
          </ul>
          <p className="mt-3">
            Violations of these rules may result in warnings, content removal, suspension, or permanent account termination.
          </p>
        </>
      ),
    },
    {
      number: "7",
      title: "Platform Rights and Obligations",
      content: (
        <>
          <p className="mb-3">
            Singerlia acts solely as a marketplace and intermediary service for Artist and clients: we are not liable or responsible
            for admission issues. We reserve the right to modify, suspend, or terminate the Platform or any of its features at any
            time without prior notice.
          </p>
          <p>
            We may (but are under no obligation to) monitor, provide NCS, hosting or payment processors to facilitate services. We are not responsible
            for errors, negligence, or service interruptions caused by such third parties.
          </p>
          <p className="mt-3">
            Singerlia reserves the right to update these T&C statistics for internal reasons, including legal, and compliance purposes.
          </p>
        </>
      ),
    },
    {
      number: "8",
      title: "User and Artist Responsibilities",
      content: (
        <>
          <p className="mb-3">
            <strong>All Users agree to:</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Provide accurate personal and booking details.</li>
            <li>• Maintain confidentiality of their account.</li>
            <li>• Pay for bookings in a timely manner and attend or assist in valid agreed on.</li>
            <li>• Comply with all applicable Saudi laws and regulations.</li>
          </ul>
          <p className="mt-3">
            Artists must honor confirmed bookings, arrive on time to deliver events, or any schedule that harms the Platform may face account
            suspension or legal action.
          </p>
        </>
      ),
    },
    {
      number: "9",
      title: "Intellectual Property Rights",
      content: (
        <>
          <p className="mb-3">
            All content, trademarks, and materials made on the Platform are the exclusive property of Singerlia. No party may copy, distribute
            or otherwise use this content without express written permission.
          </p>
          <p>
            Artists retain ownership of uploaded media but grant Singerlia a non-exclusive, royalty-free, worldwide license to use, display, and
            promote such content on the Platform and in marketing efforts.
          </p>
          <p className="mt-3">
            Users and Artists warrant that any content they upload does not infringe the intellectual property rights of others. Singerlia reserves the
            right to remove content violating these terms.
          </p>
        </>
      ),
    },
    {
      number: "10",
      title: "Limitation of Liability",
      content: (
        <>
          <p>
            To the fullest extent permitted by Saudi Arabian laws and Artists. We are not an employer, agent, or representative of any Artist.
            Singerlia is not responsible for the performance quality, cancellations, venue conditions, or any indirect, incidental, or consequential
            damages arising from individual or use of the Platform.
          </p>
        </>
      ),
    },
    {
      number: "11",
      title: "Indemnification",
      content: (
        <>
          <p>
            Users and Artists agree to indemnify and hold harmless Singerlia, its affiliates, and employees from any claims, damages, or expenses
            arising from misuse of the Platform, violation of these Terms, or infringement of third-party rights.
          </p>
        </>
      ),
    },
    {
      number: "12",
      title: "Privacy and Data Protection",
      content: (
        <>
          <p>
            Singerlia complies with the Saudi Personal Data Protection Law (PDPL). We collect and process only necessary personal information for
            account management, bookings, and payment security. Payment information is never stored on our servers. For full details, please
            refer to our Privacy Policy available on the Platform.
          </p>
        </>
      ),
    },
    {
      number: "13",
      title: "Governing Law and Dispute Resolution",
      content: (
        <>
          <p>
            These Terms and Conditions are governed by the laws of the Kingdom of Saudi Arabia. Parties shall first attempt to
            resolve disputes amicably through mediation. If unresolved, disputes shall be subject to the exclusive jurisdiction
            of the competent courts in Riyadh, Saudi Arabia.
          </p>
        </>
      ),
    },
    {
      number: "14",
      title: "Acceptance of Terms",
      content: (
        <>
          <p>
            By creating an account or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these
            Terms and Conditions.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="py-5 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="border-l-4 border-secondary pl-4">
            <h1 className="text-xl text-black mb-2">Singerlia</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Terms and Conditions</h2>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Introduction */}
        <div className="mb-12">
          <div className="border-l-4 border-secondary pl-4 mb-6">
            <h3 className="text-2xl font-bold text-primary">Introduction</h3>
          </div>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Welcome to Singerlia, a premier booking platform for live entertainment experiences ("the Platform"). By accessing, registering, or using
              Singerlia ("we," "our," or "us") and each User ("you," "your") and Artist ("Service Provider") who accesses or uses the Singerlia
              platform (the "Platform"), you agree to comply with these Terms and Conditions ("Terms").
            </p>
            <p>Please read carefully before using the Platform.</p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.number} className="scroll-mt-24" id={`section-${section.number}`}>
              <div className="border-l-4 border-secondary pl-4 mb-4">
                <h3 className="text-2xl font-bold text-primary">
                  {section.number}. {section.title}
                </h3>
              </div>
              <div className="text-gray-700 leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            Contact: support@singerlia.com | Riyadh, Saudi Arabia
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
