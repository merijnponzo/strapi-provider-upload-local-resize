# strapi-provider-upload-local-resize

Add image resizing and variants to strapi upload
in your strapi admin, change extensions/file-upload settings to Local upload resize

```
cd strapi project /plugins/upload
npm i strapi-provider-upload-local-resize
```

node resizing library 
https://www.npmjs.com/package/jimp


make sure the attributes 'url' and 'thumb exists in your in 
> plugins/uploads/models/File.settings.json

No UI fields yet, but feel free to change the lib/index.js to add variants or change sizes


## Resources

- [MIT License](LICENSE.md)

## Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
