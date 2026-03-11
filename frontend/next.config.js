module.exports = {
  serverExternalPackages: [
    '@better-auth/infra',
    '@better-auth/sso',
    'samlify',
    '@authenio/xml-encryption',
  ],
  turbopack: {
    root: __dirname,
  },
};