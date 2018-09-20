// import { resolve } from 'dns';

var Image = require('../../models/image');
var Video = require('../../models/video');
var File = require('../../models/file');
var formidable = require('formidable'),
    // http = require('http'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    // thumb = require('node-thumbnail').thumb,
    // sharp = require('sharp'),
    spawn = require('child_process').spawn;



function removeImage(req, res, next) {
    // console.log("file list");
    // var files = fs.readdirSync("./public/images");
    // console.log(files === null);
    // files.forEach(function (value) {
    //     console.log(value);
    // })
    Image.remove({
        _id: req.params.id
    }, function (error) {
        if (error) {
            console.log(error);
        } else {
            fs.unlink("./public/images/" + req.params.imageFileName, (error) => {
                if (error) {
                    console.log(error);
                }
                fs.unlink("./public/images/" + req.params.thumbImageFileName, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    res.send({
                        'message': 'successful'
                    });
                })
            })
        }
    })
}


function removeVideo(req, res, next) {
    // console.log("file list");
    // var files = fs.readdirSync("./public/images");
    // console.log(files === null);
    // files.forEach(function (value) {
    //     console.log(value);
    // })
    Video.remove({
        _id: req.params.id
    }, function (error) {
        if (error) {
            console.log(error);
        } else {
            fs.unlink("./public/videos/" + req.params.videoFileName, (error) => {
                if (error) {
                    console.log(error);
                }
                fs.unlink("./public/videos/" + req.params.thumbVideoFileName, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    res.send({
                        'message': 'successful'
                    });
                })
            })
        }
    })
}

function uploadVideo(req, res, next) {
    console.log('in upload Video');
    var form = new formidable.IncomingForm();
    var fileName;
    form.parse(req)
        .on('file', function (name, file) {
            // console.log('in farm.parse(req).on');
            // console.log("path:" + file.path);
            // console.log("name:" + file.name);
            // console.log("extension:" + file.name.split('.').pop());
            // console.log("index:" + file.path.lastIndexOf('/') + 1);
            // console.log("fileName:" + file.path.substr(file.path.lastIndexOf('/') + 1));

            fileExt = file.name.split('.').pop();
            // index = file.path.lastIndexOf('/') + 1;
            fileName = file.path.substr(file.path.lastIndexOf('/') + 1);
            pathNew = path.join(__dirname, '../../public/videos', fileName + '.' + fileExt);
            pathNewThumb = path.join(__dirname, '../../public/videos', fileName + '_thumb.jpg');

            fs.readFile(file.path, function (error, data) {
                fs.writeFile(pathNew, data, function (error) {
                    fs.unlink(file.path, function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            // call ffmpeg to create the thumbnail
                            // const ffmpeg = spawn('ffmpeg', ['-i', `${pathNew}`, '-ss', '00:00:00.500', '-vframes', '1', '-filter:v', `scale=200:-1`, `${pathNewThumb}`]);
                            // const ffmpeg = spawn('ffmpeg', ['-i', `${pathNew}`, '-ss', '00:00:00.500', '-vframes', '1', '-filter:v', `scale=267:-1`, `${pathNewThumb}`]);
                            const ffmpeg = spawn('ffmpeg', ['-i', `${pathNew}`, '-ss', '00:00:00.500', '-vframes', '1', `${pathNewThumb}`]);

                            ffmpeg.stderr.on('data', (data) => {

                                // console.log(`${data}`);
                                console.log("ffmpeg ended");
                            });
                        }
                    })
                })
            })
        })

        .on('error', function (error) {
            res.send({
                'success': false,
                error: error
            });
        })
        .on('end', function () {
            Video.findOne().sort('-order').exec(function (error, video) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log("Video find one order")
                    var orderNumber;
                    //  && Number.isNaN(parseInt(video.order)+1)
                    if (video && video.order) {
                        orderNumber = parseInt(video.order) + 1;
                    } else {
                        orderNumber = 0;
                    }
                    var videoData = {
                        url: fileName + '.' + fileExt,
                        urlThumb: fileName + '_thumb.jpg',
                        order: orderNumber
                    };
                    Video.create(videoData, function (error, video) {
                        if (error) {
                            console.log(error);
                        } else {
                            res.json(video);
                            res.end;
                        }

                    })
                }

            })

            // Video.create({
            //     url: filename + '.' + fileExt,
            //     urlThumb: filename + '_thumb.jpg',
            //     order: 1
            // }, function (error, video) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         res.json(video);
            //         res.end;
            //     }
            // })
            // res.status(200);
            // res.send({ 'success': true });
        });
}

function updateVideo(req, res, next) {
    console.log(req.body);
    var videoData = {
        title: req.body.title
    };

    Video.findByIdAndUpdate(req.params.id, videoData, function (error, video) {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            console.log(video);
            return res.json(video);
        }
    });
}

function updateImage(req, res, next) {
    console.log(req.body);
    var imageData = {
        title: req.body.title,
        title: req.body.order
    };

    Image.findByIdAndUpdate(req.params.id, imageData, function (error, image) {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            console.log(image);
            return res.json(image);
        }
    });
}

function updateImagesOrder(req, res, next) {
    // console.log(req.body.images);
    //this is sloppy fix it.
    req.body.images.forEach(element => {
        // console.log(element._id);
        Image.findByIdAndUpdate(element._id, {
            order: element.order
        }, function (error, image) {
            if (error) {
                return next(error);
            } else {
                console.log(image);
            }
        })
    });
    // return res.json({'request':'worked'});
    Image.find(function (error, image) {
        if (error) {
            // console.log(error);
            return next(error);
        } else {
            // console.log(image);
            return res.json(image);
        }
    })
};

function updateVideosOrder(req, res, next) {
    req.body.videos.forEach(element => {
        Video.findByIdAndUpdate(element._id, {
            order: element.order
        }, function (error, video) {
            if (error) {
                return next(error);
            } else {
                console.log(video);
            }
        })
    });
    Video.find(function (error, video) {
        if (error) {
            return next(error);
        } else {
            return res.json(video);
        }
    })
}

function uploadResume(req, res, next) {
    var form = new formidable.IncomingForm();
    var fields;
    form.parse(req)
        .on('file', function (name, file) {
            fs.readFile(file.path, function(error,data){
                fs.writeFile("public/files/Christina_Ferrarro_resume.pdf",data);
            })
            
        })
        .on('error', function (error) {
            res.writeHead(500, {
                'content-type': 'text/plain'
            });
            res.write(error);
            res.end();
        })
        .on('end', function () {
            // res.writeHead(200, {
            //     'content-type': 'text/plain'
            // });
            // res.write('received upload:\n\n');
            // res.end();
            var fileData = {
                url: "files/Christina_Ferrarro_resume.pdf"
            };
            // File.findOne("",function (error, file){
            //     if (file.length){
            //         console.log(file);
            //     } else {
            //         File.create(fileData, function (error, file) {
            //             if (error) {
            //                 console.log(error);
            //             } else {
            //                 res.json(file);
            //                 res.end;
            //             }
        
            //         })
            //     }
            // })
            
        });
}

function uploadImage(req, res, next) {
    console.log("in uploadImage");
    var form = new formidable.IncomingForm();
    var fieldsVar;
    var filesVar = {};
    var fileName;
    form.parse(req)
        .on('field', function (name, value) {})
        .on('file', function (name, file) {
            pathOld = file.path;
            fileExt = file.name.split('.').pop();
            index = pathOld.lastIndexOf('/') + 1;
            fileName = pathOld.substr(index);
            pathNew = path.join(__dirname, '../../public/images/', fileName + '.' + fileExt);
            pathNewThumb = path.join(__dirname, '../../public/images/', fileName + '_thumb.' + fileExt);
            pathNewBlur = path.join(__dirname, '../../public/images/', fileName + '_blur.' + fileExt);

            fs.readFile(pathOld, function (error, data) {
                fs.writeFile(pathNew, data, function (error) {
                    fs.unlink(pathOld, function (error) {
                        if (error) {
                            res.status(500);
                            res.json({
                                'success': false
                            });
                        } else {
                            // ccreates the thumbnail here
                            // sharp(pathNew)
                            // .resize(200, 200)
                            // .toFile(pathNewThumb, function(error){
                            // 	console.log(error);
                            // });
                            const ffmpeg = spawn('ffmpeg', ['-i', `${pathNew}`, '-vf', 'scale=200:-1', `${pathNewThumb}`]);

                            ffmpeg.stderr.on('data', (data) => {

                                // console.log(`${data}`);
                                console.log("thumbnail");
                            });
                            const ffmpeg_blur = spawn('ffmpeg', ['-i', `${pathNew}`, '-vf', 'scale=30:-1', `${pathNewBlur}`]);

                            ffmpeg_blur.stderr.on('data', (data) => {

                                // console.log(`${data}`);
                                console.log("blur");
                            });
                            // thumb({
                            //     source: pathNew,
                            //     destination: pathNewThumb,
                            //     concurrency: 1,
                            //     width: 200
                            // }, function (files, error, stdout, stderr) {
                            //     // console.log(files);
                            //     // console.log(error);
                            // });
                        }
                    })
                })
            })
        })
        .on('error', function (error) {
            res.writeHead(500, {
                'content-type': 'text/plain'
            });
            res.write(error);
            res.end(util.inspect({
                fields: fields,
                files: files
            }));
        })
        .on('end', function () {
            //adds to the database here
            Image.findOne().sort('-order').exec(function (error, image) {
                // console.log(parseInt(image.order) + 1);
                var orderNumber;
                //  && Number.isNaN(parseInt(video.order)+1)
                if (image && image.order) {
                    orderNumber = parseInt(image.order) + 1;
                } else {
                    orderNumber = 0;
                }
                var imageData = {
                    url: fileName + '.' + fileExt,
                    urlThumb: fileName + '_thumb.' + fileExt,
                    order: orderNumber,
                    urlBlur: fileName + '_blur.' + fileExt
                };
                Image.create(imageData, function (error, image) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json(image);
                        res.end;
                    }

                })
            })

        });
}



module.exports.uploadImage = uploadImage;
module.exports.removeImage = removeImage;
module.exports.updateImage = updateImage;
module.exports.updateImagesOrder = updateImagesOrder;
module.exports.uploadVideo = uploadVideo;
module.exports.removeVideo = removeVideo;
module.exports.updateVideo = updateVideo;
module.exports.updateVideosOrder = updateVideosOrder;
module.exports.uploadResume = uploadResume;
