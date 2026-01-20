
const collection = [
  {
    id: 1,
    name: 'AI',
    key: 'ai',
    emoji: "🧠",
    rows: [
      { name: "GPT", herf: "https://chat.openai.com/" },
      { name: "Gemini", herf: "https://gemini.google.com/" },
      { name: "Claude", herf: "https://claude.ai/" },
      { name: "Perplexity", herf: "https://www.perplexity.ai/" },
      { name: "Poe", herf: "https://poe.com/" },
      { name: "Huggingface", herf: "https://huggingface.co/chat/" },
    ]
  },
  {
    id: 2,
    name: 'Deploy',
    key: 'deploy',
    emoji: "🌩️",
    rows: [
      { name: "Vercel", herf: 'https://vercel.com/' },
      { name: "Cloudflare", herf: 'https://www.cloudflare.com/' },
      { name: "Fly.io", herf: 'https://fly.io/' },
      { name: "Dokploy", herf: 'https://dokploy.com/' },

    ]
  },
  {
    id: 3,
    name: 'UI Conponents',
    key: 'ui',
    emoji: "🚀",
    rows: [
      { name: "MUI", herf: 'https://mui.com/material-ui/' },
      { name: "TailwindUI", herf: 'https://tailwindui.com/' },
      { name: "NextUI", herf: 'https://www.nextui.pro/' },
      { name: "EasyFrontend", herf: 'https://easyfrontend.com/' },
      { name: "Saas-UI", herf: 'https://saas-ui.dev/' },
      { name: "Material-Tailwind", herf: 'https://www.material-tailwind.com/pro' },
      { name: "Shadcn/UI", herf: 'https://ui.shadcn.com/' },
      { name: "daisyUI", herf: 'https://daisyui.com/' },
      { name: "SailboatUI", herf: 'https://sailboatui.com/' },
      { name: "Preline Tailwind", herf: 'https://preline.co/' },
      { name: "Tailwind Toolbox", herf: 'https://www.tailwindtoolbox.com/' },
      { name: "Tailbits Tailwind", herf: 'https://www.tailbits.com/' },
      { name: "Tailwind Awesome", herf: 'https://www.tailwindawesome.com/' },
      { name: "erakiui", herf: 'https://merakiui.com/' },
      { name: "Flowbite", herf: 'https://flowbite.com/' },
      { name: "Langui", herf: 'https://www.langui.dev/' },
      { name: "Cruip", herf: 'https://cruip.com/' },
      { name: "Tailspark", herf: 'https://tailspark.co/' },
      { name: "Tailsc", herf: 'https://tailsc.com/' },
      { name: "Github Tailwind Components", herf: 'https://github.com/unlight/tailwind-components/' },
      { name: "HyperUI", herf: 'https://www.hyperui.dev/' },
    ]
  },

  {
    id: 13,
    name: 'Templates',
    key: 'templates',
    emoji: "🚅",
    rows: [
      { name: "HTMLrev templates", herf: 'https://htmlrev.com/' },
      { name: "Admin Dashboard Template", herf: 'https://tailadmin.com/' },
      { name: "Saas Template", herf: 'https://opensaas.sh/' },
      { name: "Shipfast", herf: 'https://shipfa.st/' },
      { name: "Pocketbase", herf: 'https://github.com/pocketbase/pocketbase' },
    ]
  },

  {
    id: 4,
    name: 'Dev Tools',
    key: 'tool',
    emoji: "🔧",
    rows: [
      { name: "Woop", herf: 'https://woop.bytegush.com' },
      { name: "Freesets", herf: 'https://freesets.vercel.app/' },
      { name: "Upptime", herf: 'https://upptime.js.org/' },
      { name: "AIColors", herf: 'https://aicolors.co/' },
      { name: "UIColors Generator", herf: 'https://uicolors.app/create' },
      { name: "Mock.io", herf: 'https://designer.mocky.io' },
      { name: "JSON Server", herf: 'https://github.com/typicode/json-server' },
      { name: "JSON Placeholder", herf: 'https://jsonplaceholder.typicode.com/' },
      { name: "Boring Cash Cow", herf: 'https://boringcashcow.com/' },
      { name: "DrawDB", herf: 'https://drawdb.vercel.app' },
      { name: "DBdiagram", herf: 'https://dbdiagram.io/' },
      { name: "Status Page", herf: 'https://github.com/eidam/cf-workers-status-page' },
      { name: "Chalk", herf: 'https://chalk.ist/' },
      { name: "Shots-Mockup", herf: 'https://shots.so/' },


    ]
  },
  {
    id: 14,
    name: 'Icon',
    key: 'icon',
    emoji: "🏖️",
    rows: [
      { name: "Hero Icons", herf: 'https://heroicons.com/' },
      { name: "Huge Icons", herf: 'https://hugeicons.com/' },
      { name: "Logo Design", herf: 'https://looka.com/' },
      { name: "Icon Generator", herf: 'https://icon.kitchen/' },
      { name: "Hand-drawn SVGs", herf: 'https://react-rough-fiber.amind.app/' },
      { name: "Emojipedia", herf: 'https://emojipedia.org/' },
      { name: "SVGViewer", herf: 'https://www.svgviewer.dev/' },
      { name: "ilus.ai", herf: 'https://ilus.ai/generate' },
      { name: "svgl", herf: 'https://svgl.app/' },
      { name: "yesicon", herf: 'https://yesicon.app/' },
      { name: "OG Playground", herf: 'https://og-playground.vercel.app/' },
      { name: "React Icons", herf: 'https://react-icons.github.io/react-icons/' },
      { name: "Iconify", herf: 'https://icon-sets.iconify.design/material-symbols/' },
      { name: "Lucide", herf: 'https://lucide.dev/icons/' },

    ]
  },
  {
    id: 5,
    name: 'Auth',
    key: 'auth',
    emoji: "🛡️",
    rows: [
      { name: "Supabase", herf: 'https://supabase.com/auth' },
      { name: "NextAuth", herf: 'https://authjs.dev/' },
      { name: "Clerk", herf: 'https://clerk.com/' },

    ]
  },
  {
    id: 6,
    name: 'SEO',
    key: 'seo',
    emoji: "🧑‍💻",
    rows: [
      { name: "Google Indexing Script", herf: 'https://github.com/goenning/google-indexing-script' },
      { name: "Next SEO", herf: 'https://github.com/garmeeh/next-seo' },
      { name: "Ahrefs", herf: 'https://ahrefs.com/' },
      { name: "Semrush", herf: 'https://www.semrush.com/' },
      { name: "SEOptimer", herf: 'https://www.seoptimer.com/' },
    ]
  },
  {
    id: 17,
    name: 'Payment',
    key: 'payment',
    emoji: "💰",
    rows: [
      { name: "Wise", herf: 'https://wise.com/' },
      { name: "Stripe", herf: 'https://stripe.com/' },
      { name: "Lemonsqueezy", herf: 'https://www.lemonsqueezy.com/' },
      { name: "Paymentwall", herf: 'https://www.paymentwall.com/' },
      { name: "Paddle", herf: 'https://www.paddle.com/' },
    ]
  },
  {
    id: 7,
    name: 'Jobs',
    key: 'jobs',
    emoji: "💼",
    rows: [
      { name: "Who is hiring", herf: 'https://bernawil.github.io/hn-who-is-hiring/' },
      { name: "Free Lancer", herf: 'https://www.freelancer.com/' },
      { name: "Japan remote", herf: 'https://japan-dev.com/remote-jobs-in-japan' },
      { name: "upwork", herf: 'https://www.upwork.com/' },
      { name: "remote.co", herf: 'https://Remote.co' },
      { name: "WeWorkRemotely", herf: 'https://weworkremotely.com' },
      { name: "FlexJobs", herf: 'https://flexjobs.com' },
      { name: "Working Nomads", herf: 'https://workingnomads.co' },
      { name: "Dynamite Jobs", herf: 'https://dynamitejobs.co' },
      { name: "Remote", herf: 'https://remote.com' },
      { name: "JustRemote", herf: 'https://justremote.co' },
      { name: "RemoteOK", herf: 'https://remoteok.io' },
      { name: "We Work Remotely", herf: 'https://weworkremotely.com' },
      { name: "Gun.io", herf: 'https://gun.io/' },
      { name: "Flexjobs", herf: 'https://www.flexjobs.com/' },
      { name: "Authentic Jobs", herf: 'https://authenticjobs.com/' },
      { name: "Working Nomads", herf: 'https://www.workingnomads.com/jobs' },
      { name: "WWR", herf: 'https://weworkremotely.com/' },
      { name: "Well found", herf: 'https://wellfound.com/' },
      { name: "himalayas", herf: 'https://himalayas.app/' },
      { name: "Pangian", herf: 'https://pangian.com/' },
      { name: "Careervault", herf: 'https://www.careervault.io/' },
      { name: "Jobspresso", herf: 'https://jobspresso.co/' },
      { name: "Remotive", herf: 'https://remotive.com/' },
    ]
  },
  {
    id: 8,
    name: 'Domain',
    key: 'domain',
    emoji: "🌐",
    rows: [
      { name: "Namecheap", herf: 'https://www.namecheap.com/' },
      { name: "Namesilo", herf: 'https://www.namesilo.com/' },
      { name: "Godaddy", herf: 'https://www.godaddy.com/' },
      { name: "Spaceship", herf: 'https://www.spaceship.com/' },
    ]
  },
  {
    id: 9,
    name: 'Cheat Sheet',
    key: 'cs',
    emoji: "📝",
    rows: [
      { name: "JS Array", herf: 'https://twitter.com/davidm_ml/status/1787056238196392392' },
      { name: "tsconfig", herf: 'https://www.totaltypescript.com/tsconfig-cheat-sheet' },
      { name: "VIM", herf: 'https://images.bytegush.com/cs-vim.png' },
      { name: "VIM Key", herf: 'https://images.bytegush.com/cs-vim-key.jpg' },
      { name: "MySQL", herf: 'https://images.bytegush.com/cs-mysql.png' },
      { name: "Regular Expression", herf: 'https://images.bytegush.com/cs-regular-expressions.png' },
      { name: "HTML", herf: 'https://images.bytegush.com/cs-html.jpeg' },
      { name: "Grep", herf: 'https://images.bytegush.com/grep.jpeg' },
      { name: "Python", herf: 'https://images.bytegush.com/cs-python.jpeg' },

    ]
  },
  {
    id: 10,
    name: 'System Design',
    key: 'sd',
    emoji: "✏️",
    rows: [
      { name: "Complete System Design", herf: 'https://github.com/Coder-World04/Complete-System-Design' },
      { name: "ByteByteGo System Design", herf: 'https://bytebytego.com/courses/system-design-interview/foreword' },
    ]
  },
  {
    id: 11,
    name: 'Storage',
    key: 'storage',
    emoji: "💾",
    rows: [
      { name: "Turso-SQLite", herf: 'https://turso.tech/' },
      { name: "TiDB", herf: 'https://tidbcloud.com/' },
      { name: "Cloudflare-KV", herf: 'https://developers.cloudflare.com/kv/' },
      { name: "Cloudflare-DB", herf: 'https://developers.cloudflare.com/d1/' },
      { name: "Cloudflare-Object", herf: 'https://developers.cloudflare.com/r2/' },

    ]
  },
  {
    id: 12,
    name: 'Analytics',
    key: 'analytics',
    emoji: "📊",
    rows: [
      { name: "Beamanalytics", herf: "https://beamanalytics.io/" },
      { name: "Tianji", herf: "https://tianji.msgbyte.com/" },
      { name: "Umami", herf: "https://umami.is/" },
      { name: "Beamanalytics", herf: 'https://beamanalytics.io/' },
      { name: "Simple Analytics", herf: 'https://simpleanalytics.com/' },
      { name: "Matomo", herf: 'https://matomo.org/' }
    ]
  },
  {
    id: 15,
    name: 'Awesome for Awesome',
    key: 'awesome',
    emoji: "🔥",
    rows: [
      { name: "Sindresorhus", herf: "https://github.com/sindresorhus/awesome" },
      { name: "OSS Gallery", herf: "https://oss.gallery/" },
      { name: "Awesome SEO", herf: 'https://github.com/madawei2699/awesome-seo' },
      { name: "Best SaaS Boilerplates", herf: 'https://boilerplatelist.com/' },
      { name: "Indie Hacker Tools", herf: 'https://github.com/weijunext/indie-hacker-tools' },
      { name: "Github Awesome Tailwind", herf: 'https://github.com/aniftyco/awesome-tailwindcss' },
      { name: 'Awesome Selfhosted', herf: 'https://awesome-selfhosted.net/' },
      { name: 'Awesome Mac', herf: 'https://github.com/jaywcjlove/awesome-mac' },
    ]
  },
  {
    id: 16,
    name: 'Awesome Bytegush',
    key: 'bytegush',
    emoji: "🔥",
    rows: [
      { name: 'Quoteworthy', herf: 'https://quoteworthy.bytegush.com/notes' },
    ]
  }

]

export default collection;