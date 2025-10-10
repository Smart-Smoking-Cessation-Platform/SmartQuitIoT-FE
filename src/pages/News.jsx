import React from 'react';

const newsList = [
    {
        id: 1,
        title: 'SmartQuit IoT Launches New Feature',
        date: '2024-06-10',
        summary: 'Discover the latest update in SmartQuit IoT, enhancing user experience and device connectivity.',
    },
    {
        id: 2,
        title: 'Tips for Effective Smoking Cessation',
        date: '2024-06-05',
        summary: 'Read expert advice on how to quit smoking using SmartQuit IoT solutions.',
    },
    {
        id: 3,
        title: 'Community Success Stories',
        date: '2024-05-28',
        summary: 'See how users are achieving their goals with SmartQuit IoT.',
    },
];

const News = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>News</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {newsList.map(news => (
                    <li key={news.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h2>{news.title}</h2>
                        <small>{news.date}</small>
                        <p>{news.summary}</p>
                    </li>
                ))}
            </ul>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {newsList.map(news => (
                    <li key={news.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h2>{news.title}</h2>
                        <small>{news.date}</small>
                        <p>{news.summary}</p>
                    </li>
                ))}
            </ul>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {newsList.map(news => (
                    <li key={news.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h2>{news.title}</h2>
                        <small>{news.date}</small>
                        <p>{news.summary}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;