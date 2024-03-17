type User = {
    name: string;
    age: number;
};

function isAdult(user: User): boolean {
    return user.age >= 18;
}

const justine: User = {
    name: 'Justine',
    age: 23,
};

const isJustineAnAdult: boolean = isAdult(justine);

console.log(isJustineAnAdult)

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})