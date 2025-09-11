// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Mode server pour supporter les API routes
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    {
      name: 'gtm-integration',
      hooks: {
        'astro:build:setup': ({ vite, target }) => {
          if (target === 'server') return;

          vite.build = vite.build || {};
          vite.build.rollupOptions = vite.build.rollupOptions || {};
          vite.build.rollupOptions.plugins = vite.build.rollupOptions.plugins || [];

          // Plugin pour injecter GTM
          vite.build.rollupOptions.plugins.push({
            name: 'inject-gtm',
            transformIndexHtml(html, ctx) {
              // Ne pas injecter sur les pages admin
              if (ctx.path.includes('/admin')) {
                return html;
              }

              // Injecter le GTM dans le head
              const gtmHead = `
                <!-- Google Tag Manager -->
                <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NGZ6SCTP');</script>
                <!-- End Google Tag Manager -->
              `;

              // Injecter le noscript dans le body
              const gtmBody = `
                <!-- Google Tag Manager (noscript) -->
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGZ6SCTP"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                <!-- End Google Tag Manager (noscript) -->
              `;

              // Injecter dans le head après <title>
              html = html.replace(/(<title>.*?<\/title>)/, '$1' + gtmHead);

              // Injecter dans le body après <body>
              html = html.replace(/(<body[^>]*>)/, '$1' + gtmBody);

              return html;
            }
          });
        }
      }
    }
  ]
});