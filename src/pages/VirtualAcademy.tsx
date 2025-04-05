import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, Calendar, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const VirtualAcademy = () => {
  const courses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly course.",
      level: "Beginner",
      duration: "4 weeks",
      instructor: "John Kamau",
      students: 125,
      image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      title: "Advanced Data Science with Python",
      description: "Dive into data analysis, machine learning, and visualization using Python.",
      level: "Advanced",
      duration: "8 weeks",
      instructor: "Mary Wambui",
      students: 87,
      image: "https://images.unsplash.com/photo-1581094794329-c8112c37e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications using React Native.",
      level: "Intermediate",
      duration: "6 weeks",
      instructor: "David Ochieng",
      students: 102,
      image: "https://images.unsplash.com/photo-1596742578443-7682ef7b7266?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Maabara Virtual Academy
              </h1>
              <p className="text-xl mb-8 text-eventPurple-100">
                Expand your knowledge and skills with our online courses. Learn at your own pace from industry experts.
              </p>
              <Button size="lg" className="bg-white text-eventPurple-700 hover:bg-gray-100">
                Browse All Courses
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Virtual Academy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our virtual learning platform offers high-quality education with flexibility and support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-eventPurple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
                <p className="text-gray-600">Learn from industry professionals with practical experience</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-eventPurple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">On-Demand Videos</h3>
                <p className="text-gray-600">Access course content anytime, anywhere at your own pace</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-eventPurple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Support</h3>
                <p className="text-gray-600">Engage with fellow students and instructors in our online community</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-eventPurple-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Certificates</h3>
                <p className="text-gray-600">Earn certificates upon course completion to showcase your skills</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Courses */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our most popular courses and start your learning journey today
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-3 py-1 bg-eventPurple-100 text-eventPurple-700 text-xs font-medium rounded-full">
                        {course.level}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} students
                      </span>
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Instructor: {course.instructor}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button className="w-full">Enroll Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All Courses
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-eventPurple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-gray-600 mb-8">
                Join thousands of students who are already learning with Maabara Virtual Academy. Gain new skills and advance your career today.
              </p>
              <Button size="lg" className="bg-eventPurple-700 hover:bg-eventPurple-800">
                Create Free Account
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VirtualAcademy;
