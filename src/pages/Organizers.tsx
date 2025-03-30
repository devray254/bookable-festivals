
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckIcon } from "lucide-react";

const Organizers = () => {
  const features = [
    "Create and publish unlimited events",
    "Accept payments via M-Pesa",
    "Customizable event pages",
    "Attendee management tools",
    "Sales and attendance reports",
    "Email marketing to attendees",
    "QR code ticket scanning"
  ];

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "For individuals and small events",
      features: ["Create up to 3 events", "Basic event customization", "Standard support"],
      buttonText: "Start for Free",
      highlight: false
    },
    {
      name: "Professional",
      price: "KES 2,500/month",
      description: "For growing organizers",
      features: ["Unlimited events", "Advanced customization", "Priority support", "Analytics dashboard", "Custom branding"],
      buttonText: "Get Started",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Contact us",
      description: "For large organizations",
      features: ["Everything in Professional", "Dedicated account manager", "API access", "Custom integration", "On-site support"],
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Organize Successful Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-eventPurple-100">
              Create, promote, and manage events of any size with our powerful platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-eventPurple-700 hover:bg-gray-100 size-lg">
                  Create Your Event
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-eventPurple-600 size-lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Host Successful Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, promote, and manage your events with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start p-4">
                <div className="bg-eventPurple-100 rounded-full p-2 mr-4">
                  <CheckIcon className="h-5 w-5 text-eventPurple-700" />
                </div>
                <p className="text-gray-800 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start selling tickets today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-eventPurple-700 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Event</h3>
              <p className="text-gray-600">
                Sign up for an account and create your event with all the details.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-eventPurple-700 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Customize & Publish</h3>
              <p className="text-gray-600">
                Add photos, set ticket prices, and publish your event page.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-eventPurple-700 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Start Selling Tickets</h3>
              <p className="text-gray-600">
                Promote your event and collect payments via M-Pesa.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your event needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`border rounded-lg overflow-hidden ${
                  plan.highlight 
                    ? 'border-eventPurple-500 shadow-lg relative' 
                    : 'border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 bg-eventPurple-700 text-white text-xs font-medium py-1 text-center">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`p-6 ${plan.highlight ? 'pt-8' : ''}`}>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-eventPurple-700 mr-2 shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/register">
                    <Button 
                      className={`w-full ${
                        plan.highlight 
                          ? 'bg-eventPurple-700 hover:bg-eventPurple-800' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      variant={plan.highlight ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-eventPurple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to host your event?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of event organizers who trust BookEvent to help them create successful events.
            </p>
            <Link to="/register">
              <Button className="bg-eventPurple-700 hover:bg-eventPurple-800 size-lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Organizers;
