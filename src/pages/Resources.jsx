import React from 'react';

const resources = [
    {
        title: 'Quit Smoking Guide',
        description: 'Comprehensive guide to help you quit smoking.',
        link: 'https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/index.htm'
    },
    {
        title: 'Support Groups',
        description: 'Find local and online support groups.',
        link: 'https://www.quitnow.net/support-groups'
    },
    {
        title: 'Mobile Apps',
        description: 'Apps to track progress and stay motivated.',
        link: 'https://smokefree.gov/tools-tips/apps'
    }
];

const Resources = () => (
    <div style={{ padding: '2rem' }}>
        <h1>Resources</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((resource, idx) => (
                <li key={idx} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2>{resource.title}</h2>
                    <p>{resource.description}</p>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Visit Resource
                    </a>
                </li>
            ))}
        </ul>
             <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((resource, idx) => (
                <li key={idx} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2>{resource.title}</h2>
                    <p>{resource.description}</p>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Visit Resource
                    </a>
                </li>
            ))}
        </ul>
             <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((resource, idx) => (
                <li key={idx} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2>{resource.title}</h2>
                    <p>{resource.description}</p>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        Visit Resource
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default Resources;