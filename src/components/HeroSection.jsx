import { use } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { label: 'Active Users', value: '25k+' },
    { label: 'Success Rate', value: '78%' },
    { label: 'Days Average', value: '45' },
    { label: 'Money Saved', value: '$500' }
  ];
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-green-700 font-semibold tracking-wide uppercase text-sm">
                BEGIN TODAY
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Journey to a <span className="text-green-600">Smoke-Free Life</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands who have successfully quit with SmartQuitIoT. Get personalized support, track progress, and achieve your smoke-free goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/login")} className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                Start Your Journey
              </button>
              <button onClick={() => navigate("/download")} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                Download App
              </button>
              <button onClick={() => navigate("/resources")} className="cursor-pointer bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-lg border-2 border-gray-300 transition-colors">
                How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Why Choose SmartQuitIoT?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Personalized quit plans</h3>
                  <p className="text-sm text-gray-600">Tailored strategies based on your smoking habits</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Achievement tracking</h3>
                  <p className="text-sm text-gray-600">Celebrate milestones and stay motivated</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">$</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Financial impact monitoring</h3>
                  <p className="text-sm text-gray-600">See how much money you're saving</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate("/about")} className="cursor-pointer w-full bg-white hover:bg-gray-50 text-green-600 font-semibold px-6 py-3 rounded-lg border-2 border-green-600 transition-colors mt-6">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;