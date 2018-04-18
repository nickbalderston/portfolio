var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'pug');

var port = process.env.PORT || 8080;

const MongoClient = require('mongodb').MongoClient;

var dbLengthCounter;

var db;
/////////////////////////////////////
MongoClient.connect('mongodb://nickB135:ChopstiX123!@ds127963.mlab.com:27963/portfolio-database', (err, client) => {
        if (err) return console.log(err);
        db = client.db('portfolio-database');
        var server = http.listen(port,() => {
            console.log('server is listening on port', server.address().port)
         });

         

        app.get('/', function (req, res) {
            //res.render('index', { title: 'Hey', message: 'Hello there!' });

            var cursor = db.collection('portfolio-database-collection').find()
        
            db.collection('portfolio-database-collection').find().toArray(function(err, results) {
                console.log(results);
                dbLengthCounter = results.length;
                console.log("length = "+results.length);

                app.get('/dbLength', (req, res) =>{
                    res.send({length: dbLengthCounter});
                    
                });

                app.get('/projectDetails', (req, res) =>{
                    console.log("getproject");
                    //console.log(req.query.requestedIndex);
                    res.send(results[req.query.requestedIndex]);
                })

                res.render('index', {
                    //projectTitleText: results[0].projectTitle, 
                    //aboutText: results[0].about, 
                    //problemText: results[0].problem, 
                    //solutionText: results[0].solution, 
                    //processText: results[0].process
                });
                //console.log(results.length);
            });
        });

/*
         app.get('/stories-list', (req, res) => {
            var cursor = db.collection('stories').find()
        
            db.collection('portfolio-database-collection').find().toArray(function(err, results) {
                
                res.render('index.ejs', {stories: results})
                //console.log(results.length);
            })
            
        })
 */       
})


app.post('/submit-content', (req, res) => {
    //var content = '';
    var projectTitleContent = req.body.projectTitle;
    var skillsContent = req.body.skills;
    var aboutContent = req.body.about;
    var problemContent = req.body.problem;
    var solutionContent = req.body.solution;
    var processContent = req.body.process;
    var heroTypeContent = req.body.heroType;
    var videoLinkContent = req.body.videoLink;
    var projectLinkTextContent = req.body.projectLinkText;
    var projectLinkContent = req.body.projectLink;
    var processImageCountContent = req.body.processImageCount;

    
    var skillsArray = [];
    skillsArray = skillsContent.split(',');

    var thisDocument = {
        projectTitle: projectTitleContent, 
        skills: skillsArray, 
        about: aboutContent,
        problem: problemContent, 
        solution: solutionContent, 
        process: processContent,
        heroType: heroTypeContent, 
        videoLink: videoLinkContent, 
        projectLinkText: projectLinkTextContent, 
        projectLink: projectLinkContent,
        processImageCount: processImageCountContent
    };
    
    

    db.collection('portfolio-database-collection').save(thisDocument, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        //res.redirect('/')
    })

    res.redirect('/')
})