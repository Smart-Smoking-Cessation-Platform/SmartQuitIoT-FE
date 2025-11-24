import React from 'react';
import { Smartphone, Download as DownloadIcon, Apple, PlayCircle, QrCode, CheckCircle, Star } from 'lucide-react';

const Download = () => {
  const features = [
    'Real-time smoking cessation tracking',
    'Personalized quit plans and goals',
    'IoT device integration',
    'Daily missions and achievements',
    'Expert coaching sessions',
    'Community support network',
    'Progress analytics and insights',
    'Craving management tools',
  ];

  const screenshots = [
    { title: 'Dashboard', description: 'Track your progress at a glance' },
    { title: 'Missions', description: 'Complete daily challenges' },
    { title: 'Coach Chat', description: 'Get expert support anytime' },
    { title: 'Analytics', description: 'View detailed insights' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-medium">4.8/5 Rating • 50K+ Downloads</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Download SmartQuit IoT
              </h1>
              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                Take control of your quit smoking journey with our powerful mobile app. 
                Track progress, connect with coaches, and achieve your goals—all from your phone.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg"
                >
                  <PlayCircle className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-3 text-emerald-50">
                <DownloadIcon className="w-5 h-5" />
                <span className="text-sm">Free to download • Available worldwide</span>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <div className="relative z-10 mx-auto w-64 h-[520px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 pt-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4">
                      <div className="text-white/80 text-sm mb-2">Smoke-Free Days</div>
                      <div className="text-5xl font-bold text-white mb-1">42</div>
                      <div className="text-emerald-200 text-sm">Keep going strong! 🎉</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm">Money Saved</span>
                          <span className="font-bold">$420</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm">Health Points</span>
                          <span className="font-bold">+85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default Download;
