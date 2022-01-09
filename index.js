const fs = require("fs");
const nunjucks = require("nunjucks")
const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies using query-string library
// or
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("images"))
var images = [];
nunjucks.configure("views", {
	autoescape: true,
	express: app,
});
function loadImages() {
	images = []
	fs.readdirSync("images").forEach((element) => {
		images.push(element);
	});
	console.log(images);
	return images;
}
setInterval(loadImages, 1000 * 60 * 10);
app.get("/images", (req, res) => {
	res.json(images);
});
app.get("/", (req, res) => {
	const image = images[Math.floor(Math.random()*images.length)];
	res.render("index.html",{TITLE:image.split(".")[0],IMAGE:image,RAND:Math.random()});
});
app.get("/upload", (req, res) => {
	res.render("upload.html");
});
app.post('/', (req, res) => {
    if (req.files) {
        const file = req.files.file
        const fileName = file.name
		console.log(req.body.title)
        file.mv(`${__dirname}/images/${req.body.title}.${fileName.split(".")[1]}`, err => {
            if (err) {
                console.log(err)
                res.send('오류가 발생했습니다.')
            } else {
                res.redirect("/")
				loadImages()
            }
        })
    } else {
        res.send('파일이 없습니다.')
    }
})
app.listen(8080, loadImages);
