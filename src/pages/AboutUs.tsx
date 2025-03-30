
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-eventPurple-700">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Maabara Online, the premier platform for discovering and booking events in Kenya. 
              Founded in 2023, we connect passionate event organizers with eager attendees to create memorable experiences.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Our mission is to make event discovery and booking seamless and accessible to everyone. 
              We believe in the power of events to bring people together, foster learning, and create lasting connections.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Team</h2>
            <p className="text-gray-700 mb-6">
              We are a team of passionate professionals dedicated to creating the best event platform in Kenya. 
              With backgrounds spanning technology, event management, and customer service, we bring diverse skills to make our platform exceptional.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-eventPurple-700 text-2xl font-bold">JK</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">John Kamau</h3>
                <p className="text-sm text-gray-500">Founder & CEO</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-eventPurple-700 text-2xl font-bold">MW</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">Mary Wambui</h3>
                <p className="text-sm text-gray-500">Head of Operations</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-eventPurple-700 text-2xl font-bold">DO</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">David Ochieng</h3>
                <p className="text-sm text-gray-500">Tech Lead</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li className="text-gray-700"><strong>Innovation:</strong> Constantly improving our platform to provide the best user experience.</li>
              <li className="text-gray-700"><strong>Accessibility:</strong> Making events accessible to everyone, regardless of location or background.</li>
              <li className="text-gray-700"><strong>Reliability:</strong> Building trust through consistent, dependable service.</li>
              <li className="text-gray-700"><strong>Community:</strong> Fostering connections through memorable event experiences.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
