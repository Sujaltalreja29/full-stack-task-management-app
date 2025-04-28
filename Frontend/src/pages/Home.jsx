import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Coffee, Clock, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Diverse Menu Options",
      description: "From appetizers to desserts, we've got your cravings covered."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Delivery",
      description: "Hot and fresh food delivered right to your doorstep."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Top-Rated Meals",
      description: "Enjoy our chef's special dishes with perfect flavors."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <Navbar /> */}
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-left"
              >
                <div className="inline-block px-4 py-1.5 mb-6 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  The finest dining experience
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                  <span className="block text-gray-900">Delicious Food,</span>
                  <span className="block mt-1 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Delivered to You
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-xl">
                  Experience a culinary journey with our chef-crafted meals, made with the freshest ingredients and delivered right to your doorstep.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
                  >
                    Start Ordering
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/menu"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                  >
                    Explore Menu
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-8 flex items-center text-gray-500 text-sm">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                      >
                        <img 
                          src={`https://randomuser.me/api/portraits/men/${i + 30}.jpg`} 
                          alt="User" 
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span>
                    <span className="font-medium text-orange-600">500+</span> satisfied customers this week
                  </span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative lg:h-[500px] flex items-center justify-center"
              >
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Delicious Food" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl shadow-xl p-5"
                >
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-3 rounded-full mr-4">
                      <Coffee className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">Today's Special</p>
                      <p className="text-orange-600 font-medium">25% off on Chef's Special</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl shadow-xl p-5"
                >
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-lg font-bold text-gray-800">4.9</div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Based on 2,300+ reviews</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/2 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded-xl mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call-to-Action Section */}
        <section className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Satisfy Your Cravings?</h2>
              <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who enjoy our delicious meals every day.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-orange-600 bg-white hover:bg-orange-50 transform hover:scale-105 transition-all duration-200"
              >
                Create an Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="flex items-center justify-center p-2 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-lg">
                  <UtensilsCrossed className="h-6 w-6" />
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Flavor Fusion
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Bringing the finest flavors from around the world directly to your doorstep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Menu</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Appetizers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Main Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Beverages</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Desserts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Special Offers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Order Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Delivery Information</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Payment Options</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Licensing</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Flavor Fusion. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-4">Made with ❤️ for food lovers</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Back to top</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add this to your CSS for the blob animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}