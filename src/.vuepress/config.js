const path = require('path');
module.exports = {
    title: "faga's blog",
    description: 'Just playing around',
    dest:'docs',
    themeConfig: {
      sidebarDepth:2,
      searchMaxSuggestions: 10,
      nav: [
        { text:'主页', link:'/' },
        { text: '笔记', link: '/blog/' },
        { text: 'Github', link: 'https://github.com/faga1' }
      ],
      sidebar: {
        '/blog/':[
          '',
          'remark',
          'react',
          'web_upload_oss',
          'webpack',
          'interview',
          'commonjs&esmodule',
        ]
      }
    }
}