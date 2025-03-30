
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click on the 'Register' button in the navigation bar, and fill out the required information. Once you've completed the form, you'll receive a confirmation email to verify your account."
    },
    {
      question: "How do I book tickets for an event?",
      answer: "To book tickets, first browse through our events and select the one you're interested in. On the event page, click the 'Book Now' button and follow the instructions. You'll need to specify the number of tickets and provide your payment details to complete the booking."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking under certain conditions. Most events allow cancellations up to 48 hours before the event. Check the specific event's cancellation policy on its page. To cancel, log into your account, go to 'My Bookings', and select the booking you wish to cancel."
    },
    {
      question: "How do I become an event organizer?",
      answer: "To become an event organizer, click on the 'Organizers' link in the navigation menu and follow the registration process. You'll need to provide details about your organization and submit for approval. Once approved, you can create and manage your events through the organizer dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including M-Pesa, credit cards, and PayPal. The available payment options will be displayed during the checkout process."
    },
    {
      question: "How do I receive my tickets after booking?",
      answer: "After completing your booking, you'll receive an email with your e-tickets attached as a PDF. You can also access your tickets by logging into your account and going to 'My Bookings'. You can print the tickets or present them on your mobile device at the event."
    },
    {
      question: "What happens if an event is cancelled?",
      answer: "In the event of a cancellation, you'll be notified immediately via email. Refunds are typically processed within 7-10 business days. The refund policy may vary depending on the event, so please check the specific terms for each event."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. We use industry-standard encryption techniques to protect your personal and payment information. Our privacy policy details how we collect, use, and protect your data."
    },
    {
      question: "Can I transfer my tickets to someone else?",
      answer: "Yes, most tickets are transferable. Log into your account, go to 'My Bookings', select the booking you want to transfer, and choose the 'Transfer' option. You'll need to provide the recipient's email address to complete the transfer."
    },
    {
      question: "How can I contact support if I have issues?",
      answer: "If you have any issues, you can reach our support team via email at support@maabaraonline.co.ke, through the contact form on our Contact Us page, or by calling +254 712 345 678 during business hours."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-eventPurple-700">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-10">Find answers to the most common questions about our platform and services.</p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-100">
                <AccordionTrigger className="px-6 py-4 text-gray-900 hover:text-eventPurple-700">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-0 pb-4 text-gray-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 bg-eventPurple-50 rounded-lg p-6 border border-eventPurple-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Still have questions?</h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, please don't hesitate to contact our support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="inline-flex items-center text-eventPurple-700 hover:text-eventPurple-800 font-medium">
                Contact Support →
              </a>
              <a href="mailto:support@maabaraonline.co.ke" className="inline-flex items-center text-eventPurple-700 hover:text-eventPurple-800 font-medium">
                Email Us →
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
