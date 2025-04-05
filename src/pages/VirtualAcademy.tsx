
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar } from "lucide-react";

const VirtualAcademy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Coming Soon Hero Section */}
        <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Maabara Virtual Academy
              </h1>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg inline-block mb-8">
                <p className="text-2xl md:text-3xl font-bold text-white">Coming Soon</p>
              </div>
              <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                We're working on creating an exceptional learning experience for healthcare professionals. 
                Stay tuned for our upcoming courses and professional development opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-eventPurple-700 hover:bg-gray-100">
                  <Calendar className="mr-2" />
                  Get Notified
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <BookOpen className="mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Preview Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-16 text-center text-gray-800">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-eventPurple-700" />
                </div>
                <h3 className="text-xl font-bold mb-4">Expert-Led Courses</h3>
                <p className="text-gray-600">Learn from healthcare industry leaders with practical experience and deep subject knowledge.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-eventPurple-700">
                    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2" />
                    <path d="M9 1v3" />
                    <path d="M15 1v3" />
                    <path d="M9 17v3" />
                    <path d="M15 17v3" />
                    <path d="M22 12H6" />
                    <path d="M17 12V7" />
                    <path d="M17 12v5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Flexible Learning</h3>
                <p className="text-gray-600">Access courses and materials anytime, anywhere, fitting professional development into your busy schedule.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-eventPurple-700">
                    <path d="M12 8v4l3 3" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">CPD-Accredited</h3>
                <p className="text-gray-600">Earn recognized Continuing Professional Development credits to advance your healthcare career.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-eventPurple-50 border-t border-b border-eventPurple-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Be the first to know when we launch new courses and features. Subscribe to our newsletter for updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-eventPurple-500"
                />
                <Button className="py-3">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VirtualAcademy;
