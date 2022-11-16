// db = connect('mongodb+srv://quizproquo:Gebru12@quizproquo.fmurj.mongodb.net/QuizDB?retryWrites=true&w=majority');
//Need to confirm the endpoint here from the Yaml files

db.users.drop(); //drop table if exists

//sample data here
db.users.insertMany([
    {
        name: 'Mimi',
        score: "13",
    },

    {
        name: 'Peritract',
        score: "25",
    },

    {
        name: 'Fifi',
        score: "2",
    },

])
