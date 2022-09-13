import { defaultTheme, defineUserConfig } from 'vuepress';
import { hopeTheme } from 'vuepress-theme-hope';
export default defineUserConfig({
    theme: hopeTheme({
      author: {
        name: 'faga',
        url: "http://www.faga.cc"
      },
      repoDisplay: false,
      navbar: [
        { text:'主页', link:'/' },
        { text: '笔记', link: '/blog/' },
        { text: 'Github', link: 'https://github.com/faga1' }
      ],
      sidebar: {
        '/blog/':[
          'README.md',
          'remark',
          'react',
          'web_upload_oss',
          'webpack',
          'interview',
          'commonjs&esmodule',
        ]
      },
      blog: {
        name: 'faga',
        avatar: 'https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/微信图片_20220607163536.jpg',
        medias: {
          Github: 'https://github.com/faga1'
        }
      },
      plugins: {
        blog: true,
        comment: {
          provider: "Waline",
          serverURL: "https://blog-comment-theta-six.vercel.app/"
        },

        pwa: {
          manifest:{
            name: "faga's blog",
          }
        }
      }
    }),
    
    title: "faga's blog",
    description: 'Just playing around',
    dest:'docs',
    // theme: defaultTheme({
    //   sidebarDepth:2,
    //   // searchMaxSuggestions: 10,
    //   navbar: [
    //     { text:'主页', link:'/' },
    //     { text: '笔记', link: '/blog/' },
    //     { text: 'Github', link: 'https://github.com/faga1' }
    //   ],
    
    // })
})