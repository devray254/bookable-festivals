
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/layout/PageBanner";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageBanner 
        title="About Maabara Online" 
        subtitle="Learn about our mission and values"
      />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white p-8 rounded-xl shadow-sm mb-10">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Welcome to Maabara Online™ a trade mark of Maabara Hub Africa LTD, a dedicated platform for Continuing Professional Development (CPD) to healthcare providers. It was founded with a vision to provide accessible, high-quality CPD opportunities for healthcare professionals. At Maabara Online, we believe in the power of knowledge and continuous learning to elevate the standards of healthcare professionals. We are on a mission to bridge the gap between evolving healthcare demands and the skills required by healthcare professionals.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold text-eventPurple-700 mt-12 mb-6">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-eventPurple-500 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-eventPurple-700">Expertise</h3>
                <p className="text-gray-700">
                  Our team comprises seasoned professionals and educators in the field of healthcare, ensuring that our CPD programs are curated with the latest industry insights.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-eventPurple-500 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-eventPurple-700">Innovation</h3>
                <p className="text-gray-700">
                  We embrace cutting-edge technology to deliver engaging and interactive learning experiences, keeping our participants at the forefront of advancements in their field.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-eventPurple-500 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-eventPurple-700">Global Reach</h3>
                <p className="text-gray-700">
                  Maabara Online™ is committed to serving professionals worldwide, fostering a community that transcends geographical boundaries and encourages diverse perspectives.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-eventPurple-600 to-eventPurple-800 text-white p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-xl leading-relaxed">
                At Maabara Online™, our mission is to empower healthcare professionals with continuous learning opportunities that enhance their knowledge, skills, and professional growth.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold text-eventPurple-700 mt-12 mb-6">Our Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-eventPurple-700">Education for Excellence</h3>
                <p className="text-gray-700">We strive to provide the highest quality educational content.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-eventPurple-700">Accessibility and Inclusivity</h3>
                <p className="text-gray-700">Making professional development accessible to all healthcare providers.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-eventPurple-700">Industry Collaboration</h3>
                <p className="text-gray-700">Working with healthcare institutions to deliver relevant content.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-eventPurple-700">Continuous Improvement</h3>
                <p className="text-gray-700">Constantly evolving our platform and offerings to meet healthcare needs.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
