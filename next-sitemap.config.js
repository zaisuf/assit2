const { janblog } = require('./src/models/blogdata/jan/route');

module.exports = {
  siteUrl: 'https://www.Assistlore.com',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const blogs = janblog.map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
    }));

    return blogs;
  },
};
