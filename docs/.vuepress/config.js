module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'node-red-contrib-ical-events',
      description: 'This Node RED module gets the events from an ical-URL, a caldav-server or from iCloud.'
    }
  },
  base: '/node-red-contrib-ical-events/',
  dest: './build',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#706B69' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: {
        '/': {
          message: "New content is available.",
          buttonText: "Refresh"
        }
      }
    },
    'vuepress-plugin-code-copy': {
      color: '#F6EEE9',
      backgroundColor: "#706B69",
    },
    'flowchart': true

  },
  theme: '@vuepress/theme-default',
  themeConfig: {
    repo: 'naimo84/node-red-contrib-ical-events',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    sidebarDepth: 3,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Configuration',
            link: '/config/'
          }
        ],
        sidebar: {
          '/guide/': [
            '/guide/',
            {
              title: 'Debug',
              path: '/guide/debug',
              collapsable: false             
            },
            {
              title: 'Nodes',
              collapsable: false,
              path: '/guide/nodes',
              children: [
                '/guide/upcoming',
                '/guide/trigger',
                '/guide/sensors',
              ]
            },
            // '/guide/troubleshooting',
            // {
            //   title: 'Examples',
            //   collapsable: false,
            //   path: '/guide/examples',
            //   children: [
            //     '/guide/examples_arbeitsagentur',
            //     '/guide/examples_github',
            //     '/guide/examples_grpcbin',
            //     '/guide/examples_httpbin',
            //     '/guide/examples_learnwebservices',
            //     '/guide/examples_spacex',
            //     '/guide/examples_springboot'
            //   ]
            // },
          ]
          
        }
      }
    }
  }
}
