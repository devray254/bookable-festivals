
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAQ = () => {
  const faqCategories = [
    {
      id: "general",
      label: "General",
      items: [
        {
          question: "What is CPD?",
          answer: "CPD stands for Continuing Professional Development. It refers to the process of tracking and documenting the skills, knowledge, and experience that you gain both formally and informally as you work, beyond any initial training. It's a record of what you experience, learn, and then apply."
        },
        {
          question: "Who needs CPD?",
          answer: "Healthcare professionals such as doctors, nurses, pharmacists, clinical officers, and other medical practitioners need CPD to maintain and enhance their knowledge and skills throughout their career."
        },
        {
          question: "What are the benefits of CPD?",
          answer: "CPD helps healthcare professionals maintain and improve their knowledge and skills, stay up-to-date with the latest developments in their field, and meet regulatory requirements for continued registration and practice."
        },
        {
          question: "How many CPD points do I need?",
          answer: "The number of CPD points required varies depending on your profession and regulatory body. Please check with your specific professional body for their requirements."
        }
      ]
    },
    {
      id: "maabara",
      label: "Maabara Online",
      items: [
        {
          question: "What is Maabara Online?",
          answer: "Maabara Online is a dedicated platform for Continuing Professional Development (CPD) for healthcare providers. It offers high-quality CPD opportunities through webinars, workshops, and online courses."
        },
        {
          question: "How do I access Maabara Online courses?",
          answer: "You can access Maabara Online courses by registering on our platform, browsing available courses, and enrolling in those that interest you. Once enrolled, you'll have access to all course materials."
        },
        {
          question: "Are Maabara Online certificates recognized?",
          answer: "Yes, Maabara Online certificates are recognized by relevant professional bodies. Our courses are designed to meet the standards set by healthcare regulatory authorities."
        },
        {
          question: "Can I attend Maabara events virtually?",
          answer: "Yes, most Maabara events are available in virtual format, allowing you to participate from anywhere. Some events may also have physical attendance options."
        }
      ]
    },
    {
      id: "technical",
      label: "Technical",
      items: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Register' button at the top of the page, fill in your details, and follow the verification steps. Once your account is created, you can log in and access our services."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click on the 'Login' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
        },
        {
          question: "What devices can I use to access Maabara Online?",
          answer: "Maabara Online is accessible on various devices including desktop computers, laptops, tablets, and smartphones. Our platform is responsive and adapts to different screen sizes."
        },
        {
          question: "Is my data secure on Maabara Online?",
          answer: "Yes, we take data security very seriously. We use encryption and follow best practices to ensure your personal and professional information is protected."
        }
      ]
    },
    {
      id: "payments",
      label: "Payments",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including M-Pesa, credit/debit cards, and bank transfers. The available payment options will be displayed during checkout."
        },
        {
          question: "Are there any refund policies?",
          answer: "Yes, we have a refund policy in place. Refunds may be issued under certain conditions, typically within 7 days of purchase and before significant course progress has been made."
        },
        {
          question: "Do you offer discounts for multiple courses?",
          answer: "Yes, we occasionally offer bundle discounts for multiple courses. We also have special rates for institutional subscriptions. Check our promotions section or contact us for more information."
        },
        {
          question: "Is there a membership fee?",
          answer: "No, there is no membership fee to join Maabara Online. You only pay for the specific courses or events you wish to attend."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-eventPurple-700">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-10">Find answers to common questions about Maabara Online and our CPD offerings.</p>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full flex justify-start overflow-x-auto mb-6 p-1">
              {faqCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-6 py-2 whitespace-nowrap"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.items.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${category.id}-item-${index}`} 
                      className="bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <AccordionTrigger className="px-6 py-4 text-gray-900 hover:text-eventPurple-700">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pt-0 pb-4 text-gray-700">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-12 bg-eventPurple-50 rounded-lg p-6 border border-eventPurple-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Still have questions?</h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, please don't hesitate to contact our support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="inline-flex items-center text-eventPurple-700 hover:text-eventPurple-800 font-medium">
                Contact Support →
              </a>
              <a href="mailto:maabarahub@gmail.com" className="inline-flex items-center text-eventPurple-700 hover:text-eventPurple-800 font-medium">
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
