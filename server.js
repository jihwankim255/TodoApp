const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://plasticat104:agency0517@cluster0.sg0ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
    // 연결되면 할 일
    if(에러) return console.log(에러)

    db = client.db('todoapp');   //todoapp 이라는 database에 연결좀요
    
    app.listen(8080, function(){
        console.log('listening on 8080')
    });
    

})


app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html');
});

app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑 페이지입니다.');
});

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
});

app.post('/add', function(요청, 응답){  //누가 폼에서 /add로 POST 요청하면 (요청.body에 게시물 데이터 담겨옴)
    응답.send('전송완료');
    db.collection('counter').findOne({name : '게시물개수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물개수 = 결과.totalPost;
   
        db.collection('post').insertOne({ _id : 총게시물개수+1,제목 : 요청.body.title, 날짜 : 요청.body.date}, function(에러, 결과){
            console.log('저장완료');
            //counter라는 콜렉션에 있는 totalPost 항목도 1 증가시켜야 함
            db.collection('counter').updateOne({name:'게시물개수'},{ $inc : {totalPost:1} },function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });
    });
});


app.get('/list', function(요청, 응답){
    
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    });

});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다' });
    })
})