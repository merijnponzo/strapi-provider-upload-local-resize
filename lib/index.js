'use strict';

const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const ImageType = require('image-type');

/**
 * Local Resize Upload Provider
 * Saves uploads to localhost with configured resized images
 */
module.exports = {
    provider: 'local-resize',
    name: 'Local upload resize',

    init: () => {
        return {
            /**
             * Upload
             * @param file
             * @returns {Promise<unknown>}
             */
            upload: (file) => {
                return new Promise((resolve, reject) => {
                    function resize(file, variant) {
                        return Jimp.read(file.buffer)
                            .then(image => {
                                let destImg = path.join(strapi.config.appPath, 'public', `uploads/${variant.prefix}${file.hash}${file.ext}`);
                                if (variant.scaleType !== "resize") {
                                    image.cover(variant.maxSize, variant.maxSize)
                                } else {
                                    image.resize(Jimp.AUTO, variant.maxSize)
                                }
                                image.quality(variant.quality);
                                image.write(destImg);
                                file[variant.attributes] = `/uploads/${variant.prefix}${file.hash}${file.ext}`;
                                return true
                            })
                            .catch(err => {
                                return reject(err);
                            });
                    }

                    // define variants, props should be defined in plugins/uploads/models/File.settings.json
                    let variants = [
                        {
                            maxSize: 1080,
                            scaleType: "resize",
                            prefix: "large_",
                            quality: 70,
                            attributes: 'url'
                        },
                        {
                            maxSize: 400,
                            scaleType: "cover",
                            prefix: "thumb_",
                            quality: 70,
                            attributes: 'thumb'
                        }
                    ];

                    // skip resizing if file is not an image
                    if (!ImageType(file.buffer)) {
                        file.url = `/uploads/${file.hash}${file.ext}`;
                        return resolve();
                    }

                    // resize the images
                    const promise = resize(file, variants[0]);
                    promise
                        .then(function () {
                            return resize(file, variants[1]);
                        })
                        .then(function () {
                            return resolve()
                        })
                        .catch(err => {
                            return reject(err);
                        });
                });
            },

            /**
             * Delete
             * @param file
             * @returns {Promise<unknown>}
             */
            delete: (file) => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(strapi.config.appPath, 'public', `uploads/baander${file.hash}${file.ext}`);

                    if (!fs.existsSync(filePath)) {
                        return resolve('File doesn\'t exist');
                    }
                    // remove file from public/assets folder
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            }
        }
    }
};
