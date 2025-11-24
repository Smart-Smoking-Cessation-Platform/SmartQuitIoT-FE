import React from 'react';
import { BookOpen, Video, FileText, Headphones, Download, ExternalLink } from 'lucide-react';

const resources = [
    {
        category: 'Educational Articles',
        icon: BookOpen,
        items: [
            {
                title: 'Understanding Nicotine Addiction',
                description: 'Learn about the science behind nicotine addiction and how it affects your brain and body.',
                link: 'https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/index.htm',
                type: 'Article'
            },
            {
                title: 'Health Benefits Timeline',
                description: 'Discover the positive changes your body experiences when you quit smoking.',
                link: 'https://www.cancer.org/healthy/stay-away-from-tobacco/benefits-of-quitting-smoking-over-time.html',
                type: 'Guide'
            },
            {
                title: 'Coping with Withdrawal Symptoms',
                description: 'Effective strategies to manage and overcome nicotine withdrawal symptoms.',
                link: 'https://smokefree.gov/challenges-when-quitting/withdrawal',
                type: 'Article'
            }
        ]
    },
    {
        category: 'Video Resources',
        icon: Video,
        items: [
            {
                title: 'Quitting Smoking: A Complete Guide',
                description: 'Comprehensive video series covering all aspects of the quitting journey.',
                link: 'https://www.youtube.com/results?search_query=quit+smoking+guide',
                type: 'Video Series'
            },
            {
                title: 'Breathing Exercises for Cravings',
                description: 'Learn breathing techniques to manage cravings and reduce stress.',
                link: 'https://www.youtube.com/results?search_query=breathing+exercises+quit+smoking',
                type: 'Tutorial'
            }
        ]
    },
    {
        category: 'Support & Community',
        icon: Headphones,
        items: [
            {
                title: 'Quitline Support',
                description: 'Free telephone counseling service available 24/7 to help you quit.',
                link: 'tel:1-800-QUIT-NOW',
                type: 'Hotline'
            },
            {
                title: 'Online Support Groups',
                description: 'Connect with others on the same journey through moderated forums and chat rooms.',
                link: 'https://www.quitnow.net/support-groups',
                type: 'Community'
            },
            {
                title: 'SmartQuit Community',
                description: 'Join our exclusive community to share experiences and get support from fellow members.',
                link: '/community',
                type: 'Platform'
            }
        ]
    },
    {
        category: 'Mobile Apps & Tools',
        icon: Download,
        items: [
            {
                title: 'Smoke Free App',
                description: 'Track your progress, save money, and stay motivated with this comprehensive app.',
                link: 'https://smokefree.gov/tools-tips/apps',
                type: 'Mobile App'
            },
            {
                title: 'Quit Tracker',
                description: 'Monitor your quit journey with detailed statistics and achievements.',
                link: 'https://smokefree.gov/tools-tips/apps',
                type: 'Mobile App'
            }
        ]
    },
    {
        category: 'Downloadable Guides',
        icon: FileText,
        items: [
            {
                title: 'Quit Plan Template',
                description: 'Personalized quit plan worksheet to help you prepare for success.',
                link: '#',
                type: 'PDF Download'
            },
            {
                title: 'Craving Management Worksheet',
                description: 'Track and analyze your cravings to identify triggers and patterns.',
                link: '#',
                type: 'PDF Download'
            },
            {
                title: 'Daily Progress Journal',
                description: 'Keep track of your thoughts, challenges, and victories during your quit journey.',
                link: '#',
                type: 'PDF Download'
            }
        ]
    }
];

const Resources = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Resources to Support Your Journey
                </h1>
                <p className="text-xl text-emerald-50 max-w-3xl">
                    Access a comprehensive collection of tools, guides, and support materials to help you quit smoking successfully.
                </p>
            </div>
        </div>

        {/* Resources Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-12">
                {resources.map((category, idx) => {
                    const IconComponent = category.icon;
                    return (
                        <div key={idx} className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <IconComponent className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((item, itemIdx) => (
                                    <div 
                                        key={itemIdx} 
                                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-lg text-gray-900 flex-1">
                                                {item.title}
                                            </h3>
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                                {item.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {item.description}
                                        </p>
                                        <a 
                                            href={item.link} 
                                            target={item.link.startsWith('http') ? "_blank" : undefined}
                                            rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined}
                                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
                                        >
                                            {item.link === '#' ? 'Download' : 'Access Resource'}
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Call to Action */}
            <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Need Personalized Support?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Join SmartQuit IoT and get access to personalized coaching, tracking tools, and a supportive community to help you succeed.
                    </p>
                    <a 
                        href="/login" 
                        className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default Resources;