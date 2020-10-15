export default {
  router: {
    "ai-index": () =>
      import(
        /* webpackChunkName: "style-isolate/index" */ `@ai/extract/file/index`
      )
  },

  i18n: false
};
