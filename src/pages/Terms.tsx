
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-eventPurple-700">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Maabara Online. These Terms of Service govern your use of our website and services.
              By accessing or using our platform, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing or using the Maabara Online platform, you agree to be bound by these Terms of Service.
              If you do not agree to all the terms and conditions, you may not access or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-6">
              Maabara Online provides a platform for event discovery and booking in Kenya. We connect event organizers
              with attendees, facilitating the promotion, discovery, and booking of various events.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-6">
              To access certain features of our platform, you may be required to register for an account.
              You agree to provide accurate, current, and complete information during the registration process
              and to update such information to keep it accurate, current, and complete.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Booking and Payments</h2>
            <p className="text-gray-700 mb-6">
              When you book an event through our platform, you agree to pay all fees and applicable taxes associated with your booking.
              All payments are processed securely through our payment partners. Refund policies may vary by event and are set by event organizers.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
              By using our services, you consent to our collection and use of your information as described in our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              Maabara Online shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including loss of profits, data, or business opportunities arising out of or related to your use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes
              by posting the new Terms on our website. Your continued use of our services after such modifications constitutes
              your acceptance of the modified Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions or concerns about these Terms of Service, please contact us at support@maabara.co.ke.
            </p>
            
            <p className="text-gray-700 mt-8 italic">Last updated: June 2023</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
