import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Delicious Food, Delivered to You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Order from your favorite restaurants and enjoy meals from the comfort of your home.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Login to Start Ordering
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>&copy; 2023 Your Food Delivery. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

