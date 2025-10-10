const StatsSection = () => {
  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      label: 'Active Members',
      value: '25k+',
      description: 'People actively using SmartQuit'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      label: 'Success Rate',
      value: '78%',
      description: 'Of users who stay smoke-free'
    },
    {
      icon: (
        <span className="text-4xl font-bold">$</span>
      ),
      label: 'Money Saved',
      value: '$2.5M+',
      description: 'Total money saved by our community'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Lives Improved',
      value: '15k+',
      description: 'People who successfully quit'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            SmartQuitIoT by the Numbers
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands who have transformed their lives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                {stat.icon}
              </div>
              <p className="text-sm text-gray-600 text-center mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 text-center mb-3">{stat.value}</p>
              <p className="text-sm text-gray-500 text-center">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Be Part of Our Success Story
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every day, more people join SmartQuitIoT and take control of their health. Start your journey today.
          </p>
        </div>
      </div>
    </section>
  );
};
export default StatsSection;