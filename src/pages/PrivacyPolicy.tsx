import React from "react";

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      number: "1",
      title: "Scope",
      content: (
        <>
          <p>
            This Privacy Policy applies to all data collected through the Singerlia website, mobile applications, customer support channels, and
            promotional activities.
          </p>
        </>
      ),
    },
    {
      number: "2",
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-3 font-semibold">We may collect and process the following categories of information:</p>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">a) Personal Identification Information:</p>
              <p className="ml-4">Full name, email address, phone number, date of birth, nationality, and identification details (if required for verification).</p>
            </div>
            <div>
              <p className="font-semibold mb-1">b) Account & Payment Information:</p>
              <p className="ml-4">Profile details, event details, location data, and preferences, and Communication history between clients and artists.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">c) Account Information:</p>
              <p className="ml-4">Username, passwords, security questions, and communication preferences.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">d) Technical Data:</p>
              <p className="ml-4">IP address, browser type, device information, operating system, log files, and interaction data for analytics.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">e) Marketing & Communication Preferences:</p>
              <p className="ml-4">Your subscription choices for newsletters, offers, or event updates.</p>
            </div>
          </div>
          <p className="mt-4">
            Singerlia does not collect or store payment card or bank information. All payments are processed securely by licensed third-party
            payment processors (e.g., Stripe, PayPal, HyperPay). In compliance with Saudi and ICC Financials.
          </p>
        </>
      ),
    },
    {
      number: "3",
      title: "How We Collect Data",
      content: (
        <>
          <p className="mb-3 font-semibold">Direct Interactions:</p>
          <p className="ml-4 mb-3">When you register, create an account, or contact support.</p>
          <p className="mb-3 font-semibold">Automated Technologies:</p>
          <p className="ml-4 mb-3">Via cookies and similar tools when you navigate the Platform.</p>
          <p className="mb-3 font-semibold">Third-party Sources:</p>
          <p className="ml-4">From social media logins or partner platforms (with your consent).</p>
        </>
      ),
    },
    {
      number: "4",
      title: "Lawful Basis for Processing",
      content: (
        <>
          <p className="mb-3 font-semibold">We process your data based on:</p>
          <ul className="space-y-1 ml-4">
            <li>• Consent: For optional marketing or promotional materials.</li>
            <li>• Contract: To provide services and manage bookings.</li>
            <li>• Legal Obligation: To comply with applicable Saudi laws and regulations.</li>
            <li>• Legitimate Interest: To prevent fraud, ensure security, and improve services.</li>
          </ul>
        </>
      ),
    },
    {
      number: "5",
      title: "How We Use Your Information",
      content: (
        <>
          <p className="mb-3">Singerlia uses your data to provide services:</p>
          <ul className="space-y-1 ml-4">
            <li>• Facilitate bookings and event coordination.</li>
            <li>• Communicate with you regarding events, support, and updates.</li>
            <li>• Enhance user experience and personalize content.</li>
            <li>• Process payments and manage transactions.</li>
            <li>• Comply with legal requirements and enforce platform policies.</li>
          </ul>
        </>
      ),
    },
    {
      number: "6",
      title: "Sharing Your Information",
      content: (
        <>
          <p className="mb-3 font-semibold">We may share limited data with:</p>
          <ul className="space-y-1 ml-4">
            <li>• Payment Processors to complete transactions.</li>
            <li>• Service Providers assisting us in operations (e.g., hosting services).</li>
            <li>• Legal Authorities when required by law or court orders.</li>
            <li>• Business Transfers in the event of a merger or acquisition.</li>
          </ul>
          <p className="mt-3">We do not sell or rent your personal data to third parties.</p>
        </>
      ),
    },
    {
      number: "7",
      title: "International Data Transfers",
      content: (
        <>
          <p>
            Some Data may be stored or processed on secure servers located in the Kingdom of Saudi Arabia or other ICC-approved regions with
            equivalent protection levels. Appropriate legal safeguards are maintained for any cross-border transfer.
          </p>
        </>
      ),
    },
    {
      number: "8",
      title: "Data Security",
      content: (
        <>
          <p className="mb-3 font-semibold">We employ robust security measures including:</p>
          <ul className="space-y-1 ml-4">
            <li>• SSL/TLS encryption for all connections.</li>
            <li>• Secure data storage with access controls.</li>
            <li>• Regular security audits and penetration testing.</li>
            <li>• User-based access levels.</li>
          </ul>
          <p className="mt-3">
            Despite our efforts, no system is entirely secure. Notify us immediately of any suspected unauthorized access or any use, link
            breach or incident.
          </p>
        </>
      ),
    },
    {
      number: "9",
      title: "Data Retention and Destruction",
      content: (
        <>
          <p>
            Personal data is retained only as long as necessary for the purposes it was collected and to comply with legal obligations.
            Inactive files were 12 accounting records. When no longer required, data is securely deleted or anonymized in accordance with our
            data retention schedule.
          </p>
        </>
      ),
    },
    {
      number: "10",
      title: "Your Rights Under the PDPL",
      content: (
        <>
          <p className="mb-3 font-semibold">You have the right to:</p>
          <ul className="space-y-1 ml-4">
            <li>• Access your personal data.</li>
            <li>• Correct inaccurate or incomplete data.</li>
            <li>• Request deletion where no longer needed.</li>
            <li>• Object to processing for marketing purposes.</li>
            <li>• Withdraw consent for optional data use at any time (excluding before withdrawal).</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact us at privacy@singerlia.com.</p>
        </>
      ),
    },
    {
      number: "11",
      title: "Cookies and Tracking Technologies",
      content: (
        <>
          <p>
            Singerlia uses cookies and similar storage technologies (e.g., web beacons, pixels, and analytic tags). We may already cookies through our
            browser settings; however, this may limit certain features. For details, refer to our Cookie Policy.
          </p>
        </>
      ),
    },
    {
      number: "12",
      title: "Email and Communication",
      content: (
        <>
          <p>
            When you sign up, you may receive emails or emails with your information may be logged for our internal and may relate the
            content of marketing communication. To unsubscribe or update preferences, use the link in any communication or contact support.
          </p>
        </>
      ),
    },
    {
      number: "13",
      title: "Data Breach Response",
      content: (
        <>
          <p>
            In the event of a data breach, Singerlia will notify the relevant authorities within 72 hours and affected users without undue delay in
            accordance with the PDPL.
          </p>
        </>
      ),
    },
    {
      number: "14",
      title: "Third-Party Links",
      content: (
        <>
          <p>
            Our Platform may contain links to external websites or embedded content. Singerlia is not responsible for the privacy practices or
            content of third-party sites. We encourage you to review their privacy policies before providing any personal data.
          </p>
        </>
      ),
    },
    {
      number: "15",
      title: "Children's Privacy",
      content: (
        <>
          <p>
            Singerlia services are not intended for children under 18 years of age. If such data is inadvertently collected, it will be
            deleted promptly.
          </p>
        </>
      ),
    },
    {
      number: "16",
      title: "Changes to This Policy",
      content: (
        <>
          <p>
            We may update this Policy from time to time. The updated version will be posted on our Platform with a revised "last updated" date.
            Continued use of Singerlia constitutes acceptance of the new terms.
          </p>
        </>
      ),
    },
    {
      number: "17",
      title: "Data Protection Officer (DPO)",
      content: (
        <>
          <p className="mb-3">
            For any inquiries regarding data processing, contact our DPO responsible for overseeing compliance with the PDPL and privacy best practices:
          </p>
          <div className="space-y-1 ml-4">
            <p><strong>Email:</strong> dpo@singerlia.com</p>
            <p><strong>Address:</strong> Riyadh, Kingdom of Saudi Arabia</p>
          </div>
        </>
      ),
    },
    {
      number: "18",
      title: "Contact Us",
      content: (
        <>
          <p>
            For any questions or concerns regarding your privacy or any of our data-handling practices, please contact:
            support@singerlia.com | Riyadh, Saudi Arabia
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
            <h1 className="text-xl text-black font-normal mb-2">Singerlia</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-black">Privacy Policy</h2>
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
              Singerlia Entertainment Technology LLC ("Singerlia," "we," "us," or "our") takes your privacy very is committed to protecting your
              personal data in accordance with the Saudi Personal Data Protection Law (PDPL). This Privacy Policy explains what personal
              information we collect, how we use, store, and protect it, and your rights under applicable data protection laws.
            </p>
            <p>
              By accessing or using Singerlia (the Privacy Policy. We may update this Policy periodically. Your continued use of the Platform after
              updates indicates your acceptance of the changes.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
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

export default PrivacyPolicy;
