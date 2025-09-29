module.exports = {
  siteUrl: 'https://www.Assistlore.com',
  generateRobotsTxt: true,
  // additionalPaths: async (config) => {
  //   const { janblog } = await import('./src/models/blogdata/jan/route.js');
  //   const blogs = janblog.map((post) => ({
  //     loc: `/blog/${post.slug}`,
  //     lastmod: new Date().toISOString(),
  //     changefreq: 'daily',
  //   }));

  //   return blogs;
  // },
};
