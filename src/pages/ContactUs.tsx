
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
        duration: 5000,
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-eventPurple-700">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions or feedback? We'd love to hear from you. Fill out the form or reach us through any of the methods below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-eventPurple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      Maabara Building, 3rd Floor<br />
                      Kimathi Street<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-eventPurple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600">+254 712 345 678</p>
                    <p className="text-gray-600">+254 723 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-eventPurple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">info@maabaraonline.co.ke</p>
                    <p className="text-gray-600">support@maabaraonline.co.ke</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-medium text-gray-800 mb-4">Office Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
