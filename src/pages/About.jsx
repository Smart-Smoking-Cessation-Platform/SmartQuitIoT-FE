import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Users, Heart, TrendingUp, Award, Clock, DollarSign, Smartphone, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '25K+', label: 'Active Users', color: 'text-blue-600' },
    { icon: Award, value: '78%', label: 'Success Rate', color: 'text-emerald-600' },
    { icon: Clock, value: '45', label: 'Days Average', color: 'text-purple-600' },
    { icon: DollarSign, value: '$500', label: 'Money Saved', color: 'text-orange-600' },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'IoT Integration',
      description: 'Real-time monitoring through smart devices that track your progress and provide instant feedback.',
    },
    {
      icon: Target,
      title: 'Personalized Plans',
      description: 'Custom quit plans tailored to your smoking habits, triggers, and personal goals.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Access to certified coaches and a supportive community available 24/7.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics and insights to visualize your journey and celebrate milestones.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Health First',
      description: 'We prioritize your health and wellbeing above all else, providing evidence-based solutions.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Building a supportive community where everyone helps each other succeed.',
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'Focused on measurable outcomes and proven methods to help you quit for good.',
    },
  ];

  const team = [
    { name: 'Nguyễn Hà Viết Anh', role: 'Professional Smoker', description: 'Addiction Medicine Specialist', avatarUrl: 'https://res.cloudinary.com/dmp8hzwup/image/upload/v1763904550/657b6b513ddcb182e8cd_ktrbwd.jpg' },
    { name: 'Nguyễn Hải Linh', role: 'Doctor', description: 'Developer', avatarUrl: '' },
    { name: 'Trần Ngọc Kinh Luân', role: 'Doctor', description: 'Developer', avatarUrl: '' },
    { name: 'Thi Minh Đạt', role: 'Doctor', description: 'Developer', avatarUrl: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About SmartQuit IoT
          </h1>
          <p className="text-xl text-emerald-50 max-w-3xl leading-relaxed">
            Empowering individuals to quit smoking through innovative IoT technology, 
            personalized support, and a community-driven approach to lasting change.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              SmartQuit IoT was founded with a clear mission: to revolutionize smoking cessation by 
              combining cutting-edge technology with proven behavioral science.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We believe that quitting smoking shouldn't be a lonely journey. Our platform provides 
              the tools, support, and community needed to make lasting change possible.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Your Journey
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 lg:p-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Evidence-Based Approach</h3>
                  <p className="text-gray-600">Using scientifically proven methods backed by research.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Personalized Support</h3>
                  <p className="text-gray-600">Tailored plans that adapt to your unique needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">24/7 Availability</h3>
                  <p className="text-gray-600">Support whenever you need it, day or night.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How We Help You Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const IconComponent = value.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <IconComponent className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Experts dedicated to helping you achieve a smoke-free life
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-emerald-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-emerald-600 font-semibold mb-2">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-xl text-emerald-50 mb-8">
                Have questions? We're here to help you on your journey to quit smoking.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6" />
                  <a href="mailto:info@smartquitiot.com" className="hover:underline">
                    info@smartquitiot.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6" />
                  <a href="tel:1-800-QUIT-NOW" className="hover:underline">
                    1-800-QUIT-NOW
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6" />
                  <span>123 Health Street, Wellness City, WC 12345</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Quit?</h3>
                <p className="text-emerald-50 mb-6">
                  Join thousands of others who have successfully quit smoking with SmartQuit IoT.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;