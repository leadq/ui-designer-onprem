export default {
  moduleFederation: {
    name: 'ui_design',
    filename: 'remoteEntry.js',
    remotes: {},
    exposes: { './expose': './src/main' },
    shared: {},
  },
  props: {},
};
